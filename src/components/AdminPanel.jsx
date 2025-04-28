import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';

// Sub-component for User Analytics
const UserAnalytics = memo(({ users, setUsers, token, addToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newCredits, setNewCredits] = useState(0);
  const [creditError, setCreditError] = useState('');

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setNewCredits(user.credits);
    setCreditError('');
    setIsModalOpen(true);
  };

  const handleUpdateCredits = async () => {
    if (newCredits < 0) {
      setCreditError('Credits cannot be negative');
      return;
    }
    if (isNaN(newCredits)) {
      setCreditError('Please enter a valid number');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${selectedUser._id}/credits`, { credits: newCredits }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(user => (user._id === selectedUser._id ? { ...user, credits: newCredits } : user)));
      setIsModalOpen(false);
      addToast('Credits updated successfully!', 'success');
    } catch (error) {
      if (error.response?.status === 401) {
        addToast('Session expired. Please log in again.', 'error');
      } else {
        addToast('Error updating credits: ' + (error.response?.data?.message || error.message), 'error');
      }
    }
    window.location.reload();
  };

  return (
    <div className="mb-8">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2 mb-4">
        <span>User Analytics</span>
        <span className="bg-purple-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full animate-pulse">
  {users.length}
</span>

      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.length > 0 ? (
          users.map((user, index) => (
            <div
              key={user._id}
              className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md group transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 animate__animated animate__pulse"
              style={{ animationDelay: `${index * 0.1}s` }}
              role="region"
              aria-labelledby={`user-${user._id}-email`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-lime-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              <h5 id={`user-${user._id}-email`} className="text-gray-900 dark:text-white font-medium truncate" title={user.email}>
                {user.email}
              </h5>
              <p className="text-gray-500 dark:text-gray-400 text-sm capitalize" title={`Role: ${user.role}`}>
                Role: {user.role}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Credits: {user.credits}
              </p>
              <button
                onClick={() => handleOpenModal(user)}
                className="mt-2 bg-purple-500 text-white px-3 py-1 rounded-lg hover:bg-purple-600 text-sm font-medium transition-all duration-300 transform hover:scale-105"
                aria-label={`Edit credits for ${user.email}`}
              >
                Edit Credits
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-center col-span-full italic">
            No users available.
          </p>
        )}
      </div>

      {/* Credits Update Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full animate__animated animate__fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Update Credits for {selectedUser.email}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="credits" className="block text-gray-800 dark:text-gray-200 mb-1 font-medium">
                New Credits
              </label>
              <input
                id="credits"
                type="number"
                value={newCredits}
                onChange={(e) => {
                  setNewCredits(parseInt(e.target.value) || 0);
                  setCreditError('');
                }}
                className={`w-full p-2 rounded-lg border ${
                  creditError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime-500`}
                min="0"
                aria-describedby="credits-error"
              />
              {creditError && (
                <p id="credits-error" className="text-red-500 text-xs mt-1">
                  {creditError}
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleUpdateCredits}
                className="flex-1 bg-lime-500 text-white p-2 rounded-lg hover:bg-lime-600 font-medium transition-all duration-300 transform hover:scale-105"
                aria-label="Confirm credit update"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 font-medium transition-all duration-300"
                aria-label="Cancel credit update"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// Sub-component for Feed Activity
const FeedActivity = memo(({ feedActivity }) => {
  const [expandedActivity, setExpandedActivity] = useState(null);

  const toggleActivity = (id) => {
    setExpandedActivity(expandedActivity === id ? null : id);
  };

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2 mb-4">
        <span>Feed Activity</span>
        <span className="bg-purple-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full animate-pulse">
  {feedActivity.length}
</span>

      </h4>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {feedActivity.length > 0 ? (
          feedActivity.map((activity, index) => (
            <div
              key={activity._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate__animated animate__pulse"
              style={{ animationDelay: `${index * 0.15}s` }}
              role="log"
              aria-labelledby={`activity-${activity._id}-details`}
            >
              <button
                onClick={() => toggleActivity(activity._id)}
                className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-expanded={expandedActivity === activity._id}
                aria-controls={`activity-${activity._id}-content`}
              >
                <div className="flex-1">
                  <p id={`activity-${activity._id}-details`} className="text-gray-900 dark:text-white line-clamp-1" title={`${activity.userId.email}: ${activity.details}`}>
                    <span className="font-medium">{activity.userId.email}</span>{' '}
                    {activity.action.replace('_', ' ').toLowerCase()}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1" title={new Date(activity.createdAt).toLocaleString()}>
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 text-lime-500 transform transition-transform duration-200 ${
                    expandedActivity === activity._id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                id={`activity-${activity._id}-content`}
                className={`px-4 pb-4 overflow-hidden transition-all duration-300 ${
                  expandedActivity === activity._id ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 text-sm" title={activity.details}>
                  {activity.details}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-center italic p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            No feed activity available.
          </p>
        )}
      </div>
    </div>
  );
});

// Main AdminPanel Component
const AdminPanel = ({ token, addToast }) => {
  const [users, setUsers] = useState([]);
  const [feedActivity, setFeedActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AdminPanel useEffect triggered with token:', token);
    const fetchData = async () => {
      try {
        const [usersRes, feedRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/admin/feed-activity', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsers(usersRes.data || []);
        setFeedActivity(feedRes.data || []);
      } catch (error) {
        if (error.response?.status === 401) {
          addToast('Session expired. Please log in again.', 'error');
        } else {
          addToast('Error fetching data: ' + (error.response?.data?.message || error.message), 'error');
        }
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchData();
    } else {
      setLoading(false);
      addToast('No token provided. Please log in.', 'error');
    }
  }, [token, addToast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <svg className="animate-spin h-10 w-10 text-lime-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 p-6">
      <h3 className="text-2xl font-bold mb-6 text-white flex items-center space-x-2">
        <svg className="w-6 h-6 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1.5v6m0 15v-6m6-6h6m-15 0h-6m6-6V3m0 15v-3m4.24-12.24l4.24-4.24m-12.48 0l-4.24-4.24m12.48 12.48l4.24 4.24m-12.48 0l-4.24 4.24" />
        </svg>
        <span>Admin Control Hub</span>
      </h3>
      <UserAnalytics users={users} setUsers={setUsers} token={token} addToast={addToast} />
      <FeedActivity feedActivity={feedActivity} />
    </div>
  );
};

export default memo(AdminPanel);