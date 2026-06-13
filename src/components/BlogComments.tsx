'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/utils/supabaseClient';

type Profile = {
  name: string;
  avatar: string;
  role: string;
};

type Comment = {
  id: string;
  post_slug: string;
  user_id: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  profiles?: Profile | Profile[];
};

interface BlogCommentsProps {
  postSlug: string;
}

export default function BlogComments({ postSlug }: BlogCommentsProps) {
  const { user, setIsAuthModalOpen, setAuthMode } = useApp();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Likes states
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [togglingLike, setTogglingLike] = useState(false);

  const isSupabaseConfigured = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(supabase && url && key && key !== 'your-supabase-anon-key-here');
  };

  const activeSupabase = isSupabaseConfigured();

  // Load comments and like counts
  useEffect(() => {
    if (!activeSupabase) {
      setLoadingComments(false);
      return;
    }

    const fetchData = async () => {
      setLoadingComments(true);
      try {
        // 1. Fetch Comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select(`
            id,
            post_slug,
            user_id,
            content,
            is_approved,
            created_at,
            profiles (
              name,
              avatar,
              role
            )
          `)
          .eq('post_slug', postSlug)
          .order('created_at', { ascending: true });

        if (commentsError) throw commentsError;
        setComments(commentsData || []);

        // 2. Fetch Like Count
        const { count, error: countError } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_slug', postSlug);

        if (countError) throw countError;
        setLikesCount(count || 0);

        // 3. Fetch user's like state
        if (user?.id) {
          const { data: userLike, error: userLikeError } = await supabase
            .from('likes')
            .select('id')
            .eq('post_slug', postSlug)
            .eq('user_id', user.id)
            .maybeSingle();

          if (userLikeError && userLikeError.code !== 'PGRST116') {
            console.error('Error fetching user like:', userLikeError);
          }
          setIsLiked(!!userLike);
        } else {
          setIsLiked(false);
        }
      } catch (err) {
        console.error('Error loading comments/likes from Supabase:', err);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchData();
  }, [postSlug, user?.id, activeSupabase]);

  // Ensure the user's profile exists in the profiles table to satisfy foreign key constraints
  const ensureProfileRow = async (session: any) => {
    if (!session?.user) return null;
    const realUserId = session.user.id;
    try {
      const { data: profileCheck, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', realUserId)
        .maybeSingle();

      if (profileCheckError) {
        console.error('Error checking profile:', profileCheckError.message, profileCheckError.details, profileCheckError.hint || '');
      }

      if (!profileCheck) {
        const newProfile = {
          id: realUserId,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Community Member',
          avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.avatar || '/images/logo.avif',
          role: session.user.user_metadata?.role || 'Supporter',
          bio: '',
        };
        const { error: profileInsertError } = await supabase
          .from('profiles')
          .insert(newProfile);
        if (profileInsertError) {
          console.error('Error inserting profile on-demand:', profileInsertError.message, profileInsertError.details, profileInsertError.hint || '');
        }
      }
    } catch (err) {
      console.error('Failed to ensure profile row exists:', err);
    }
    return realUserId;
  };

  // Handle post like/unlike
  const handleLikeToggle = async () => {
    if (!activeSupabase || togglingLike) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    setTogglingLike(true);
    try {
      const realUserId = await ensureProfileRow(session);
      if (!realUserId) throw new Error('No valid session user id');

      if (isLiked) {
        // Delete Like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_slug', postSlug)
          .eq('user_id', realUserId);

        if (error) throw error;
        setIsLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        // Insert Like
        const { error } = await supabase
          .from('likes')
          .insert({
            post_slug: postSlug,
            user_id: realUserId,
          });

        if (error) throw error;
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    } finally {
      setTogglingLike(false);
    }
  };

  // Submit new comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    if (!activeSupabase) {
      alert('Supabase is not configured yet. Please configure Supabase variables in .env.local.');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    setSubmittingComment(true);
    try {
      const realUserId = await ensureProfileRow(session);
      if (!realUserId) throw new Error('No valid session user id');

      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_slug: postSlug,
          user_id: realUserId,
          content: newComment.trim(),
          is_approved: true, // Auto-approved by default in initial setup
        })
        .select(`
          id,
          post_slug,
          user_id,
          content,
          is_approved,
          created_at,
          profiles (
            name,
            avatar,
            role
          )
        `)
        .single();

      if (error) throw error;

      if (data) {
        setComments((prev) => [...prev, data]);
        setNewComment('');
      }
    } catch (err: any) {
      console.error('Error posting comment:', err);
      alert(`Failed to post comment: ${err.message}`);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Delete comment
  const handleCommentDelete = async (commentId: string) => {
    if (!activeSupabase) return;
    if (!confirm('Are you sure you want to delete this comment?')) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      alert('Your session has expired. Please sign in again.');
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', session.user.id);

      if (error) throw error;

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err: any) {
      console.error('Error deleting comment:', err);
      alert(`Failed to delete comment: ${err.message}`);
    }
  };

  // Start edit comment
  const startEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  // Cancel edit comment
  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  // Save edited comment
  const handleCommentUpdate = async (commentId: string) => {
    if (!activeSupabase || !editText.trim() || savingEdit) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      alert('Your session has expired. Please sign in again.');
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    setSavingEdit(true);
    try {
      const { error } = await supabase
        .from('comments')
        .update({
          content: editText.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', commentId)
        .eq('user_id', session.user.id);

      if (error) throw error;

      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, content: editText.trim() } : c))
      );
      setEditingCommentId(null);
      setEditText('');
    } catch (err: any) {
      console.error('Error updating comment:', err);
      alert(`Failed to update comment: ${err.message}`);
    } finally {
      setSavingEdit(false);
    }
  };

  const getProfileData = (comment: Comment) => {
    if (comment.profiles) {
      if (Array.isArray(comment.profiles)) {
        return comment.profiles[0] as Profile;
      }
      return comment.profiles as Profile;
    }
    return {
      name: 'Community Member',
      avatar: '/images/logo.avif',
      role: 'Member',
    };
  };

  return (
    <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800 font-sans">
      {/* Dynamic Interaction Header: Likes & Comments Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white">
          Community Engagement
        </h2>

        {/* Like Button */}
        <button
          onClick={handleLikeToggle}
          disabled={togglingLike || !activeSupabase}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-300 shadow-sm cursor-pointer select-none ${
            isLiked
              ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 scale-105 shadow-md'
              : 'bg-white/75 dark:bg-gray-950/40 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-900'
          }`}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              isLiked ? 'fill-current scale-125' : 'stroke-current'
            }`}
            fill={isLiked ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>
            {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
          </span>
        </button>
      </div>

      {!activeSupabase && (
        <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 rounded-xl text-sm font-medium">
          ⚠️ <strong>Supabase Integration Offline:</strong> Environment variables are not fully configured yet. Please configure your Supabase variables in `.env.local` to enable live database comments and likes.
        </div>
      )}

      {/* Comments section */}
      <div className="space-y-6 mb-10">
        {loadingComments ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-sm font-semibold text-gray-500">Loading comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-white/40 dark:bg-gray-950/20 rounded-2xl border border-white/60 dark:border-gray-800/40 p-6">
            <p className="text-gray-500 font-medium italic">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const profile = getProfileData(comment);
              const isOwner = user?.id && user.id === comment.user_id;

              return (
                <div
                  key={comment.id}
                  className="flex gap-4 p-5 glass-panel rounded-2xl border border-white/60 dark:border-gray-800/40 hover:shadow-md transition-shadow duration-300"
                >
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-purple/20 bg-gray-100 dark:bg-gray-900 shrink-0">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/logo.avif';
                      }}
                    />
                  </div>

                  {/* Comment Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                          {profile.name}
                        </span>
                        {profile.role && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-purple-light dark:bg-brand-purple/10 text-brand-purple-dark dark:text-brand-purple">
                            {profile.role}
                          </span>
                        )}
                      </div>
                      <time className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    </div>

                    {/* Edit Form or Text Content */}
                    {editingCommentId === comment.id ? (
                      <div className="mt-2 space-y-3">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                          className="w-full p-3 text-sm text-gray-800 dark:text-gray-200 bg-white/80 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleCommentUpdate(comment.id)}
                            disabled={savingEdit || !editText.trim()}
                            className="px-3 py-1.5 text-xs font-bold bg-brand-purple hover:bg-brand-purple-dark text-white rounded-lg transition"
                          >
                            {savingEdit ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-line font-medium">
                        {comment.content}
                      </p>
                    )}

                    {/* Owner Action Buttons */}
                    {isOwner && editingCommentId !== comment.id && (
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => startEdit(comment)}
                          className="text-[11px] font-semibold text-brand-purple hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCommentDelete(comment.id)}
                          className="text-[11px] font-semibold text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New comment input form */}
      <div>
        {user ? (
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-purple/20 bg-gray-100 dark:bg-gray-900 shrink-0">
                <img
                  src={user.avatar || '/images/logo.avif'}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={submittingComment || !activeSupabase}
                  required
                  placeholder="Share your thoughts with the community..."
                  rows={4}
                  className="w-full p-4 text-sm text-gray-800 dark:text-gray-200 bg-white/70 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-2xl focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all shadow-sm focus:shadow"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim() || !activeSupabase}
                className="px-6 py-2.5 bg-brand-purple hover:bg-brand-purple-dark disabled:bg-gray-300 disabled:dark:bg-gray-800 disabled:text-gray-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all text-sm cursor-pointer"
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center bg-brand-purple/5 dark:bg-brand-purple/5 rounded-2xl border border-brand-purple/10 p-6 flex flex-col items-center gap-3">
            <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
              Join the conversation! Log in to create comments and like this post.
            </p>
            <button
              onClick={() => {
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }}
              className="px-6 py-2 bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-bold rounded-full shadow transition"
            >
              Sign In to Participate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
