import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaCode,
  FaTrophy,
  FaGamepad,
  FaHeart,
  FaSpinner,
  FaPlus,
  FaTimes,
  FaUpload,
  FaCalendarAlt,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import Group1 from "../../assets/image/group1.jpg";
import Group2 from "../../assets/image/group2.jpg";
import Group3 from "../../assets/image/group3.jpg";
import Group5 from "../../assets/image/group5.jpg";
import apiService from "../../lib/api";
import { useAuth } from "../../lib/useAuth";

// Default fallback images for different activity types
const defaultImages = [Group1, Group2, Group3, Group5];

// Icon mapping for different activity types
const getActivityIcon = (index) => {
  const icons = [
    <FaCode className="w-5 h-5" />,
    <FaTrophy className="w-5 h-5" />,
    <FaGamepad className="w-5 h-5" />,
    <FaHeart className="w-5 h-5" />,
  ];
  return icons[index % icons.length];
};

const StudentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    image: null,
    type: "student"
  });
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { isAuthenticated } = useAuth();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleAddActivities = () => {
    setShowAddModal(true);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedActivities([]);
  };

  const handleSelectActivity = (activityId) => {
    setSelectedActivities(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId);
      } else {
        return [...prev, activityId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedActivities.length === activities.length) {
      setSelectedActivities([]);
    } else {
      setSelectedActivities(activities.map(activity => activity.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedActivities.length === 0) return;

    // Confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedActivities.length} selected ${selectedActivities.length === 1 ? 'activity' : 'activities'}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setDeleting(true);
    try {
      console.log("Deleting activities:", selectedActivities);

      // Get auth token for admin authentication
      const authToken = localStorage.getItem('authToken') || document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1];

      if (!authToken) {
        throw new Error('Authentication required. Please log in as admin.');
      }

      // Delete each selected activity from the API
      const deletePromises = selectedActivities.map(async (activityId) => {
        try {
          const response = await fetch(`https://fcihub.onrender.com/event/${activityId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            mode: 'cors',
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to delete activity ${activityId}: ${response.status} - ${errorText}`);
          }

          // Check if response has content before parsing JSON
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return await response.json();
          } else {
            return { success: true, id: activityId };
          }
        } catch (fetchError) {
          console.error(`Delete failed for activity ${activityId}:`, fetchError);
          throw new Error(`Failed to delete activity ${activityId}: ${fetchError.message}`);
        }
      });

      // Wait for all deletions to complete
      await Promise.all(deletePromises);

      console.log(`✅ Successfully deleted ${selectedActivities.length} activities`);

      // Remove deleted activities from the list
      setActivities(prev => prev.filter(activity => !selectedActivities.includes(activity.id)));
      setSelectedActivities([]);
      setIsSelectionMode(false);

    } catch (error) {
      console.error("❌ Error deleting activities:", error);
      // You might want to show a toast notification here
      alert(`Failed to delete some activities: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData({
      title: "",
      description: "",
      date: "",
      image: null,
      type: "student"
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Get auth token for admin authentication
      const authToken = localStorage.getItem('authToken') || document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1];

      if (!authToken) {
        throw new Error('Authentication required. Please log in as admin.');
      }

      console.log("Creating new activity:", formData);

      // Call the API to create the activity
      const response = await apiService.event.createEvent(formData, authToken);

      console.log("Activity created successfully:", response);

      // Close modal and refresh activities
      handleCloseModal();

      // Refresh the activities list
      window.location.reload();

    } catch (error) {
      console.error("Error creating activity:", error);
      alert(`Failed to create activity: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Fetch student activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.event.getAllEvents();

        if (response && response.data) {
          // Filter events with type "student"
          const studentActivities = response.data.filter(
            (event) => event.type === "student"
          );

          // Map API data to component format
          const mappedActivities = studentActivities.map((activity, index) => ({
            id: activity.id,
            title: activity.title,
            description: activity.description,
            img:
              activity.imageUrl || defaultImages[index % defaultImages.length],
            icon: getActivityIcon(index),
            date: activity.date,
            createdAt: activity.createdAt,
          }));

          setActivities(mappedActivities);
        }
      } catch (err) {
        console.error("Error fetching student activities:", err);
        setError("Failed to load student activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Student Activities
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Engage in diverse activities that enhance learning and build
              community connections.
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-gray-600 dark:text-gray-300">
              Loading activities...
            </span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Student Activities
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Engage in diverse activities that enhance learning and build
              community connections.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-darkblue transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No activities state
  if (activities.length === 0) {
    return (
      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Student Activities
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Engage in diverse activities that enhance learning and build
              community connections.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">
              No student activities available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex flex-col items-center justify-center mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Student Activities
            </h2>
            {isAuthenticated && (
              <div className="flex items-center space-x-3">
                {!isSelectionMode ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleSelectionMode}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FaTrash className="w-4 h-4" />
                      <span>Delete</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddActivities}
                      className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-darkblue text-white font-medium rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FaPlus className="w-4 h-4" />
                      <span>Add Activities</span>
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSelectAll}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors duration-300"
                    >
                      <FaCheck className="w-4 h-4" />
                      <span>{selectedActivities.length === activities.length ? 'Deselect All' : 'Select All'}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDeleteSelected}
                      disabled={selectedActivities.length === 0 || deleting}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting ? (
                        <>
                          <FaSpinner className="w-4 h-4 animate-spin" />
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <FaTrash className="w-4 h-4" />
                          <span>Delete ({selectedActivities.length})</span>
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleSelectionMode}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-medium rounded-xl transition-colors duration-300"
                    >
                      <FaTimes className="w-4 h-4" />
                      <span>Cancel</span>
                    </motion.button>
                  </>
                )}
              </div>
            )}
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Engage in diverse activities that enhance learning and build
            community connections.
          </p>
        </motion.div>

        {/* Activities Grid */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 relative"
            >
              {/* Selection Checkbox */}
              {isSelectionMode && (
                <div className="absolute top-3 right-3 z-10">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSelectActivity(activity.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedActivities.includes(activity.id)
                        ? 'bg-primary border-primary text-white'
                        : 'bg-white border-gray-300 hover:border-primary'
                    }`}
                  >
                    {selectedActivities.includes(activity.id) && (
                      <FaCheck className="w-3 h-3" />
                    )}
                  </motion.button>
                </div>
              )}

              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={activity.img}
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback to default image if API image fails to load
                    e.target.src = defaultImages[index % defaultImages.length];
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Icon */}
                <div className="absolute top-4 left-4 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl text-primary dark:text-lightblue">
                  {activity.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-lightblue transition-colors duration-300">
                  {activity.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Add Activity Modal */}
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Add New Activity
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter activity title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter activity description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <FaUpload className="w-4 h-4" />
                      <span>Choose Image</span>
                    </label>
                    {formData.image && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formData.image.name}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="student">Student Activity</option>
                    <option value="event">Event</option>
                    <option value="FCI">FCI Event</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-3 bg-primary hover:bg-darkblue text-white rounded-xl font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {uploading ? (
                      <>
                        <FaSpinner className="w-4 h-4 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <FaPlus className="w-4 h-4" />
                        <span>Create Activity</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default StudentActivities;
