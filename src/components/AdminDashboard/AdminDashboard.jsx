import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UploadsManagement from "./UploadsManagement";
import { exportToCSV, generateDoctorReport } from "./utils";
import {
  Users,
  FileText,
  BookOpen,
  Video,
  ClipboardList,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  BarChart3,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  UserPlus,
  Activity,
  Upload,
  Star,
  Clock,
} from "lucide-react";

// Mock data for demonstration
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Ahmed Hassan",
    email: "ahmed.hassan@university.edu",
    department: "Computer Science",
    joinDate: "2023-01-15",
    lastActivity: "2024-12-15",
    status: "active",
    uploads: {
      pdfs: 25,
      books: 8,
      exams: 12,
      videos: 15,
    },
    recentUploads: [
      {
        type: "pdf",
        name: "Data Structures Lecture 1.pdf",
        date: "2024-12-10",
      },
      { type: "video", name: "Algorithms Tutorial.mp4", date: "2024-12-08" },
      { type: "exam", name: "Midterm Exam - CS101.pdf", date: "2024-12-05" },
    ],
  },
  {
    id: 2,
    name: "Dr. Sarah Mohamed",
    email: "sarah.mohamed@university.edu",
    department: "Mathematics",
    joinDate: "2022-09-20",
    lastActivity: "2024-12-14",
    status: "active",
    uploads: {
      pdfs: 18,
      books: 5,
      exams: 8,
      videos: 22,
    },
    recentUploads: [
      { type: "book", name: "Calculus Fundamentals.pdf", date: "2024-12-12" },
      { type: "pdf", name: "Linear Algebra Notes.pdf", date: "2024-12-09" },
    ],
  },
  {
    id: 3,
    name: "Dr. Omar Ali",
    email: "omar.ali@university.edu",
    department: "Physics",
    joinDate: "2023-03-10",
    lastActivity: "2024-12-13",
    status: "active",
    uploads: {
      pdfs: 30,
      books: 12,
      exams: 15,
      videos: 8,
    },
    recentUploads: [
      { type: "exam", name: "Physics Final Exam.pdf", date: "2024-12-11" },
      { type: "pdf", name: "Quantum Mechanics Ch5.pdf", date: "2024-12-07" },
    ],
  },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [doctors, setDoctors] = useState(mockDoctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://fcihub.onrender.com/user/admin/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setAdmin(data.userData);
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
      }
    };
    fetchAdminProfile();
  }, []);

  // Calculate statistics
  const stats = {
    totalDoctors: doctors.length,
    totalPDFs: doctors.reduce((sum, doc) => sum + doc.uploads.pdfs, 0),
    totalBooks: doctors.reduce((sum, doc) => sum + doc.uploads.books, 0),
    totalExams: doctors.reduce((sum, doc) => sum + doc.uploads.exams, 0),
    totalVideos: doctors.reduce((sum, doc) => sum + doc.uploads.videos, 0),
    totalUploads: doctors.reduce(
      (sum, doc) =>
        sum +
        doc.uploads.pdfs +
        doc.uploads.books +
        doc.uploads.exams +
        doc.uploads.videos,
      0
    ),
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get top contributors
  const topContributors = [...doctors]
    .sort((a, b) => {
      const aTotal =
        a.uploads.pdfs + a.uploads.books + a.uploads.exams + a.uploads.videos;
      const bTotal =
        b.uploads.pdfs + b.uploads.books + b.uploads.exams + b.uploads.videos;
      return bTotal - aTotal;
    })
    .slice(0, 3);

  const handleDeleteDoctor = (doctorId) => {
    setDoctors(doctors.filter((doc) => doc.id !== doctorId));
    setShowDeleteModal(null);
  };

  const handleExportDoctors = () => {
    const reportData = generateDoctorReport(doctors);
    const filename = `doctors-report-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    exportToCSV(reportData, filename);
  };

  const StatCard = ({ icon, title, value, color, trend }) => {
    const IconComponent = icon;
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {value}
            </p>
            {trend && (
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  +{trend}% this month
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <IconComponent className="h-8 w-8 text-white" />
          </div>
        </div>
      </motion.div>
    );
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Instructors"
          value={stats.totalDoctors}
          color="bg-gradient-to-r from-primary to-darkblue"
          trend="12"
        />
        <StatCard
          icon={FileText}
          title="PDF Files"
          value={stats.totalPDFs}
          color="bg-gradient-to-r from-accent to-primary"
          trend="25"
        />
        <StatCard
          icon={BookOpen}
          title="Books"
          value={stats.totalBooks}
          color="bg-gradient-to-r from-lightblue to-accent"
          trend="8"
        />
        <StatCard
          icon={Video}
          title="Videos"
          value={stats.totalVideos}
          color="bg-gradient-to-r from-accent to-lightblue"
          trend="15"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Contributors */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            Top Contributors
          </h3>
          <div className="space-y-4">
            {topContributors.map((doctor, index) => {
              const totalUploads =
                doctor.uploads.pdfs +
                doctor.uploads.books +
                doctor.uploads.exams +
                doctor.uploads.videos;
              return (
                <div
                  key={doctor.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : "bg-orange-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {doctor.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {doctor.department}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {totalUploads}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      uploads
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Activity className="h-5 w-5 text-blue-500 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {doctors
              .flatMap((doctor) =>
                doctor.recentUploads.map((upload, index) => (
                  <div
                    key={`${doctor.id}-${index}`}
                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div
                      className={`p-2 rounded-lg mr-3 ${
                        upload.type === "pdf"
                          ? "bg-red-100 text-red-600"
                          : upload.type === "video"
                          ? "bg-orange-100 text-orange-600"
                          : upload.type === "book"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {upload.type === "pdf" ? (
                        <FileText className="h-4 w-4" />
                      ) : upload.type === "video" ? (
                        <Video className="h-4 w-4" />
                      ) : upload.type === "book" ? (
                        <BookOpen className="h-4 w-4" />
                      ) : (
                        <ClipboardList className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {upload.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        by {doctor.name} • {upload.date}
                      </p>
                    </div>
                  </div>
                ))
              )
              .slice(0, 6)}
          </div>
        </div>
      </div>
    </div>
  );

  const DoctorsTab = () => (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportDoctors}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddDoctorModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Instructor
          </motion.button>
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <motion.div
            key={doctor.id}
            layout
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {doctor.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {doctor.email}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {doctor.department}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(doctor.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <FileText className="h-4 w-4 text-red-600" />
                  <span className="font-bold text-red-600">
                    {doctor.uploads.pdfs}
                  </span>
                </div>
                <p className="text-xs text-red-600 mt-1">PDFs</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                  <span className="font-bold text-purple-600">
                    {doctor.uploads.books}
                  </span>
                </div>
                <p className="text-xs text-purple-600 mt-1">Books</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <ClipboardList className="h-4 w-4 text-blue-600" />
                  <span className="font-bold text-blue-600">
                    {doctor.uploads.exams}
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-1">Exams</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <Video className="h-4 w-4 text-orange-600" />
                  <span className="font-bold text-orange-600">
                    {doctor.uploads.videos}
                  </span>
                </div>
                <p className="text-xs text-orange-600 mt-1">Videos</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Last active: {doctor.lastActivity}
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  doctor.status === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                }`}
              >
                {doctor.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              {admin ? (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{admin.name}</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{admin.email}</p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Instructor Dashboard</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your educational platform</p>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "doctors", label: "Instructors", icon: Users },
            { id: "uploads", label: "Uploads", icon: Upload },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "doctors" && <DoctorsTab />}
            {activeTab === "uploads" && <UploadsManagement />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Instructor Modal */}
      <AddDoctorModal
        isOpen={showAddDoctorModal}
        onClose={() => setShowAddDoctorModal(false)}
        onAdd={(newDoctor) => {
          setDoctors([...doctors, { ...newDoctor, id: Date.now() }]);
          setShowAddDoctorModal(false);
        }}
      />

      {/* Instructor Details Modal */}
      <DoctorDetailsModal
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal !== null}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={() => handleDeleteDoctor(showDeleteModal)}
        doctorName={doctors.find((d) => d.id === showDeleteModal)?.name}
      />
    </div>
  );
};

// Add Instructor Modal Component
const AddDoctorModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    status: "active",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      joinDate: new Date().toISOString().split("T")[0],
      lastActivity: new Date().toISOString().split("T")[0],
      uploads: { pdfs: 0, books: 0, exams: 0, videos: 0 },
      recentUploads: [],
    });
    setFormData({
      name: "",
      email: "",
      password: "",
      department: "",
      status: "active",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Add New Instructor
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department
            </label>
            <select
              required
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Add Instructor
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Instructor Details Modal Component
const DoctorDetailsModal = ({ doctor, onClose }) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {doctor.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{doctor.email}</p>
            <p className="text-blue-600 dark:text-blue-400">
              {doctor.department}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Join Date
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {doctor.joinDate}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last Activity
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {doctor.lastActivity}
            </p>
          </div>
        </div>

        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Upload Statistics
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
            <FileText className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">
              {doctor.uploads.pdfs}
            </p>
            <p className="text-sm text-red-600">PDFs</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
            <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">
              {doctor.uploads.books}
            </p>
            <p className="text-sm text-purple-600">Books</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
            <ClipboardList className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">
              {doctor.uploads.exams}
            </p>
            <p className="text-sm text-blue-600">Exams</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
            <Video className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">
              {doctor.uploads.videos}
            </p>
            <p className="text-sm text-orange-600">Videos</p>
          </div>
        </div>

        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Uploads
        </h4>
        <div className="space-y-3">
          {doctor.recentUploads.map((upload, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-lg mr-3 ${
                    upload.type === "pdf"
                      ? "bg-red-100 text-red-600"
                      : upload.type === "video"
                      ? "bg-orange-100 text-orange-600"
                      : upload.type === "book"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {upload.type === "pdf" ? (
                    <FileText className="h-4 w-4" />
                  ) : upload.type === "video" ? (
                    <Video className="h-4 w-4" />
                  ) : upload.type === "book" ? (
                    <BookOpen className="h-4 w-4" />
                  ) : (
                    <ClipboardList className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {upload.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {upload.date}
                  </p>
                </div>
              </div>
              <button className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  doctorName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
      >
        <div className="flex items-center mb-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full mr-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Instructor
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This action cannot be undone
            </p>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to delete <strong>{doctorName}</strong>? All
          their uploaded files will also be removed.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
