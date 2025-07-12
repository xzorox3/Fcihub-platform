import React, { useState, useMemo, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/useAuth";
import {
  User,
  Mail,
  Calendar,
  GraduationCap,
  Award,
  Settings,
  BarChart3,
  AlertCircle,
  Loader2,
} from "lucide-react";
import apiService from "../../lib/api";

const ProfileCard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [userRole, setUserRole] = useState("admin"); // Always 'admin' now
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [uploadType, setUploadType] = useState("");

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userData, setUserData] = useState({
    id: null,
    name: "",
    email: "",
    gender: "",
    collage: "Faculty of Computer and Information Sciences", // Fixed typo
    university: "",
    level: "",
    major: "Computer Science",
    universityId: null,
    GPA: null,
    // Additional fields for display
    department: "",
    position: "",
    joinDate: "",
    courses: [
      "Programming Fundamentals",
      "Data Structures",
      "Database Systems"
    ],
  });

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Load user data from backend on component mount
  useEffect(() => {
    if (!isAuthenticated) return; // Don't fetch if not authenticated

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const token =
          localStorage.getItem("token") || apiService.getAuthToken();
        if (!token) {
          setError("No authentication token found. Please log in.");
          setLoading(false);
          return;
        }
        // Only fetch admin profile
        let response = await apiService.user.getAdminProfile();
        setUserRole("admin");
        if (response && response.userData) {
          setUserData((prev) => ({
            ...prev,
            ...response.userData,
            faculty: response.userData.collage || prev.collage,
            department: response.userData.major || prev.department,
            major: response.userData.major || "Computer Science",
            position: "Instructor",
            joinDate: new Date().toLocaleDateString(),
            courses: prev.courses,
          }));
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [isAuthenticated]);

  // Removed file-related state variables

  // Removed file-related computed values

  // Removed file-related functions

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null; // Component will redirect via useEffect
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen  from-lightblue via-accent to-primary dark:from-darkblue dark:via-primary dark:to-accent p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-lg text-gray-600 dark:text-gray-300">
                Loading profile...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen  from-lightblue via-accent to-primary dark:from-darkblue dark:via-primary dark:to-accent p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center space-x-3 text-red-600 dark:text-red-400">
              <AlertCircle className="w-8 h-8" />
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">
                  Error Loading Profile
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  from-lightblue via-accent to-primary dark:from-darkblue dark:via-primary dark:to-accent p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-darkblue p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">
                  {userData.name || "Name not available"}
                </h1>
                <p className="text-primary">
                  {userData.position || "Administrator"}
                </p>
                {/* Remove GPA and student switch */}
              </div>
              {/* Remove student/doctor switch button */}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 font-medium ${
                activeTab === "profile"
                  ? "text-primary border-b-2 border-primary bg-lightblue dark:bg-primary/20"
                  : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark"
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Profile
            </button>
            {/* Removed Uploads tab */}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Profile Information
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg min-h-[80px]">
                        <Mail className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Email
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {userData.email || "---"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg min-h-[80px]">
                        <span className="w-5 h-5 text-primary flex items-center">
                          👤
                        </span>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Gender
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {userData.gender || "---"}
                          </p>
                        </div>
                      </div>
                      {/* Remove universityId for student */}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg min-h-[80px]">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Faculty
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {userData.collage || userData.faculty || "---"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg min-h-[80px]">
                        <Award className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Major
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {userData.major || "Computer Science"}
                          </p>
                        </div>
                      </div>
                      {/* Remove all student-specific fields: University, Level, GPA */}
                    </div>
                  </div>

                  {/* Course Statistics */}
                  <div className="bg-gradient-to-r from-lightblue/20 to-accent/20 dark:from-primary/20 dark:to-darkblue/20 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Teaching Courses
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {userData.courses.map((course, index) => {
                        return (
                          <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center"
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                              {course}
                            </h4>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Removed My Files Tab */}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Settings
                </h2>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Account Settings
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Manage your account preferences and security settings.
                    </p>
                    <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors">
                      Change Password
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Notification Preferences
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Choose how you want to receive notifications.
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          defaultChecked
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          Email notifications
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">
                          SMS notifications
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Removed Quick Stats section */}

            {/* Quick Actions */}
            {userRole === "doctor" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setUploadType("PDF");
                      setShowUploadModal(true);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-lightblue/20 hover:bg-lightblue/30 dark:bg-lightblue/20 dark:hover:bg-lightblue/30 text-lightblue dark:text-accent rounded-lg transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Upload PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      setUploadType("Video");
                      setShowUploadModal(true);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-darkblue/20 hover:bg-darkblue/30 dark:bg-darkblue/20 dark:hover:bg-darkblue/30 text-darkblue dark:text-primary rounded-lg transition-colors"
                  >
                    <Video className="w-5 h-5" />
                    <span>Upload Video</span>
                  </button>

                  <button
                    onClick={() => {
                      setUploadType("Book");
                      setShowUploadModal(true);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-accent/20 hover:bg-accent/30 dark:bg-accent/20 dark:hover:bg-accent/30 text-accent dark:text-lightblue rounded-lg transition-colors"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Upload Book</span>
                  </button>

                  <button
                    onClick={() => {
                      setUploadType("Exam");
                      setShowUploadModal(true);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-lightblue/20 hover:bg-lightblue/30 dark:bg-primary/20 dark:hover:bg-primary/30 text-primary dark:text-accent rounded-lg transition-colors"
                  >
                    <FileCheck className="w-5 h-5" />
                    <span>Upload Exam</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload {uploadType || "File"}
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleFileUpload({
                    name: formData.get("fileName"),
                    type: uploadType || "PDF",
                    course: formData.get("course"),
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    File Name
                  </label>
                  <input
                    type="text"
                    name="fileName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter file name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course
                  </label>
                  <select
                    name="course"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select course...</option>
                    {userData.courses.map((course, index) => (
                      <option key={index} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Drop file here or click to browse
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit File Modal */}
        {showEditModal && editingFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  تعديل الملف
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingFile(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleUpdateFile({
                    name: formData.get("fileName"),
                    course: formData.get("course"),
                    type: formData.get("fileType"),
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    اسم الملف
                  </label>
                  <input
                    type="text"
                    name="fileName"
                    defaultValue={editingFile.name}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="ادخل اسم الملف..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    المادة
                  </label>
                  <select
                    name="course"
                    defaultValue={editingFile.course}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">اختر المادة...</option>
                    {userData.courses.map((course, index) => (
                      <option key={index} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    نوع الملف
                  </label>
                  <select
                    name="fileType"
                    defaultValue={editingFile.type}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Video">فيديو</option>
                    <option value="Book">كتاب</option>
                    <option value="Exam">امتحان</option>
                  </select>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      تاريخ الرفع:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {editingFile.uploadDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      حجم الملف:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {editingFile.size}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    حفظ التعديلات
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingFile(null);
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
