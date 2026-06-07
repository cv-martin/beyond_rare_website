'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function YourStory() {
  const {
    user,
    posts,
    groups,
    joinedGroups,
    toggleJoinGroup,
    createPost,
    toggleLikePost,
    addComment,
    setIsAuthModalOpen,
    setAuthMode
  } = useApp();

  const [activeGroupId, setActiveGroupId] = useState('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState({}); // { postId: 'comment text' }
  const [expandedComments, setExpandedComments] = useState({}); // { postId: true }

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!user) {
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    if (!newPostContent.trim()) return;

    // Post to the active group, or default to caregivers if 'all' is selected
    const targetGroup = activeGroupId === 'all' ? 'caregivers' : activeGroupId;
    createPost(newPostContent, targetGroup);
    setNewPostContent('');
  };

  const handleAddComment = (postId, e) => {
    e.preventDefault();
    if (!user) {
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    addComment(postId, text.trim());
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  const toggleCommentsExpansion = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const filteredPosts = activeGroupId === 'all'
    ? posts
    : posts.filter(post => post.groupId === activeGroupId);

  const activeGroupInfo = groups.find(g => g.id === activeGroupId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 font-display">Groups Feed</h1>
        <p className="text-gray-600">View groups, connect with peers, and share your personal rare disease journey below.</p>
        <div className="w-12 h-1 bg-brand-purple mx-auto rounded-full mt-4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar: Groups Listing */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 font-display mb-4 flex items-center justify-between">
              <span>Suggested Groups</span>
              <span className="text-xs px-2 py-0.5 bg-brand-purple/10 text-brand-purple rounded-full">
                {groups.length} Groups
              </span>
            </h2>
            <div className="space-y-4">
              {/* 'All Groups' option */}
              <button
                onClick={() => setActiveGroupId('all')}
                className={`w-full text-left p-3.5 rounded-xl border transition duration-150 flex items-center gap-3 ${
                  activeGroupId === 'all'
                    ? 'border-brand-purple bg-brand-lavender/50 text-brand-purple'
                    : 'border-gray-100 bg-brand-cream hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="text-xl">🌐</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">All Groups Feed</p>
                  <p className="text-xs text-gray-500 truncate">View all posts across the community</p>
                </div>
              </button>

              {groups.map((group) => {
                const isJoined = joinedGroups.includes(group.id);
                const isActive = activeGroupId === group.id;

                return (
                  <div
                    key={group.id}
                    className={`p-4 rounded-xl border transition duration-150 ${
                      isActive ? 'border-brand-purple bg-brand-lavender/50' : 'border-gray-100 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3 justify-between mb-2">
                      <button
                        onClick={() => setActiveGroupId(group.id)}
                        className="flex-1 text-left flex items-start gap-3 min-w-0"
                      >
                        <span className="text-2xl p-1 bg-gray-50 rounded-lg">{group.icon}</span>
                        <div className="min-w-0">
                          <p className={`font-bold text-sm leading-tight ${isActive ? 'text-brand-purple' : 'text-gray-900'}`}>
                            {group.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{group.members} Members</p>
                        </div>
                      </button>

                      <button
                        onClick={() => toggleJoinGroup(group.id)}
                        className={`text-xs px-3 py-1.5 font-bold rounded-full transition ${
                          isJoined
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            : 'bg-brand-green hover:bg-brand-green-dark text-white shadow-sm'
                        }`}
                      >
                        {isJoined ? 'Joined' : 'Join'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-650 leading-relaxed pl-11">
                      {group.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Feed area */}
        <section className="lg:col-span-8 space-y-6">
          {/* Active Group Banner info */}
          {activeGroupId !== 'all' && activeGroupInfo && (
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl p-2 bg-brand-lavender rounded-2xl">{activeGroupInfo.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-display">{activeGroupInfo.name}</h2>
                  <p className="text-sm text-gray-600 mt-0.5">{activeGroupInfo.members} members joined</p>
                </div>
              </div>
              <button
                onClick={() => toggleJoinGroup(activeGroupInfo.id)}
                className={`px-5 py-2 text-sm font-semibold rounded-full shadow-sm hover:shadow transition ${
                  joinedGroups.includes(activeGroupInfo.id)
                    ? 'bg-gray-150 hover:bg-gray-250 text-gray-800'
                    : 'bg-brand-green hover:bg-brand-green-dark text-white'
                }`}
              >
                {joinedGroups.includes(activeGroupInfo.id) ? 'Joined' : 'Join Group'}
              </button>
            </div>
          )}

          {/* Create Post Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Share something with the community</h3>
            {user ? (
              <form onSubmit={handleCreatePost} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full border border-gray-200 p-0.5 shrink-0">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-contain rounded-full" />
                  </div>
                  <textarea
                    id="new-post-content"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder={
                      activeGroupId === 'all'
                        ? 'Write a post... (will be published to Caregivers and Allies)'
                        : `Post in ${activeGroupInfo?.name}...`
                    }
                    className="w-full min-h-[90px] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-purple outline-none bg-brand-cream/40 focus:bg-white resize-y transition"
                  />
                </div>
                <div className="flex justify-between items-center pl-13 pt-1">
                  <p className="text-xs text-gray-500">
                    Posting to <span className="font-semibold text-brand-purple">{activeGroupId === 'all' ? 'Caregivers and Allies' : activeGroupInfo?.name}</span>
                  </p>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold rounded-full text-xs shadow-sm hover:shadow transition duration-200"
                  >
                    Publish Post
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-brand-lavender/40 border border-brand-purple/10 rounded-xl p-5 text-center space-y-3">
                <p className="text-sm text-gray-650">You must be logged in to share a post or join groups.</p>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-6 py-2 bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold rounded-full text-xs transition duration-200"
                >
                  Log In & Start Posting
                </button>
              </div>
            )}
          </div>

          {/* Posts Feed List */}
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <article key={post.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                  {/* Post Author / Group Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-gray-100 p-0.5">
                      <img src={post.avatar || '/images/logo.avif'} alt={post.author} className="w-full h-full object-contain rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900 truncate">{post.author}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Posted in <span className="font-semibold text-brand-purple">{post.groupName}</span> • {new Date(post.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-sm text-gray-750 leading-relaxed whitespace-pre-line pl-1">{post.content}</p>

                  {/* Action Counters (Likes / Comments) */}
                  <div className="flex items-center gap-6 pt-3 border-t border-gray-50 text-gray-500 text-xs">
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className={`flex items-center gap-1.5 hover:text-brand-purple transition ${
                        post.isLiked ? 'text-brand-purple font-bold' : ''
                      }`}
                    >
                      <svg className={`w-5 h-5 ${post.isLiked ? 'fill-current' : 'none'}`} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{post.likes} Likes</span>
                    </button>

                    <button
                      onClick={() => toggleCommentsExpansion(post.id)}
                      className="flex items-center gap-1.5 hover:text-brand-purple transition"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{post.comments.length} Comments</span>
                    </button>
                  </div>

                  {/* Expanded Comments Panel */}
                  {expandedComments[post.id] && (
                    <div className="space-y-4 pt-4 border-t border-gray-50 bg-brand-cream/30 p-4 rounded-xl">
                      {post.comments.length > 0 && (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-800">{comment.author}</span>
                                <span className="text-gray-400">{new Date(comment.timestamp).toLocaleDateString()}</span>
                              </div>
                              <p className="text-gray-650 bg-white p-2 rounded border border-gray-100">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comment Input */}
                      {user ? (
                        <form
                          onSubmit={(e) => handleAddComment(post.id, e)}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) =>
                              setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))
                            }
                            placeholder="Write a comment..."
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-brand-purple outline-none transition"
                          />
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-lg text-xs font-semibold shadow-sm transition"
                          >
                            Post
                          </button>
                        </form>
                      ) : (
                        <p className="text-center text-xs text-gray-500 py-1 bg-white/50 border border-dashed rounded-lg">
                          Please login to write comments.
                        </p>
                      )}
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center space-y-2">
                <p className="text-2xl">📭</p>
                <p className="font-bold text-gray-700">No posts yet</p>
                <p className="text-sm text-gray-500">Be the first to share your thoughts in this group!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
