import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Upload,
  Download,
  Edit3,
  Trash2,
  Plus,
  FileText,
  X,
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  Calendar,
  Clock,
  Loader2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../lib/useAuth";
import VideoPreviewModal from "../VideoPreviewModal/VideoPreviewModal";

import { FaFlask, FaFilePdf, FaVideo, FaBook } from "react-icons/fa";

function VideoPage() {
  const { deptName, courseName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  // Check if user has admin access (logged in and is admin)
  const hasAdminAccess = isAuthenticated && isAdmin;

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [videoPreviewModal, setVideoPreviewModal] = useState({
    isOpen: false,
    videoUrl: "",
    videoTitle: "",
  });
  const [loadingVideoId, setLoadingVideoId] = useState(null);

  const uploadInputRef = useRef(null);
  const updateInputRef = useRef(null);

  // Sample video data for demonstration
  useEffect(() => {
    const sampleVideos = [
      {
        id: 1,
        title: "Cosine similarity and Jaccard",
        fileType: "Video",
        size: "45.2 MB",
        uploadDate: "2025-01-20",
        downloadCount: 89,
        description:
          "Comprehensive tutorial on cosine similarity and Jaccard coefficient in machine learning",
        status: "Available",
        videoPath:
          "/Material/videomaterial/Cosine%20similarity%20and%20Jaccard.mp4",
        duration: "12:34",
      },
      {
        id: 2,
        title: "Advanced Data Mining Techniques",
        fileType: "Video",
        size: "67.8 MB",
        uploadDate: "2025-01-15",
        downloadCount: 76,
        description:
          "Deep dive into advanced data mining algorithms and techniques",
        status: "Available",
        videoPath:
          "/Material/videomaterial/Cosine%20similarity%20and%20Jaccard.mp4",
        duration: "18:45",
      },
      {
        id: 3,
        title: "Machine Learning Fundamentals",
        fileType: "Video",
        size: "52.1 MB",
        uploadDate: "2025-01-10",
        downloadCount: 64,
        description:
          "Introduction to core machine learning concepts and applications",
        status: "Available",
        videoPath:
          "/Material/videomaterial/Cosine%20similarity%20and%20Jaccard.mp4",
        duration: "15:22",
      },
    ];
    setVideos(sampleVideos);

    // Save video count to localStorage for course cards
    localStorage.setItem('videoCount', sampleVideos.length.toString());

    setLoading(false);
  }, []);

  // Helper functions
  const selectAll = () => {
    if (selectedIds.length === filteredVideos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVideos.map((video) => video.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} video material(s)?`
      )
    ) {
      setVideos((prev) => {
        const updatedVideos = prev.filter((video) => !selectedIds.includes(video.id));
        // Update video count in localStorage
        localStorage.setItem('videoCount', updatedVideos.length.toString());
        return updatedVideos;
      });
      setSelectedIds([]);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      ["mp4", "avi", "mov", "wmv"].includes(
        file.name.split(".").pop().toLowerCase()
      )
    );

    if (files.length === 0) {
      alert("يرجى اختيار ملفات فيديو صالحة فقط (MP4, AVI, MOV, WMV).");
      return;
    }

    setLoading(true);

    const newVideos = files.map((file, index) => ({
      id: Date.now() + index,
      title: file.name,
      fileType: "Video",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split("T")[0],
      downloadCount: 0,
      description: "فيديو مرفوع من المستخدم",
      videoPath: URL.createObjectURL(file),
      file: file, // Keep file reference for local access
      isLocalFile: true // Flag to indicate this is a local file
    }));

    setVideos((prev) => {
      const updatedVideos = [...prev, ...newVideos];
      // Update video count in localStorage
      localStorage.setItem('videoCount', updatedVideos.length.toString());
      return updatedVideos;
    });
    setLoading(false);

    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
    notification.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>تم رفع ${files.length} فيديو بنجاح! 🎉</span>
    `;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);

    // Auto-play the first uploaded video
    if (newVideos.length > 0) {
      const firstUploadedVideo = newVideos[0];
      console.log(`🔍 Auto-playing uploaded video: ${firstUploadedVideo.title}`);

      // Show preview notification
      const previewNotification = document.createElement('div');
      previewNotification.className = 'fixed top-16 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 max-w-md';
      previewNotification.innerHTML = `
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a1 1 0 001 1h4M9 10V9a1 1 0 011-1h4a1 1 0 011 1v1"></path>
        </svg>
        <div class="flex flex-col">
          <span class="font-medium">تشغيل الفيديو المرفوع</span>
          <span class="text-xs opacity-90 truncate">${firstUploadedVideo.title}</span>
        </div>
      `;
      document.body.appendChild(previewNotification);

      // Remove preview notification after 2 seconds
      setTimeout(() => {
        if (document.body.contains(previewNotification)) {
          document.body.removeChild(previewNotification);
        }
      }, 2000);

      // Open video player after a short delay
      setTimeout(() => {
        handlePreview(firstUploadedVideo);
      }, 1500);
    }

    // Clear the input
    e.target.value = "";
  };

  const getFileIcon = () => <FaVideo className="text-blue-500" />;

  const getFileTypeColor = () =>
    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";

  // Download handler
  const handleDownload = (video) => {
    try {
      // Create temporary anchor element and trigger download
      const link = document.createElement("a");
      link.href = video.videoPath;
      link.download = `${video.title}.mp4`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);

      // Update download count
      setVideos((prev) =>
        prev.map((v) =>
          v.id === video.id ? { ...v, downloadCount: v.downloadCount + 1 } : v
        )
      );

      console.log("Downloaded:", video.title);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  const handlePreview = (video) => {
    setLoadingVideoId(video.id);
    console.log(`🔍 Opening preview for video: ${video.title}`, video);

    // Handle different file sources
    let videoUrl = video.videoPath;

    // If it's an uploaded file with a File object, create a blob URL
    if (video.file && video.file instanceof File) {
      videoUrl = URL.createObjectURL(video.file);
      console.log(`📁 Created blob URL for uploaded video: ${videoUrl}`);
    }

    // If no valid URL, use fallback
    if (!videoUrl) {
      videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
      console.log(`⚠️ Using fallback video URL`);
    }

    // Simulate brief loading before opening modal
    setTimeout(() => {
      setVideoPreviewModal({
        isOpen: true,
        videoUrl: videoUrl,
        videoTitle: video.title,
      });
      setLoadingVideoId(null);

      console.log(`✅ Video preview modal opened with URL: ${videoUrl}`);

      // Show success notification for uploaded files
      if (video.isLocalFile || (video.file && video.file instanceof File)) {
        const successNotification = document.createElement('div');
        successNotification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        successNotification.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="text-sm">تم فتح الفيديو المرفوع بنجاح!</span>
        `;
        document.body.appendChild(successNotification);

        // Remove success notification after 3 seconds
        setTimeout(() => {
          if (document.body.contains(successNotification)) {
            document.body.removeChild(successNotification);
          }
        }, 3000);
      }
    }, 500);
  };

  const closeVideoPreview = () => {
    setVideoPreviewModal({
      isOpen: false,
      videoUrl: "",
      videoTitle: "",
    });
  };

  // Only filter by search term
  const filteredVideos = videos.filter((video) => {
    return (
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const decodedDeptName = decodeURIComponent(deptName);
  const decodedCourseName = courseName
    ? decodeURIComponent(courseName).replace(/-/g, " ")
    : "";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen  from-lightblue via-accent to-primary dark:from-darkblue dark:via-primary dark:to-accent py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  navigate(`/department/${encodeURIComponent(deptName)}`)
                }
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </motion.button>

              <div className="flex items-center space-x-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-darkblue text-white shadow-lg">
                  <FaVideo className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Video Materials
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {decodedDeptName} • {decodedCourseName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Add Material Button */}
              {hasAdminAccess && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => uploadInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-darkblue hover:from-accent hover:to-primary text-white rounded-xl font-medium transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Material</span>
                </motion.button>
              )}

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {videos.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Materials
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search video materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {filteredVideos.length} of {videos.length} materials
            </span>
            {searchTerm && <span>Search results for "{searchTerm}"</span>}
          </div>
        </motion.div>

        {/* Selection Controls */}
        {hasAdminAccess && filteredVideos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={selectAll}
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                >
                  {selectedIds.length === filteredVideos.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
                {selectedIds.length > 0 && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedIds.length} selected
                  </span>
                )}
              </div>

              {selectedIds.length > 0 && (
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateInputRef.current?.click()}
                    className="flex items-center space-x-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Update</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Materials Grid/List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredVideos.map((video) => (
            <motion.div
              key={video.id}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70 transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 group relative ${
                viewMode === "list" ? "flex items-center p-4" : "p-6"
              }`}
            >
              {/* Selection Checkbox */}
              {hasAdminAccess && (
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500"
                    checked={selectedIds.includes(video.id)}
                    onChange={() => toggleSelect(video.id)}
                  />
                </div>
              )}

              {viewMode === "grid" ? (
                // Grid View
                <>
                  <div className="flex items-center justify-center h-20 mb-4  from-lightblue/50 to-accent/50 dark:from-primary/20 dark:to-darkblue/20 rounded-xl">
                    <div className="text-4xl">{getFileIcon()}</div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${getFileTypeColor()}`}
                    >
                      Video
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {video.size}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {video.title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>{video.uploadDate}</span>
                    <span>{video.downloadCount} downloads</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePreview(video)}
                    disabled={loadingVideoId === video.id}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loadingVideoId === video.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <FaVideo className="w-4 h-4" />
                        <span>Preview Video</span>
                      </>
                    )}
                  </motion.button>
                </>
              ) : (
                // List View
                <div className="flex-1 flex items-center space-x-4">
                  <div className="text-2xl">{getFileIcon()}</div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {video.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${getFileTypeColor()}`}
                      >
                        Video
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {video.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{video.size}</span>
                      <span>{video.uploadDate}</span>
                      <span>{video.downloadCount} downloads</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePreview(video)}
                    disabled={loadingVideoId === video.id}
                    className="flex items-center space-x-2 py-2 px-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loadingVideoId === video.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <FaVideo className="w-4 h-4" />
                        <span>Preview Video</span>
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaFlask className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {videos.length === 0
                ? "No Video Materials"
                : "No Materials Found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {videos.length === 0
                ? hasAdminAccess
                  ? "Start by uploading your first video material."
                  : "Video materials will appear here when they become available."
                : "No materials match your current search and filter criteria."}
            </p>
            {hasAdminAccess && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => uploadInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-primary to-darkblue hover:from-accent hover:to-primary text-white rounded-xl font-medium transition-all shadow-lg"
              >
                {videos.length === 0 ? "Upload First Material" : "Add Material"}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Hidden File Inputs */}
        <input
          type="file"
          multiple
          ref={uploadInputRef}
          accept=".mp4,.avi,.mov,.wmv"
          className="hidden"
          onChange={handleUpload}
        />
        <input
          type="file"
          ref={updateInputRef}
          accept=".pdf,.mp4,.avi,.mov,.wmv,.doc,.docx,.epub,.txt"
          className="hidden"
        />

        {/* Video Preview Modal */}
        <VideoPreviewModal
          isOpen={videoPreviewModal.isOpen}
          onClose={closeVideoPreview}
          videoUrl={videoPreviewModal.videoUrl}
          videoTitle={videoPreviewModal.videoTitle}
        />
      </div>
    </div>
  );
}

export default VideoPage;
