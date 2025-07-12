import React, { useState, useEffect } from "react";
import FCI from "../../assets/image/fci2.svg";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "./homeswiper.css";
import apiService from "../../lib/api";
import { useAuth } from "../../lib/useAuth";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  FaCalendarAlt,
  FaArrowRight,
  FaUsers,
  FaMapMarkerAlt,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaPlus,
  FaTimes,
  FaUpload,
  FaTrash,
  FaCheck,
} from "react-icons/fa";

export default function HomeSwiper() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    image: null,
    type: "event"
  });
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleAddEvent = () => {
    setShowAddModal(true);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedEvents([]);
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEvents(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.map(event => event.id));
    }
  };

  // Test function to check API endpoint
  const testDeleteEndpoint = async (eventId) => {
    try {
      console.log(`🧪 Testing DELETE endpoint for event ${eventId}`);

      // Get auth token
      const authToken = localStorage.getItem('authToken') || document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1];

      console.log(`🔑 Auth token available: ${authToken ? 'Yes' : 'No'}`);

      // First, let's try to get the event to see if it exists
      const getResponse = await fetch(`https://fcihub.onrender.com/event/${eventId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      });

      console.log(`📡 GET response status: ${getResponse.status}`);

      if (getResponse.ok) {
        const eventData = await getResponse.json();
        console.log(`📄 Event data:`, eventData);
      }

      // Now try the DELETE with auth token
      const deleteResponse = await fetch(`https://fcihub.onrender.com/event/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        mode: 'cors',
      });

      console.log(`🗑️ DELETE response status: ${deleteResponse.status}`);
      console.log(`🗑️ DELETE response headers:`, [...deleteResponse.headers.entries()]);

      const responseText = await deleteResponse.text();
      console.log(`🗑️ DELETE response body:`, responseText);

      return deleteResponse.ok;
    } catch (error) {
      console.error(`❌ Test failed:`, error);
      return false;
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedEvents.length === 0) return;

    // Test the first event before proceeding
    if (selectedEvents.length > 0) {
      console.log(`🧪 Testing delete endpoint with first selected event: ${selectedEvents[0]}`);
      await testDeleteEndpoint(selectedEvents[0]);
    }

    // Confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedEvents.length} selected ${selectedEvents.length === 1 ? 'event' : 'events'}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setDeleting(true);
    try {
      console.log("Deleting events:", selectedEvents);

      // Get auth token for admin authentication
      const authToken = localStorage.getItem('authToken') || document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1];

      if (!authToken) {
        throw new Error('Authentication required. Please log in as admin.');
      }

      // Delete each selected event from the API
      const deletePromises = selectedEvents.map(async (eventId) => {
        try {
          const response = await fetch(`https://fcihub.onrender.com/event/${eventId}`, {
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
            throw new Error(`Failed to delete event ${eventId}: ${response.status} - ${errorText}`);
          }

          // Check if response has content before parsing JSON
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return await response.json();
          } else {
            return { success: true, id: eventId };
          }
        } catch (fetchError) {
          console.error(`Delete failed for event ${eventId}:`, fetchError);
          throw new Error(`Failed to delete event ${eventId}: ${fetchError.message}`);
        }
      });

      // Wait for all deletions to complete
      await Promise.all(deletePromises);

      console.log(`✅ Successfully deleted ${selectedEvents.length} events`);

      // Remove deleted events from the list
      setEvents(prev => prev.filter(event => !selectedEvents.includes(event.id)));
      setSelectedEvents([]);
      setIsSelectionMode(false);

    } catch (error) {
      console.error("❌ Error deleting events:", error);
      // You might want to show a toast notification here
      alert(`Failed to delete some events: ${error.message}`);
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
      type: "event"
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

      console.log("Creating new event:", formData);

      // Call the API to create the event
      const response = await apiService.event.createEvent(formData, authToken);

      console.log("Event created successfully:", response);

      // Close modal and refresh events
      handleCloseModal();

      // Refresh the events list
      window.location.reload();

    } catch (error) {
      console.error("Error creating event:", error);
      alert(`Failed to create event: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.event.getAllEvents();

        if (response && response.data) {
          // Filter events with type "event" and "FCI"
          const eventTypeEvents = response.data.filter(
            (event) => event.type === "event" || event.type === "FCI"
          );
          setEvents(eventTypeEvents);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to format time (placeholder since API doesn't provide time)
  const getEventTime = () => "TBA"; // To Be Announced

  // Helper function to get event location (placeholder)
  const getEventLocation = () => "FCI Campus";

  // Helper function to get attendees count (placeholder)
  const getEventAttendees = () => "TBA";

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-primary text-primary border-lightblue",
      emerald: "bg-accent text-accent border-lightblue",
      orange: "bg-lightblue text-lightblue border-accent",
      darkblue: "bg-darkblue text-darkblue border-primary",
      indigo: "bg-primary text-primary border-accent",
    };
    return colors[color] || colors.blue;
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-16 px-4  from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Upcoming Events
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover exciting events, conferences, and opportunities that will
              enhance your academic journey
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-gray-600 dark:text-gray-300">
              Loading events...
            </span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 px-4  from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Upcoming Events
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover exciting events, conferences, and opportunities that will
              enhance your academic journey
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

  // No events state
  if (events.length === 0) {
    return (
      <section className="py-16 px-4  from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex flex-col items-center justify-center mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Upcoming Events
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
                        onClick={handleAddEvent}
                        className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-darkblue text-white font-medium rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl"
                      >
                        <FaPlus className="w-4 h-4" />
                        <span>Add Event</span>
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
                        <span>{selectedEvents.length === events.length ? 'Deselect All' : 'Select All'}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDeleteSelected}
                        disabled={selectedEvents.length === 0 || deleting}
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
                            <span>Delete ({selectedEvents.length})</span>
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
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover exciting events, conferences, and opportunities that will
              enhance your academic journey
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">
              No events available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4  from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center justify-center mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Upcoming Events
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
                      onClick={handleAddEvent}
                      className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-darkblue text-white font-medium rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FaPlus className="w-4 h-4" />
                      <span>Add Event</span>
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
                      <span>{selectedEvents.length === events.length ? 'Deselect All' : 'Select All'}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDeleteSelected}
                      disabled={selectedEvents.length === 0 || deleting}
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
                          <span>Delete ({selectedEvents.length})</span>
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
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover exciting events, conferences, and opportunities that will
            enhance your academic journey
          </p>
        </div>

        {/* Swiper */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            centeredSlides={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            loop={true}
            speed={600}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="simple-swiper"
          >
            {events.map((event) => (
              <SwiperSlide key={event.id}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300 relative">
                  {/* Selection Checkbox */}
                  {isSelectionMode && (
                    <div className="absolute top-3 right-3 z-10">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSelectEvent(event.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          selectedEvents.includes(event.id)
                            ? 'bg-primary border-primary text-white'
                            : 'bg-white border-gray-300 hover:border-primary'
                        }`}
                      >
                        {selectedEvents.includes(event.id) && (
                          <FaCheck className="w-3 h-3" />
                        )}
                      </motion.button>
                    </div>
                  )}

                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.imageUrl || FCI}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = FCI; // Fallback to default image
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-medium text-white rounded-full bg-primary">
                        Event
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    {/* Date & Time */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="w-3 h-3" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        <span>{getEventTime()}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FaUsers className="w-3 h-3" />
                        <span>{getEventAttendees()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FaMapMarkerAlt className="w-3 h-3" />
                        <span>{getEventLocation()}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-lightblue text-primary hover:bg-primary hover:text-white rounded-lg font-medium transition-all duration-300 group">
                      <span>Learn More</span>
                      <FaArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button className="swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md flex items-center justify-center transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <FaChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>

          <button className="swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md flex items-center justify-center transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <FaChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Add Event Modal */}
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
                  Add New Event
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
                    placeholder="Enter event title"
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
                    placeholder="Enter event description"
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
                      id="event-image-upload"
                    />
                    <label
                      htmlFor="event-image-upload"
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
                    <option value="event">Event</option>
                    <option value="FCI">FCI Event</option>
                    <option value="student">Student Activity</option>
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
                        <span>Create Event</span>
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
}
