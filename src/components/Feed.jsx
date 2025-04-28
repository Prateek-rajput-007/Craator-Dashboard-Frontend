import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Feed = ({ token, savedPosts, addToast, setCredits, onSavePost, onActivityUpdate }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Feed useEffect triggered with token:', token);
    const fetchFeed = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/feed/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(response.data || []);
      } catch (error) {
        console.error('Feed fetch error:', error.response?.data || error.message);
        if (error.response?.status === 404) {
          addToast('Feed not found. Please check the API endpoint.', 'error');
        } else if (error.response?.status === 401) {
          addToast('Session expired. Please log in again.', 'error');
        } else {
          addToast('Error fetching feed: ' + (error.response?.data?.message || error.message), 'error');
        }
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchFeed();
    } else {
      setLoading(false);
      addToast('No token provided. Please log in.', 'error');
    }
  }, [token, addToast]);

  const handleSave = async (postId) => {
    console.log('Saving post with ID:', postId);
    try {
      const response = await axios.post(`http://localhost:5000/api/feed/${postId}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCredits(response.data.credits);
      setPosts(posts.map(post => post._id === postId ? { ...post, saved: true } : post));
      onSavePost(postId); // Notify parent to update savedPosts
      onActivityUpdate({
        action: 'save_post',
        details: `Post ${postId} saved`,
        timestamp: Date.now(), // Add a timestamp for the activity
      });
      addToast('Post saved successfully! Earned 5 credits.', 'success');
    } catch (error) {
      console.error('Save post error:', error.response?.data || error.message);
      if (error.response?.status === 404) {
        addToast('Post not found.', 'error');
      } else if (error.response?.status === 400) {
        addToast(error.response?.data?.message || 'Post already saved.', 'error');
      } else if (error.response?.status === 401) {
        addToast('Session expired. Please log in again.', 'error');
      } else {
        addToast('Error saving post: ' + (error.response?.data?.message || error.message), 'error');
      }
    }
  };

  const handleShare = (url) => {
    navigator.clipboard.writeText(url);
    addToast('Link copied to clipboard!', 'success');
  };

  const handleReport = async (postId) => {
    console.log('Reporting post with ID:', postId);
    try {
      const response = await axios.post(`http://localhost:5000/api/feed/${postId}/report`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCredits(response.data.credits);
      setPosts(posts.map(post => post._id === postId ? { ...post, reported: true } : post));
      onActivityUpdate({
        action: 'report_post',
        details: `Post ${postId} reported`,
        timestamp: Date.now(), // Add a timestamp for the activity
      });
      addToast('Post reported successfully! Earned 3 credits.', 'success');
    } catch (error) {
      console.error('Report post error:', error.response?.data || error.message);
      if (error.response?.status === 404) {
        addToast('Post not found.', 'error');
      } else if (error.response?.status === 400) {
        addToast(error.response?.data?.message || 'Post already reported.', 'error');
      } else if (error.response?.status === 401) {
        addToast('Session expired. Please log in again.', 'error');
      } else {
        addToast('Error reporting post: ' + (error.response?.data?.message || error.message), 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-10 w-10 text-blue-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-300">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Social Feed</h3>
      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
        {posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">No posts available.</p>
        ) : (
          posts.map(post => (
            <div 
              key={post._id} 
              className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-200"
            >
              <p className="text-gray-900 dark:text-white mb-2">{post.content}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Source: {post.source} | Author: {post.author} | {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleSave(post._id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                    savedPosts.includes(post._id) || post.saved 
                      ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  disabled={savedPosts.includes(post._id) || post.saved}
                >
                  Save
                </button>
                <button
                  onClick={() => handleShare(post.url)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition duration-200"
                >
                  Share
                </button>
                <button
                  onClick={() => handleReport(post._id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                    post.reported 
                      ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' 
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                  disabled={post.reported}
                >
                  Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;