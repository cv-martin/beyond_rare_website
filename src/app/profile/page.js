'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

const PRESET_AVATARS = [
  { name: 'Warm Smile', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60' },
  { name: 'Neutral Portrait', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60' },
  { name: 'Gentle Expression', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=60' },
  { name: 'Bright Eyes', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60' },
  { name: 'Warm Gaze', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60' },
  { name: 'Friendly Face', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=60' },
  { name: 'Modern Character', url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=60' },
  { name: 'Beyond Rare Emblem', url: '/images/logo.avif' }
];

export default function ProfilePage() {
  const { user, posts, updateProfile, setIsAuthModalOpen, setAuthMode } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('Supporter');
  const [avatar, setAvatar] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync form inputs when user is loaded or changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setRole(user.role || 'Supporter');
      setAvatar(user.avatar || '/images/logo.avif');
      
      // Check if current avatar is custom (not in presets)
      const isPreset = PRESET_AVATARS.some(a => a.url === user.avatar);
      if (!isPreset && user.avatar && user.avatar !== '/images/logo.avif') {
        setCustomAvatarUrl(user.avatar);
      } else {
        setCustomAvatarUrl('');
      }
    }
  }, [user, isEditing]);

  const handleLoginClick = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    const selectedAvatar = customAvatarUrl.trim() ? customAvatarUrl.trim() : avatar;

    const result = updateProfile({
      name: name.trim(),
      bio: bio.trim(),
      role,
      avatar: selectedAvatar
    });

    if (result && result.success) {
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      // Auto fade out success message
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setError(result?.error || 'Failed to update profile.');
    }
  };

  // Filter posts authored by user (we match by name or by profile picture as primary keys)
  const myPosts = user 
    ? posts.filter(post => post.author.toLowerCase() === user.name.toLowerCase()) 
    : [];

  // Get total engagement (likes + comments) across my posts
  const totalLikes = myPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalComments = myPosts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);

  // Styled role connection badge helper
  const getRoleBadge = (roleName) => {
    switch (roleName) {
      case 'Founder & Patient':
      case 'Patient':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Caregiver':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Advocate':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Medical Professional':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Access Denied Screen (If not logged in)
  if (!user) {
    return (
      <div className="flex-grow flex flex-col justify-center items-center py-20 px-6 bg-brand-cream page-switch-enter">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-white/50 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-brand-purple/10 text-brand-purple rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
            🔒
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-brand-purple-dark font-display">Access Restricted</h2>
            <p className="text-sm font-semibold text-gray-600 leading-relaxed">
              Please log in or register a free account to customize your patient profile, track your forum feed, and share your personal journey.
            </p>
          </div>
          <button
            onClick={handleLoginClick}
            className="w-full py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold rounded-full shadow-md hover:shadow-lg transition duration-200 text-sm"
          >
            Log In or Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-brand-cream pb-20 page-switch-enter">
      {/* Header Banner */}
      <section
        className="relative w-full bg-brand-cream px-6 md:px-12 lg:px-24 xl:px-32 pt-16 pb-12"
        style={{
          backgroundImage: 'url(/images/5.avif)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-6xl mx-auto w-full space-y-2 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold font-display leading-snug text-brand-purple-dark">
            Member Profile
          </h1>
          <p className="text-sm font-bold leading-relaxed text-brand-purple-dark/85">
            View your dashboard, update your background story, and track your active voice in the rare community.
          </p>
          <div className="w-16 h-1 bg-brand-purple rounded-full mt-4 mx-auto lg:mx-0"></div>
        </div>
      </section>

      {/* Main Dashboard Area */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold rounded-2xl flex items-center gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUMN 1: Profile Details Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-white/50 shadow-xl relative overflow-hidden">
              {/* Profile View Mode */}
              {!isEditing ? (
                <div className="flex flex-col items-center text-center space-y-4 pt-4">
                  {/* Glowing Avatar */}
                  <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white shrink-0 relative hover:scale-105 transition duration-300">
                    <img
                      src={user.avatar || '/images/logo.avif'}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Name and Role */}
                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-brand-purple-dark font-display leading-tight">{user.name}</h2>
                    <span className={`inline-block px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full border ${getRoleBadge(user.role)}`}>
                      {user.role || 'Supporter'}
                    </span>
                  </div>

                  <p className="text-[10px] font-bold text-gray-500">
                    Joined in {user.joinDate || 'June 2026'}
                  </p>

                  {/* Bio */}
                  <div className="w-full border-t border-brand-purple/10 pt-4">
                    <p className="text-xs text-gray-700 leading-relaxed font-semibold italic">
                      {user.bio ? `"${user.bio}"` : '"No bio written yet. Introduce yourself to the community!"'}
                    </p>
                  </div>

                  {/* Stats Counter */}
                  <div className="w-full grid grid-cols-3 gap-2 py-3 bg-brand-lavender/40 border border-brand-purple/10 rounded-2xl text-center">
                    <div>
                      <p className="text-base font-black text-brand-purple-dark">{myPosts.length}</p>
                      <p className="text-[8px] font-extrabold uppercase text-brand-purple-dark/60 tracking-wider">Posts</p>
                    </div>
                    <div>
                      <p className="text-base font-black text-brand-purple-dark">{totalLikes}</p>
                      <p className="text-[8px] font-extrabold uppercase text-brand-purple-dark/60 tracking-wider">Likes</p>
                    </div>
                    <div>
                      <p className="text-base font-black text-brand-purple-dark">{totalComments}</p>
                      <p className="text-[8px] font-extrabold uppercase text-brand-purple-dark/60 tracking-wider">Comments</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold rounded-xl text-xs transition duration-200 shadow-sm"
                  >
                    Edit Profile Details
                  </button>
                </div>
              ) : (
                /* Profile Edit Mode Form */
                <form onSubmit={handleSave} className="space-y-4">
                  <h3 className="text-base font-black text-brand-purple-dark font-display border-b border-brand-purple/10 pb-2">
                    Update Details
                  </h3>

                  {error && (
                    <p className="text-[11px] font-bold text-red-650 bg-red-50 p-2 rounded-lg border border-red-200">
                      ⚠️ {error}
                    </p>
                  )}

                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-600 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      data-clarity-mask="true"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="My Name"
                      className="w-full px-3 py-2 border border-gray-200 bg-white/70 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none rounded-xl text-xs text-gray-800 font-semibold transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-600 uppercase tracking-wider mb-1">Connection Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 bg-white/70 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none rounded-xl text-xs text-gray-700 font-semibold transition"
                    >
                      <option value="Patient">Rare Disease Patient</option>
                      <option value="Caregiver">Caregiver / Ally</option>
                      <option value="Advocate">Advocate</option>
                      <option value="Medical Professional">Medical Professional</option>
                      <option value="Supporter">General Supporter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-600 uppercase tracking-wider mb-1">Short Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={180}
                      data-clarity-mask="true"
                      placeholder="Share a short summary of your rare condition, caregiver goals, or advocacy details..."
                      className="w-full min-h-[70px] px-3 py-2 border border-gray-200 bg-white/70 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none rounded-xl text-xs text-gray-800 font-medium resize-none transition"
                    />
                    <span className="block text-[9px] text-right text-gray-400 font-semibold">{180 - bio.length} chars remaining</span>
                  </div>

                  {/* Avatar Picker Grid */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-600 uppercase tracking-wider mb-1.5">Choose Avatar Profile Picture</label>
                    <div className="grid grid-cols-4 gap-2 border border-gray-100 p-2 rounded-xl bg-white/50">
                      {PRESET_AVATARS.map((av, idx) => {
                        const isSelected = avatar === av.url && !customAvatarUrl;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setAvatar(av.url);
                              setCustomAvatarUrl('');
                            }}
                            className={`w-10 h-10 rounded-full overflow-hidden border-2 relative transition hover:scale-105 shrink-0 ${
                              isSelected ? 'border-brand-purple scale-110 shadow-md' : 'border-transparent opacity-85'
                            }`}
                          >
                            <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Avatar URL Field */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-600 uppercase tracking-wider mb-1">Or Enter Custom Image URL</label>
                    <input
                      type="url"
                      data-clarity-mask="true"
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-3 py-2 border border-gray-200 bg-white/70 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none rounded-xl text-xs text-gray-800 font-medium transition"
                    />
                  </div>

                  {/* Form Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="py-2.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-extrabold rounded-xl text-xs transition duration-200 text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold rounded-xl text-xs transition duration-200 text-center shadow-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* COLUMN 2: My Contributions Feed */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-white/50 shadow-xl">
              <h3 className="text-base font-black text-brand-purple-dark font-display mb-5 border-b border-brand-purple/10 pb-3 flex items-center justify-between">
                <span>📝 My Contributions ({myPosts.length})</span>
                <Link
                  href="/your-story"
                  className="text-xs text-brand-purple hover:text-brand-purple-dark hover:underline font-extrabold"
                >
                  Write a Post +
                </Link>
              </h3>

              <div className="space-y-4">
                {myPosts.length > 0 ? (
                  myPosts.map((post) => (
                    <article
                      key={post.id}
                      className="p-4 bg-white/60 hover:bg-white border border-white/50 rounded-2xl shadow-sm hover:shadow transition duration-200 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-extrabold text-brand-purple-dark/65 uppercase tracking-wider">
                            Posted in <span className="font-black">{post.groupName}</span>
                          </p>
                          <p className="text-[9px] font-bold text-gray-400 mt-0.5">
                            {new Date(post.timestamp).toLocaleDateString()}
                          </p>
                        </div>

                        <span className="text-[9px] font-extrabold bg-brand-lavender/50 text-brand-purple-dark border border-brand-purple/20 px-2 py-0.5 rounded-full">
                          Community Story
                        </span>
                      </div>

                      <p className="text-xs text-gray-800 font-semibold leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>

                      <div className="flex gap-4 text-[10px] font-extrabold text-brand-purple-dark/75 pt-2 border-t border-brand-purple/5">
                        <span className="flex items-center gap-1">
                          ❤️ {post.likes} Likes
                        </span>
                        <span className="flex items-center gap-1">
                          💬 {post.comments?.length || 0} Comments
                        </span>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="text-center py-12 space-y-3">
                    <span className="text-4xl">💭</span>
                    <p className="text-sm font-black text-brand-purple-dark">No stories posted yet</p>
                    <p className="text-xs text-brand-purple-dark/65 max-w-sm mx-auto font-semibold leading-relaxed">
                      You haven't shared a post in the forums yet. Introduce yourself or share your caregiving tips with the community!
                    </p>
                    <Link
                      href="/your-story"
                      className="inline-block mt-2 px-6 py-2 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-full text-xs font-extrabold shadow-sm transition"
                    >
                      Go to Forums & Post
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
