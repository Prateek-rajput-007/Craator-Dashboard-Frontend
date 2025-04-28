import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SavedPosts = ({ token, savedPosts, addToast }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('SavedPosts useEffect triggered with savedPosts:', savedPosts);
    const fetchSavedPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/feed', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data.filter(post => savedPosts.includes(post._id)) || []);
      } catch (error) {
        console.error('Saved posts fetch error:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          addToast('Session expired. Please log in again.', 'error');
        } else {
          addToast('Error fetching saved posts: ' + (error.response?.data?.message || error.message), 'error');
        }
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchSavedPosts();
    } else {
      setLoading(false);
      addToast('No token provided. Please log in.', 'error');
    }
  }, [token, savedPosts, addToast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <svg className="animate-spin h-10 w-10 text-indigo-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 p-6">
      <h3 className="text-2xl font-bold mb-6 text-white flex items-center space-x-2">
        <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <span>Saved Posts</span>
        <span className="ml-2 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {posts.length}
        </span>
      </h3>
      <div className="flex-1 overflow-y-auto space-y-4">
        {posts.length > 0 ? (
          posts.map(post => (
            <div
              key={post._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-pink-500/20 transition-all duration-300 transform hover:-translate-y-1 hover:rotate-1"
              role="article"
              aria-labelledby={`post-${post._id}-title`}
            >
              <p id={`post-${post._id}-title`} className="text-white font-medium mb-2 line-clamp-3">
                {post.content}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-.172.172-.172-.172a4 4 0 00-5.656 0 4 4 0 000 5.656l5.828 5.828 5.828-5.828a4 4 0 000-5.656z" />
                </svg>
                <span>Source: {post.source}</span>
                <span>|</span>
                <span>Author: {post.author}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-300 text-center italic p-6 bg-gray-800 rounded-lg">
            No saved posts yet. Discover and save your favorite content!
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;