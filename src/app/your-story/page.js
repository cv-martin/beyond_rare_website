'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

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
  const [activeTab, setActiveTab] = useState('For You');
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState({}); // { postId: 'comment text' }
  const [expandedComments, setExpandedComments] = useState({}); // { postId: true }
  const [selectedHashtag, setSelectedHashtag] = useState(null);

  // Poll state
  const [pollVote, setPollVote] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('br_poll_vote') || null;
    }
    return null;
  });
  const [pollVotes, setPollVotes] = useState(() => {
    const defaultVotes = { family: 45, online: 30, medical: 15, local: 10 };
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('br_poll_votes');
      if (stored) return JSON.parse(stored);
    }
    return defaultVotes;
  });

  const handleVote = (option) => {
    if (pollVote) return;
    const newVotes = {
      ...pollVotes,
      [option]: (pollVotes[option] || 0) + 1
    };
    setPollVotes(newVotes);
    setPollVote(option);
    if (typeof window !== 'undefined') {
      localStorage.setItem('br_poll_vote', option);
      localStorage.setItem('br_poll_votes', JSON.stringify(newVotes));
    }
  };

  const handleResetVote = () => {
    if (!pollVote) return;
    const newVotes = {
      ...pollVotes,
      [pollVote]: Math.max(0, (pollVotes[pollVote] || 1) - 1)
    };
    setPollVotes(newVotes);
    setPollVote(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('br_poll_vote');
      localStorage.setItem('br_poll_votes', JSON.stringify(newVotes));
    }
  };

  const handleGroupSelect = (groupId) => {
    setActiveGroupId(groupId);
    setSelectedHashtag(null);
  };

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

  const trendingHashtags = [
    { tag: '#CaregiverLife', posts: '1.2k' },
    { tag: '#RareDiseaseWarrior', posts: '850' },
    { tag: '#GeneticResearch', posts: '420' },
    { tag: '#AdvocacyWins', posts: '310' },
    { tag: '#ChronicIllness', posts: '640' }
  ];

  // Filter by group first
  const groupFilteredPosts = activeGroupId === 'all'
    ? posts
    : posts.filter(post => post.groupId === activeGroupId);

  // Filter by hashtag if selected
  const hashtagFilteredPosts = selectedHashtag
    ? groupFilteredPosts.filter(post => post.content.toLowerCase().includes(selectedHashtag.toLowerCase()))
    : groupFilteredPosts;

  // Tab-based post filtering and sorting
  const tabFilteredPosts = (() => {
    let basePosts = [...hashtagFilteredPosts];
    if (activeTab === 'My Groups') {
      return basePosts.filter(p => joinedGroups.includes(p.groupId));
    } else if (activeTab === 'Trending') {
      // Sort by engagement score: likes + comment count * 2
      return basePosts.sort((a, b) => {
        const scoreA = (a.likes || 0) + (a.comments?.length || 0) * 2;
        const scoreB = (b.likes || 0) + (b.comments?.length || 0) * 2;
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        return new Date(b.timestamp) - new Date(a.timestamp); // Recency tie-breaker
      });
    } else {
      // 'For You' - sort by joined groups first, then recency
      return basePosts.sort((a, b) => {
        const aJoined = joinedGroups.includes(a.groupId);
        const bJoined = joinedGroups.includes(b.groupId);
        if (aJoined && !bJoined) return -1;
        if (!aJoined && bJoined) return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
    }
  })();

  const activeGroupInfo = groups.find(g => g.id === activeGroupId);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-brand-cream page-switch-enter">
      {/* SECTION 1: Hero Banner */}
      <section
        className="relative w-full bg-brand-cream px-6 md:px-12 lg:px-24 xl:px-32 pt-16 pb-12"
        style={{
          backgroundImage: 'url(/beyond_rare_website/images/5.avif)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-5xl mx-auto w-full text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display leading-snug text-brand-purple-dark">
            Groups Feed
          </h1>
          <p className="text-lg md:text-xl font-bold leading-relaxed text-brand-purple-dark/95 max-w-2xl mx-auto">
            View groups, connect with peers, and share your personal rare disease journey.
          </p>
          <div className="w-16 h-1.5 bg-brand-purple mx-auto rounded-full mt-6"></div>

          {/* Twitter-style tab switcher */}
          <div className="max-w-lg mx-auto mt-6">
            <div className="glass-panel rounded-2xl p-1.5 flex items-center gap-1 tab-switch-bar">
              {['For You', 'My Groups', 'Trending'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-sm font-extrabold rounded-xl transition-all duration-300 relative ${
                    activeTab === tab
                      ? 'bg-brand-purple text-white shadow-md tab-switch-active'
                      : 'text-brand-purple-dark/70 hover:bg-white/40 hover:text-brand-purple-dark'
                  }`}
                >
                  {tab === 'For You' ? '✨ ' : tab === 'My Groups' ? '👥 ' : '🔥 '}{tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Main Feed Content */}
      <section
        className="relative pt-10 pb-20 px-4 sm:px-6 md:px-12 bg-brand-green-light"
        style={{
          backgroundImage: 'url(/beyond_rare_website/images/4.avif)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Groups Listing */}
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
            <div className="glass-panel rounded-2xl p-5">
              <h2 className="text-base font-bold text-brand-purple-dark font-display mb-4 flex items-center justify-between">
                <span>Suggested Groups</span>
                <span className="text-xs px-2 py-0.5 bg-brand-purple/20 text-brand-purple-dark rounded-full font-semibold">
                  {groups.length} Groups
                </span>
              </h2>
              <div className="space-y-4">
                {/* 'All Groups' option */}
                <button
                  onClick={() => handleGroupSelect('all')}
                  className={`w-full text-left p-3.5 rounded-xl border transition duration-200 flex items-center gap-3 ${
                    activeGroupId === 'all'
                      ? 'border-brand-purple bg-brand-lavender/60 text-brand-purple-dark shadow-sm'
                      : 'border-white/50 bg-white/40 hover:bg-white/60 text-gray-700'
                  }`}
                >
                  <span className="text-xl drop-shadow-sm">🌐</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">All Groups Feed</p>
                    <p className="text-xs text-brand-purple-dark/70 truncate font-semibold">View all posts across the community</p>
                  </div>
                </button>

                {groups.map((group) => {
                  const isJoined = joinedGroups.includes(group.id);
                  const isActive = activeGroupId === group.id;

                  return (
                    <div
                      key={group.id}
                      className={`p-4 rounded-xl border transition duration-200 ${
                        isActive ? 'border-brand-purple bg-brand-lavender/60 shadow-sm' : 'border-white/50 bg-white/40'
                      }`}
                    >
                      <div className="flex items-start gap-3 justify-between mb-2">
                        <button
                          onClick={() => handleGroupSelect(group.id)}
                          className="flex-1 text-left flex items-start gap-3 min-w-0 group-btn"
                        >
                          <span className="text-2xl p-1 bg-white/60 rounded-lg drop-shadow-sm">{group.icon}</span>
                          <div className="min-w-0 pt-0.5">
                            <p className={`font-bold text-sm leading-tight transition-colors ${isActive ? 'text-brand-purple-dark' : 'text-gray-800'}`}>
                              {group.name}
                            </p>
                            <p className="text-xs text-brand-purple-dark/70 mt-0.5 font-bold">{group.members} Members</p>
                          </div>
                        </button>

                        <button
                          onClick={() => toggleJoinGroup(group.id)}
                          className={`text-xs px-3 py-1.5 font-extrabold rounded-full transition shadow-sm hover:shadow ${
                            isJoined
                              ? 'bg-white/70 hover:bg-white text-brand-purple-dark border border-white'
                              : 'bg-brand-green hover:bg-brand-green-dark text-white'
                          }`}
                        >
                          {isJoined ? 'Joined' : 'Join'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed pl-11 font-medium">
                        {group.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Column 2: Main Feed area */}
          <section className="lg:col-span-6 space-y-6">
            {/* Active Group Banner info */}
            {activeGroupId !== 'all' && activeGroupInfo && (
              <div className="glass-panel rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl p-2 bg-brand-lavender/80 rounded-2xl drop-shadow-sm">{activeGroupInfo.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-brand-purple-dark font-display">{activeGroupInfo.name}</h2>
                    <p className="text-sm font-semibold text-brand-purple-dark/80 mt-0.5">{activeGroupInfo.members} members joined</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleJoinGroup(activeGroupInfo.id)}
                  className={`px-5 py-2 text-sm font-extrabold rounded-full shadow-sm hover:shadow transition ${
                    joinedGroups.includes(activeGroupInfo.id)
                      ? 'bg-white/70 hover:bg-white text-brand-purple-dark border border-white'
                      : 'bg-brand-green hover:bg-brand-green-dark text-white'
                  }`}
                >
                  {joinedGroups.includes(activeGroupInfo.id) ? 'Joined' : 'Join Group'}
                </button>
              </div>
            )}

            {/* Filter indicator */}
            {selectedHashtag && (
              <div className="glass-panel rounded-2xl p-4 flex items-center justify-between bg-brand-lavender/40 border border-brand-purple/20">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-brand-purple-dark">
                    Showing posts tagged with <span className="font-extrabold text-brand-purple">{selectedHashtag}</span>
                  </span>
                </div>
                <button
                  onClick={() => setSelectedHashtag(null)}
                  className="text-xs px-3 py-1.5 bg-white/80 hover:bg-white text-brand-purple-dark border border-brand-purple/20 rounded-full font-extrabold shadow-sm transition"
                >
                  Clear Filter ✕
                </button>
              </div>
            )}

            {/* Create Post Card */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-brand-purple-dark/60 mb-3">Share something with the community</h3>
              {user ? (
                <form onSubmit={handleCreatePost} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white p-0.5 shrink-0 bg-brand-cream drop-shadow-sm">
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
                      className="w-full min-h-[90px] border border-white/50 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-purple outline-none bg-white/50 focus:bg-white/80 resize-y transition shadow-inner font-medium text-gray-800 placeholder-gray-500"
                    />
                  </div>
                  <div className="flex justify-between items-center pl-13 pt-1">
                    <p className="text-xs font-semibold text-brand-purple-dark/70">
                      Posting to <span className="font-extrabold text-brand-purple-dark">{activeGroupId === 'all' ? 'Caregivers and Allies' : activeGroupInfo?.name}</span>
                    </p>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold rounded-full text-xs shadow-sm hover:shadow transition duration-200"
                    >
                      Publish Post
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-brand-lavender/40 border border-brand-purple/10 rounded-xl p-5 text-center space-y-3">
                  <p className="text-sm font-semibold text-brand-purple-dark">You must be logged in to share a post or join groups.</p>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-6 py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold rounded-full text-xs shadow-sm hover:shadow transition duration-200"
                  >
                    Log In & Start Posting
                  </button>
                </div>
              )}
            </div>

            {/* Posts Feed List */}
            <div className="space-y-6">
              {tabFilteredPosts.length > 0 ? (
                tabFilteredPosts.map((post, index) => {
                  const isJoinedGroup = joinedGroups.includes(post.groupId);
                  return (
                    <article key={post.id} className="glass-panel rounded-2xl p-6 space-y-4 relative overflow-hidden transition-all duration-300 hover:shadow-md">
                      {/* Post Author / Group Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full border-2 border-white/50 bg-white shadow-sm shrink-0 overflow-hidden flex items-center justify-center">
                            <img src={post.avatar || '/beyond_rare_website/images/logo.avif'} alt={post.author} className="w-full h-full object-contain rounded-full" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-extrabold text-sm text-brand-purple-dark truncate">{post.author}</p>
                              {activeTab === 'For You' && isJoinedGroup && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-brand-purple/10 text-brand-purple-dark rounded-full border border-brand-purple/20">
                                  ✨ Followed Group
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-brand-purple-dark/60 mt-0.5">
                              Posted in <span className="font-extrabold text-brand-purple-dark">{post.groupName}</span> • {new Date(post.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Trending Rank Badge */}
                        {activeTab === 'Trending' && (
                          <span className="text-xs font-extrabold px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-full flex items-center gap-1 border border-amber-500/20 shadow-sm animate-pulse shrink-0">
                            🔥 #{index + 1}
                          </span>
                        )}
                      </div>

                      {/* Post Content */}
                      <p className="text-sm text-gray-800 font-medium leading-relaxed whitespace-pre-line pl-1">{post.content}</p>

                      {/* Action Counters (Likes / Comments) */}
                      <div className="flex items-center gap-6 pt-3 border-t border-brand-purple/10 text-brand-purple-dark/70 text-xs font-bold">
                        <button
                          onClick={() => toggleLikePost(post.id)}
                          className={`flex items-center gap-1.5 hover:text-brand-purple transition transform active:scale-95 ${
                            post.isLiked ? 'text-brand-purple' : ''
                          }`}
                        >
                          <svg className={`w-5 h-5 transition-transform ${post.isLiked ? 'fill-current scale-110' : 'none'}`} viewBox="0 0 24 24" stroke="currentColor">
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
                        <div className="space-y-4 pt-4 border-t border-brand-purple/10 bg-white/40 p-4 rounded-xl">
                          {post.comments.length > 0 && (
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                              {post.comments.map((comment) => (
                                <div key={comment.id} className="text-xs space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-brand-purple-dark">{comment.author}</span>
                                    <span className="text-brand-purple-dark/50 font-semibold">{new Date(comment.timestamp).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-gray-800 font-medium bg-white/60 p-2.5 rounded-lg border border-white shadow-sm">{comment.content}</p>
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
                                className="w-full px-3 py-2 text-xs rounded-lg border border-white/80 bg-white/60 focus:bg-white focus:outline-none focus:border-brand-purple outline-none transition font-medium text-gray-800 placeholder-gray-500 shadow-inner"
                              />
                              <button
                                type="submit"
                                className="px-5 py-2 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-lg text-xs font-extrabold shadow-sm hover:shadow transition"
                              >
                                Post
                              </button>
                            </form>
                          ) : (
                            <p className="text-center text-xs font-semibold text-brand-purple-dark/70 py-2 bg-white/40 border border-brand-purple/20 border-dashed rounded-lg">
                              Please login to write comments.
                            </p>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })
              ) : (
                <div className="glass-panel rounded-2xl p-10 text-center space-y-3">
                  <p className="text-5xl drop-shadow-sm">📭</p>
                  <p className="font-extrabold text-brand-purple-dark text-xl">Nothing here yet</p>
                  <p className="text-sm font-semibold text-brand-purple-dark/70">
                    {activeTab === 'My Groups' ? "Join some groups first, then their posts will appear here!" : "Be the first to share your thoughts in this group!"}
                  </p>
                  {activeTab === 'My Groups' && (
                    <button onClick={() => setActiveTab('For You')} className="inline-block px-6 py-2.5 text-xs font-extrabold text-white bg-brand-purple hover:bg-brand-purple-dark rounded-full shadow-sm hover:shadow transition duration-200 mt-2">
                      Browse All Posts →
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Column 3: Trends and Polls */}
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
            {/* Card 1: Trending Hashtags */}
            <div className="glass-panel rounded-2xl p-5">
              <h2 className="text-base font-extrabold text-brand-purple-dark font-display mb-3 flex items-center gap-2">
                <span>⚡ What's Happening</span>
              </h2>
              <div className="space-y-3">
                {trendingHashtags.map(({ tag, posts: count }) => {
                  const isSelected = selectedHashtag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedHashtag(isSelected ? null : tag)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 flex flex-col ${
                        isSelected
                          ? 'border-brand-purple bg-brand-lavender/60 text-brand-purple-dark shadow-sm'
                          : 'border-transparent bg-white/30 hover:bg-white/60 hover:border-white/50 text-gray-700'
                      }`}
                    >
                      <span className="font-extrabold text-xs text-brand-purple-dark">{tag}</span>
                      <span className="text-[10px] text-brand-purple-dark/60 font-semibold mt-0.5">{count} Posts</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Interactive Community Poll */}
            <div className="glass-panel rounded-2xl p-5">
              <h2 className="text-base font-extrabold text-brand-purple-dark font-display mb-3 flex items-center gap-2">
                <span>📊 Community Poll</span>
              </h2>
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-800 leading-relaxed">
                  What is your biggest source of support in your rare disease journey?
                </p>

                {pollVote ? (
                  // Results View
                  <div className="space-y-3">
                    {(() => {
                      const total = Object.values(pollVotes).reduce((sum, v) => sum + v, 0) || 1;
                      const optionsList = [
                        { key: 'family', label: '👨‍👩‍👧 Family & Friends' },
                        { key: 'online', label: '🌐 Online Communities' },
                        { key: 'medical', label: '🩺 Medical Professionals' },
                        { key: 'local', label: '👥 Local Support Groups' }
                      ];

                      return (
                        <>
                          {optionsList.map(({ key, label }) => {
                            const votes = pollVotes[key] || 0;
                            const pct = Math.round((votes / total) * 100);
                            const isUserSelection = pollVote === key;

                            return (
                              <div key={key} className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold text-gray-700">
                                  <span className={isUserSelection ? 'text-brand-purple-dark font-extrabold' : ''}>
                                    {label} {isUserSelection && '✓'}
                                  </span>
                                  <span>{pct}%</span>
                                </div>
                                <div className="w-full h-2 bg-white/40 rounded-full overflow-hidden border border-white/40">
                                  <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                      isUserSelection ? 'bg-brand-purple' : 'bg-brand-green/70'
                                    }`}
                                    style={{ width: `${pct}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                          <div className="pt-2 flex items-center justify-between">
                            <span className="text-[10px] text-brand-purple-dark/60 font-semibold">
                              {total} votes cast
                            </span>
                            <button
                              onClick={handleResetVote}
                              className="text-[10px] text-brand-purple hover:text-brand-purple-dark font-extrabold underline bg-transparent border-none p-0 cursor-pointer"
                            >
                              Change Vote
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  // Interactive Options View
                  <div className="space-y-2">
                    {[
                      { key: 'family', label: '👨‍👩‍👧 Family & Friends' },
                      { key: 'online', label: '🌐 Online Communities' },
                      { key: 'medical', label: '🩺 Medical Professionals' },
                      { key: 'local', label: '👥 Local Support Groups' }
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => handleVote(key)}
                        className="w-full text-left p-2.5 rounded-xl border border-white/50 bg-white/40 hover:bg-brand-purple/10 hover:border-brand-purple/30 text-xs font-bold text-gray-700 transition duration-200"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Card 3: Advocate Spotlight */}
            <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-brand-purple bg-gradient-to-br from-white/70 to-brand-lavender/30">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-purple-dark/70 mb-2">
                🌟 Community Voice
              </h3>
              <p className="text-xs font-medium italic text-gray-700 leading-relaxed">
                "Though our conditions are rare, our collective voices form a powerful chorus of strength and progress."
              </p>
              <p className="text-[10px] font-extrabold text-brand-purple-dark mt-2">
                — Elena R., Advocate
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
