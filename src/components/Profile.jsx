

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ token, addToast, setCredits }) => {
  const [profile, setProfile] = useState({ name: '', bio: '', avatar: '' });
  const [tempProfile, setTempProfile] = useState({ name: '', bio: '', avatar: '' });
  const [loading, setLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [errors, setErrors] = useState({ name: '', bio: '', avatar: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://creator-dashboard-backend-syz9.onrender.com/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userProfile = response.data.profile || { name: '', bio: '', avatar: '' };
        setProfile(userProfile);
        setTempProfile(userProfile);
      } catch (error) {
        if (error.response?.status === 401) {
          addToast('Session expired. Please log in again.', 'error');
        } else {
          addToast('Error fetching profile: ' + (error.response?.data?.message || error.message), 'error');
        }
      }
    };
    if (token) {
      fetchProfile();
    }
  }, [token, addToast]);

  const validateInputs = () => {
    const newErrors = { name: '', bio: '', avatar: '' };
    let isValid = true;

    if (tempProfile.name.length > 50) {
      newErrors.name = 'Name must be 50 characters or less';
      isValid = false;
    }
    if (tempProfile.bio.length > 200) {
      newErrors.bio = 'Bio must be 200 characters or less';
      isValid = false;
    }
    if (tempProfile.avatar && !/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(tempProfile.avatar) && !/^data:image\/(jpeg|png|gif|webp);base64,/.test(tempProfile.avatar)) {
      newErrors.avatar = 'Please enter a valid image URL (jpg, png, gif, webp) or base64 image';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdate = async () => {
    if (!validateInputs()) {
      addToast('Please fix the errors before submitting.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put('https://creator-dashboard-backend-syz9.onrender.com/api/user/profile', tempProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data.user.profile);
      setTempProfile(response.data.user.profile);
      setCredits(response.data.user.credits);
      setIsModalOpen(false);
      addToast('Profile updated successfully! Check your credits.', 'success');
    } catch (error) {
      if (error.response?.status === 401) {
        addToast('Session expired. Please log in again.', 'error');
      } else {
        addToast('Error updating profile: ' + (error.response?.data?.message || error.message), 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const value = e.target.value;
    setTempProfile({ ...tempProfile, avatar: value });
    setAvatarError(false);
    setErrors({ ...errors, avatar: '' });
  };

  const handleAvatarError = () => {
    setAvatarError(true);
    setErrors({ ...errors, avatar: 'Invalid image' });
  };

  const openModal = () => {
    setTempProfile(profile);
    setAvatarError(false);
    setErrors({ name: '', bio: '', avatar: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const profileCompletion = () => {
    let completed = 0;
    if (profile.name) completed += 33.33;
    if (profile.bio) completed += 33.33;
    if (profile.avatar && !avatarError) completed += 33.33;
    return Math.round(completed);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      {/* Profile View */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 max-w-sm w-full">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center space-x-2">
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Profile</span>
        </h3>
        <div className="flex flex-col items-center mb-4">
          {profile.avatar && !avatarError ? (
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-purple-200 dark:border-purple-700 mb-3"
              onError={handleAvatarError}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{profile.name || 'No Name'}</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm text-center mt-1">{profile.bio || 'No bio provided'}</p>
          <div className="mt-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {profileCompletion()}% Complete
          </div>
        </div>
        <button
          onClick={openModal}
          className="w-full bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 flex justify-center items-center font-medium transition-all duration-300"
          aria-label="Edit profile"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Profile
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full animate__animated animate__zoomIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Edit Profile</span>
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              Complete your profile to earn credits: 50 for two fields, 100 for all three.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-800 dark:text-gray-200 mb-1 font-medium" htmlFor="avatar">
                  Avatar URL or Base64
                </label>
                <input
                  id="avatar"
                  type="text"
                  value={tempProfile.avatar}
                  onChange={handleAvatarChange}
                  className={`w-full p-2 rounded-lg border ${
                    errors.avatar ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 transition-colors placeholder-gray-400`}
                  placeholder="Enter image URL or base64 (jpg, png, gif, webp)"
                  aria-describedby={errors.avatar ? 'avatar-error' : undefined}
                />
                {errors.avatar && (
                  <p id="avatar-error" className="text-red-500 text-xs mt-1">
                    {errors.avatar}
                  </p>
                )}
                {tempProfile.avatar && !avatarError ? (
                  <img
                    src={tempProfile.avatar}
                    alt="Avatar Preview"
                    className="w-12 h-12 rounded-full object-cover mt-2"
                    onError={handleAvatarError}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mt-2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-800 dark:text-gray-200 mb-1 font-medium" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={tempProfile.name}
                  onChange={(e) => {
                    setTempProfile({ ...tempProfile, name: e.target.value });
                    setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full p-2 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 transition-colors placeholder-gray-400`}
                  placeholder="Your name"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-red-500 text-xs mt-1">
                    {errors.name}
                  </p>
                )}
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {tempProfile.name.length}/50 characters
                </p>
              </div>
              <div>
                <label className="block text-gray-800 dark:text-gray-200 mb-1 font-medium" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={tempProfile.bio}
                  onChange={(e) => {
                    setTempProfile({ ...tempProfile, bio: e.target.value });
                    setErrors({ ...errors, bio: '' });
                  }}
                  className={`w-full p-2 rounded-lg border ${
                    errors.bio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 transition-colors placeholder-gray-400 resize-y`}
                  rows="3"
                  placeholder="Tell us about yourself"
                  aria-describedby={errors.bio ? 'bio-error' : undefined}
                />
                {errors.bio && (
                  <p id="bio-error" className="text-red-500 text-xs mt-1">
                    {errors.bio}
                  </p>
                )}
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {tempProfile.bio.length}/200 characters
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 flex justify-center items-center font-medium transition-all duration-300 disabled:opacity-50"
                  disabled={loading}
                  aria-label="Save profile changes"
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    'Save'
                  )}
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 flex justify-center items-center font-medium transition-all duration-300"
                  aria-label="Cancel editing"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
