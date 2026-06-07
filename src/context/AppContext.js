'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialGroups = [
  { id: 'caregivers', name: 'Caregivers and Allies', members: 3, icon: '💚', desc: 'Watching and helping someone with a rare disease can be worrisome and heartbreaking. Express concerns and find support.' },
  { id: 'stories', name: 'Rare Disease Stories', members: 1, icon: '❤️', desc: 'A safe space to discuss personal experiences, living with rare diseases, and success stories.' },
  { id: 'community', name: 'General Community', members: 1, icon: '💙', desc: 'Explore events, celebrations, news, etc. Connect with people across various rare diseases.' }
];

const defaultPosts = [
  {
    id: 1,
    author: 'Martin Intilt',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
    groupId: 'caregivers',
    groupName: 'Caregivers and Allies',
    content: 'Very good insight into our daily experiences. #CaregiverLife',
    timestamp: '2026-06-05T14:30:00Z',
    likes: 2,
    comments: [
      { id: 101, author: 'Jane Doe', content: 'Agreed! Thanks for sharing.', timestamp: '2026-06-05T15:00:00Z' }
    ]
  },
  {
    id: 2,
    author: 'Aashriya Vasamsetti',
    avatar: '/beyond_rare_website/images/logo.avif',
    groupId: 'caregivers',
    groupName: 'Caregivers and Allies',
    content: 'Welcome to our group Caregivers and Allies! Watching and helping someone with a rare disease can be worrisome and heartbreaking sometimes. Here you are free to express your concerns or need for support for your loved one with a rare disease freely and receive care from those who are facing or have faced similar experiences 💚 #CaregiverLife #ChronicIllness',
    timestamp: '2026-06-04T09:00:00Z',
    likes: 8,
    comments: []
  },
  {
    id: 3,
    author: 'Aashriya Vasamsetti',
    avatar: '/beyond_rare_website/images/logo.avif',
    groupId: 'stories',
    groupName: 'Rare Disease Stories',
    content: 'Welcome to our group Rare Disease Stories! Here our safe space to discuss our personal experiences with a rare disease, concerns with living with one, and success stories while building a sense of inclusivity so we don\'t feel isolated in our world with a rare disease. Post now and explore the connections and relief you could find ❤️ #RareDiseaseWarrior',
    timestamp: '2026-06-03T10:15:00Z',
    likes: 12,
    comments: []
  },
  {
    id: 4,
    author: 'Aashriya Vasamsetti',
    avatar: '/beyond_rare_website/images/logo.avif',
    groupId: 'community',
    groupName: 'General Community',
    content: 'Welcome to our group General Community! Explore latest events, celebrations, news, etc, and connect with those of various diseases and those in relation. Start by posting your thoughts, sharing media, or creating a poll. #AdvocacyWins',
    timestamp: '2026-06-02T11:00:00Z',
    likes: 5,
    comments: []
  }
];

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState(initialGroups);
  const [joinedGroups, setJoinedGroups] = useState(['caregivers']); // Default joined group
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('br_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.avatar === '/images/logo.avif') parsedUser.avatar = '/beyond_rare_website/images/logo.avif';
      setUser(parsedUser);
    }

    const storedPosts = localStorage.getItem('br_posts');
    if (storedPosts) {
      const parsedPosts = JSON.parse(storedPosts).map(p => ({
        ...p,
        avatar: p.avatar === '/images/logo.avif' ? '/beyond_rare_website/images/logo.avif' : p.avatar
      }));
      setPosts(parsedPosts);
    } else {
      setPosts(defaultPosts);
      localStorage.setItem('br_posts', JSON.stringify(defaultPosts));
    }

    const storedJoinedGroups = localStorage.getItem('br_joined_groups');
    if (storedJoinedGroups) {
      setJoinedGroups(JSON.parse(storedJoinedGroups));
    }
  }, []);

  // Sync state helpers
  const login = (email, name) => {
    const newUser = {
      name: name || email.split('@')[0],
      email,
      avatar: '/beyond_rare_website/images/logo.avif'
    };
    setUser(newUser);
    localStorage.setItem('br_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('br_user');
  };

  const register = (email, name) => {
    login(email, name);
  };

  const toggleJoinGroup = (groupId) => {
    let updated;
    if (joinedGroups.includes(groupId)) {
      updated = joinedGroups.filter(id => id !== groupId);
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, members: Math.max(0, g.members - 1) } : g));
    } else {
      updated = [...joinedGroups, groupId];
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, members: g.members + 1 } : g));
    }
    setJoinedGroups(updated);
    localStorage.setItem('br_joined_groups', JSON.stringify(updated));
  };

  const createPost = (content, groupId) => {
    if (!user) return;
    const group = groups.find(g => g.id === groupId);
    const newPost = {
      id: Date.now(),
      author: user.name,
      avatar: user.avatar,
      groupId,
      groupName: group ? group.name : 'General Community',
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('br_posts', JSON.stringify(updatedPosts));
  };

  const toggleLikePost = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        // Simple local toggle: since we don't have user IDs tracking likes, we just toggle increment/decrement
        const isLiked = post.isLiked;
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !isLiked
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('br_posts', JSON.stringify(updatedPosts));
  };

  const addComment = (postId, commentText) => {
    if (!user) return;
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: Date.now(),
          author: user.name,
          content: commentText,
          timestamp: new Date().toISOString()
        };
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('br_posts', JSON.stringify(updatedPosts));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        posts,
        groups,
        joinedGroups,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        login,
        logout,
        register,
        toggleJoinGroup,
        createPost,
        toggleLikePost,
        addComment
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
