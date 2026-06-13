'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

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
    avatar: '/images/logo.avif',
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
    avatar: '/images/logo.avif',
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
    avatar: '/images/logo.avif',
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
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const isSupabaseActive = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(url && key && key !== 'your-supabase-anon-key-here');
  };



  const sanitizeLoadedUser = (u) => {
    if (!u) return null;
    const lower = (u.name || '').toLowerCase();
    if (lower.includes('bypass') || lower.includes('password') || u.name === 'OAuthBypass123!') {
      u.name = u.email ? u.email.split('@')[0] : 'Member';
      try {
        localStorage.setItem('br_user', JSON.stringify(u));
      } catch (e) {}
    }
    return u;
  };

  const syncProfile = async (authUser, typedPassword = null) => {
    try {
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      let cleanName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email.split('@')[0];

      // Safeguard to prevent bypass tokens or password keys in metadata from polluting the profile name
      const isCorrupted = (nameStr) => {
        const lower = (nameStr || '').toLowerCase();
        if (lower.includes('bypass') || lower.includes('password')) return true;
        if (typedPassword && nameStr === typedPassword) return true;
        return false;
      };

      if (isCorrupted(cleanName)) {
        cleanName = authUser.email.split('@')[0];
      }

      if (error && (error.code === 'PGRST116' || error.message?.includes('0 rows'))) {
        // Create profile row dynamically if it is missing
        const newProfile = {
          id: authUser.id,
          name: cleanName,
          avatar: authUser.user_metadata?.avatar_url || authUser.user_metadata?.avatar || '/images/logo.avif',
          role: authUser.user_metadata?.role || 'Supporter',
          bio: ''
        };
        const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (insertError) {
          console.error('Error inserting missing profile row:', insertError.message, insertError.details, insertError.hint || '');
        } else {
          profile = insertedProfile;
        }
      } else if (profile) {
        // Auto-cleanup check: If display name is set to a bypass key, password placeholder, or matching credentials, clean it
        if (isCorrupted(profile.name)) {
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({ name: cleanName, updated_at: new Date().toISOString() })
            .eq('id', authUser.id)
            .select()
            .single();

          if (updateError) {
            console.error('Error cleaning up password name in profile:', updateError.message, updateError.details, updateError.hint || '');
          } else if (updatedProfile) {
            profile = updatedProfile;
          }
        }
      }

      if (profile) {
        const mergedUser = {
          id: authUser.id,
          email: authUser.email,
          ...profile,
          joinDate: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'June 2026'
        };
        setUser(mergedUser);
        localStorage.setItem('br_user', JSON.stringify(mergedUser));
      } else {
        const fallbackUser = {
          id: authUser.id,
          email: authUser.email,
          name: cleanName,
          avatar: authUser.user_metadata?.avatar || '/images/logo.avif',
          role: authUser.user_metadata?.role || 'Supporter',
          bio: '',
          joinDate: 'June 2026'
        };
        setUser(fallbackUser);
        localStorage.setItem('br_user', JSON.stringify(fallbackUser));
      }
    } catch (err) {
      console.error('Profile sync error:', err);
    }
  };

  // Load from localStorage / Supabase on mount
  useEffect(() => {
    // 1. Load static/mock collections
    const storedPosts = localStorage.getItem('br_posts');
    if (storedPosts) {
      const parsedPosts = JSON.parse(storedPosts).map(p => ({
        ...p,
        avatar: p.avatar && p.avatar.startsWith('/beyond_rare_website') ? p.avatar.replace('/beyond_rare_website', '') : p.avatar
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

    const storedUsers = localStorage.getItem('br_registered_users');
    let usersList = [];
    if (storedUsers) {
      usersList = JSON.parse(storedUsers).map(u => ({
        ...u,
        avatar: u.avatar && u.avatar.startsWith('/beyond_rare_website') ? u.avatar.replace('/beyond_rare_website', '') : u.avatar
      }));
    } else {
      usersList = [
        {
          email: 'aashriya@beyondrare.org',
          name: 'Aashriya Vasamsetti',
          password: 'password123',
          avatar: '/images/logo.avif',
          role: 'Founder & Patient',
          bio: 'Founder of Beyond Rare. Living with McCune-Albright Syndrome. Working to make sure rare disease patients feel more supported, represented, and seen.',
          joinDate: 'June 2026'
        },
        {
          email: 'martin@beyondrare.org',
          name: 'Martin Intilt',
          password: 'password123',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
          role: 'Caregiver',
          bio: 'Caregiver and advocate for my brother. Believer in community strength.',
          joinDate: 'June 2026'
        }
      ];
      localStorage.setItem('br_registered_users', JSON.stringify(usersList));
    }
    setRegisteredUsers(usersList);

    if (isSupabaseActive()) {
      const initSession = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await syncProfile(session.user);
          } else {
            const storedUser = localStorage.getItem('br_user');
            if (storedUser) {
              const parsed = JSON.parse(storedUser);
              setUser(sanitizeLoadedUser(parsed));
            }
          }
        } catch (e) {
          console.error('Failed to get Supabase session on mount:', e);
        }
      };

      initSession();

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await syncProfile(session.user);
        } else {
          setUser(null);
          localStorage.removeItem('br_user');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Fallback local storage auth
      const storedUser = localStorage.getItem('br_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.avatar && parsedUser.avatar.startsWith('/beyond_rare_website')) {
          parsedUser.avatar = parsedUser.avatar.replace('/beyond_rare_website', '');
        }
        setUser(sanitizeLoadedUser(parsedUser));
      }
    }
  }, []);

  const login = async (email, password) => {
    if (isSupabaseActive()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data?.user) {
          await syncProfile(data.user, password);
          setIsAuthModalOpen(false);
          return { success: true };
        }
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // Fallback Mock Login
    const storedUsers = JSON.parse(localStorage.getItem('br_registered_users') || '[]');
    const foundUser = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!foundUser) {
      return { success: false, error: 'User does not exist. Please sign up.' };
    }
    if (foundUser.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
    setUser(foundUser);
    localStorage.setItem('br_user', JSON.stringify(foundUser));
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseActive()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Error signing out of Supabase:', e);
      }
    }
    setUser(null);
    localStorage.removeItem('br_user');
  };

  const register = async (email, name, password, role = 'Supporter') => {
    if (isSupabaseActive()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: password,
          options: {
            data: {
              name,
              role,
              avatar_url: '/images/logo.avif'
            }
          }
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            return await login(email, password);
          }
          return { success: false, error: error.message };
        }

        if (data?.user) {
          // wait slightly for database trigger to run
          await new Promise(resolve => setTimeout(resolve, 600));
          await syncProfile(data.user, password);
          setIsAuthModalOpen(false);
          return { success: true };
        }
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // Fallback Mock Register
    const storedUsers = JSON.parse(localStorage.getItem('br_registered_users') || '[]');
    const exists = storedUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: 'Email already registered. Please log in.' };
    }

    const newUser = {
      email,
      name,
      password,
      avatar: '/images/logo.avif',
      role,
      bio: '',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem('br_registered_users', JSON.stringify(updatedUsers));
    setRegisteredUsers(updatedUsers);

    setUser(newUser);
    localStorage.setItem('br_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const updateProfile = async (updatedData) => {
    if (isSupabaseActive() && user?.id) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: updatedData.name,
            avatar: updatedData.avatar,
            role: updatedData.role,
            bio: updatedData.bio,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) {
          return { success: false, error: error.message };
        }

        // update user auth metadata
        await supabase.auth.updateUser({
          data: {
            name: updatedData.name,
            avatar: updatedData.avatar,
            role: updatedData.role,
            bio: updatedData.bio
          }
        });

        // Sync local state
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          await syncProfile(authUser);
        }
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // Fallback Mock Update Profile
    if (!user) return { success: false, error: 'No active user session.' };

    const storedUsers = JSON.parse(localStorage.getItem('br_registered_users') || '[]');
    const userIndex = storedUsers.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (userIndex === -1) {
      return { success: false, error: 'User not found in registry.' };
    }

    const previousName = user.name;
    const updatedUser = {
      ...storedUsers[userIndex],
      ...updatedData
    };

    storedUsers[userIndex] = updatedUser;
    localStorage.setItem('br_registered_users', JSON.stringify(storedUsers));
    setRegisteredUsers(storedUsers);

    setUser(updatedUser);
    localStorage.setItem('br_user', JSON.stringify(updatedUser));

    // Sync post/comment names and avatars
    const storedPosts = JSON.parse(localStorage.getItem('br_posts') || '[]');
    let postsChanged = false;
    const updatedPosts = (storedPosts.length > 0 ? storedPosts : posts).map(post => {
      let postModified = false;
      let newPost = { ...post };

      if (post.author === previousName) {
        newPost.author = updatedUser.name;
        newPost.avatar = updatedUser.avatar;
        postModified = true;
      }

      if (post.comments && post.comments.length > 0) {
        const updatedComments = post.comments.map(comment => {
          if (comment.author === previousName) {
            return {
              ...comment,
              author: updatedUser.name
            };
          }
          return comment;
        });

        const commentChanged = JSON.stringify(post.comments) !== JSON.stringify(updatedComments);
        if (commentChanged) {
          newPost.comments = updatedComments;
          postModified = true;
        }
      }

      if (postModified) {
        postsChanged = true;
      }
      return newPost;
    });

    if (postsChanged) {
      setPosts(updatedPosts);
      localStorage.setItem('br_posts', JSON.stringify(updatedPosts));
    }

    return { success: true };
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
        updateProfile,
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
