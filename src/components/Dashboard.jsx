import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Feed from './Feed';
import SavedPosts from './SavedPosts';
import Profile from './Profile';
import AdminPanel from './AdminPanel';
import { NavLink, Route, Switch, Redirect } from 'react-router-dom';

const Dashboard = ({ token, role, onLogout, addToast }) => {
  const [credits, setCredits] = useState(0);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [creditsRes, profileRes, activityRes] = await Promise.all([
          axios.get('https://creator-dashboard-backend-syz9.onrender.com/api/user/credits', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://creator-dashboard-backend-syz9.onrender.com/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://creator-dashboard-backend-syz9.onrender.com/api/user/activity', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCredits(creditsRes.data.credits || 0);
        setSavedPosts(profileRes.data.savedPosts || []);
        setActivities(activityRes.data || []);
      } catch (error) {
        if (error.response?.status === 401) {
          addToast('Session expired. Please log in again.', 'error');
          onLogout();
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
      onLogout();
    }
  }, [token, onLogout, addToast]);

  const onSavePost = (postId) => {
    setSavedPosts((prevSavedPosts) => [...prevSavedPosts, postId]);
  };

  const onActivityUpdate = (newActivity) => {
    setActivities((prevActivities) => [newActivity, ...prevActivities]); // Add new activity to the top
  };

  const onCreditsUpdate = (newCredits) => {
    setCredits(newCredits); // Update credits dynamically
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <svg
          className="animate-spin h-12 w-12 text-indigo-500"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Creator Dashboard</h2>
          <button
            className="md:hidden text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2 px-4">
            <li>
              <NavLink
                to="/dashboard/home"
                className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-700 transition-colors"
                activeClassName="bg-indigo-200 dark:bg-indigo-600 font-semibold"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/profile"
                className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-700 transition-colors"
                activeClassName="bg-indigo-200 dark:bg-indigo-600 font-semibold"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/feed"
                className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-700 transition-colors"
                activeClassName="bg-indigo-200 dark:bg-indigo-600 font-semibold"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span>Feed</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/saved"
                className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-700 transition-colors"
                activeClassName="bg-indigo-200 dark:bg-indigo-600 font-semibold"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Saved Posts</span>
              </NavLink>
            </li>
            {role === 'admin' && (
              <li>
                <NavLink
                  to="/dashboard/admin"
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-700 transition-colors"
                  activeClassName="bg-indigo-200 dark:bg-indigo-600 font-semibold"
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Admin Panel</span>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:ml-64">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            className="md:hidden text-gray-300"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-white">
              Credits: <span className="text-indigo-400">{credits}</span>
            </span>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Routes */}
        <Switch>
          <Route path="/dashboard/home">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold mb-4 text-white">Welcome</h3>
                <p className="text-gray-300">
                  Manage your profile, explore the social feed, and track your credits earned through daily logins, profile completion, and feed interactions.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold mb-4 text-white">Your Credits</h3>
                <p className="text-3xl text-indigo-400 mb-2">{credits}</p>
                <p className="text-gray-300">
                  Earn credits by logging in daily (10), completing your profile (up to 100), saving posts (5), and reporting posts (3).
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold mb-4 text-white">Recent Activity</h3>
                <ul className="max-h-40 overflow-y-auto space-y-2">
                  {activities.map((activity) => (
                    <li
                      key={activity._id || activity.timestamp} // Use a unique key
                      className="text-gray-300 py-1 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <span>
                        {activity.action.replace('_', ' ')}: {activity.details} -{' '}
                        {new Date(activity.timestamp || activity.createdAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-3">
                <h3 className="text-xl font-bold mb-4 text-white">Saved Posts</h3>
                <SavedPosts token={token} savedPosts={savedPosts} addToast={addToast} compact />
              </div>
            </div>
          </Route>
          <Route path="/dashboard/feed">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <Feed
                token={token}
                savedPosts={savedPosts}
                addToast={addToast}
                setCredits={setCredits}
                onSavePost={onSavePost}
                onActivityUpdate={onActivityUpdate} // Pass the activity update function
              />
            </div>
          </Route>
          <Route path="/dashboard/profile">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <Profile token={token} addToast={addToast} setCredits={setCredits} />
            </div>
          </Route>
          <Route path="/dashboard/saved">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <SavedPosts token={token} savedPosts={savedPosts} addToast={addToast} />
            </div>
          </Route>
          <Route path="/dashboard/admin">
            {role === 'admin' ? (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <AdminPanel token={token} addToast={addToast} onCreditsUpdate={onCreditsUpdate} />
              </div>
            ) : (
              <Redirect to="/dashboard/home" />
            )}
          </Route>
          <Route path="/dashboard">
            <Redirect to="/dashboard/home" />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Dashboard;
