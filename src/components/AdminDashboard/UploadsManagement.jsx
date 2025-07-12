import React, { useState } from "react";
import { motion } from "framer-motion";
import { exportToCSV, generateUploadsReport } from "./utils";
import {
  FileText,
  BookOpen,
  Video,
  ClipboardList,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Calendar,
  User,
  ChevronDown,
  SortAsc,
  SortDesc,
} from "lucide-react";

// Mock uploads data
const mockUploads = [
  {
    id: 1,
    name: "Data Structures Lecture 1.pdf",
    type: "pdf",
    size: "2.5 MB",
    uploadDate: "2024-12-15",
    doctor: "Dr. Ahmed Hassan",
    department: "Computer Science",
    course: "CS101",
    downloads: 45,
    status: "active",
  },
  {
    id: 2,
    name: "Algorithms Tutorial.mp4",
    type: "video",
    size: "125 MB",
    uploadDate: "2024-12-14",
    doctor: "Dr. Ahmed Hassan",
    department: "Computer Science",
    course: "CS102",
    downloads: 23,
    status: "active",
  },
  {
    id: 3,
    name: "Calculus Fundamentals.pdf",
    type: "book",
    size: "5.2 MB",
    uploadDate: "2024-12-13",
    doctor: "Dr. Sarah Mohamed",
    department: "Mathematics",
    course: "MATH101",
    downloads: 67,
    status: "active",
  },
  {
    id: 4,
    name: "Physics Final Exam.pdf",
    type: "exam",
    size: "1.8 MB",
    uploadDate: "2024-12-12",
    doctor: "Dr. Omar Ali",
    department: "Physics",
    course: "PHY201",
    downloads: 89,
    status: "active",
  },
  {
    id: 5,
    name: "Linear Algebra Notes.pdf",
    type: "pdf",
    size: "3.1 MB",
    uploadDate: "2024-12-11",
    doctor: "Dr. Sarah Mohamed",
    department: "Mathematics",
    course: "MATH201",
    downloads: 34,
    status: "active",
  },
];

const UploadsManagement = () => {
  const [uploads, setUploads] = useState(mockUploads);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [sortBy, setSortBy] = useState("uploadDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // Get unique doctors for filter
  const uniqueDoctors = [...new Set(uploads.map((upload) => upload.doctor))];

  // Filter and sort uploads
  const filteredUploads = uploads
    .filter((upload) => {
      const matchesSearch =
        upload.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.course.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || upload.type === filterType;
      const matchesDoctor =
        filterDoctor === "all" || upload.doctor === filterDoctor;
      return matchesSearch && matchesType && matchesDoctor;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "uploadDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === "downloads") {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleExportReport = () => {
    const reportData = generateUploadsReport(filteredUploads);
    const filename = `uploads-report-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    exportToCSV(reportData, filename);
  };

  const handleDelete = (uploadId) => {
    setUploads(uploads.filter((upload) => upload.id !== uploadId));
    setShowDeleteModal(null);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-600" />;
      case "video":
        return <Video className="h-5 w-5 text-orange-600" />;
      case "book":
        return <BookOpen className="h-5 w-5 text-purple-600" />;
      case "exam":
        return <ClipboardList className="h-5 w-5 text-blue-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeBadge = (type) => {
    const colors = {
      pdf: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      video:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      book: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      exam: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[type] || colors.pdf
        }`}
      >
        {type.toUpperCase()}
      </span>
    );
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
    >
      <span>{children}</span>
      {sortBy === field &&
        (sortOrder === "asc" ? (
          <SortAsc className="h-3 w-3" />
        ) : (
          <SortDesc className="h-3 w-3" />
        ))}
    </button>
  );

  const DeleteConfirmationModal = ({ upload, onClose, onConfirm }) => {
    if (!upload) return null;

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
                Delete File
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This action cannot be undone
              </p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete <strong>{upload.name}</strong>?
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

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                PDF Files
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {uploads.filter((u) => u.type === "pdf").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Video className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Videos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {uploads.filter((u) => u.type === "video").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Books</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {uploads.filter((u) => u.type === "book").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <ClipboardList className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Exams</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {uploads.filter((u) => u.type === "exam").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search uploads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF Files</option>
              <option value="video">Videos</option>
              <option value="book">Books</option>
              <option value="exam">Exams</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Doctors</option>
              {uniqueDoctors.map((doctor) => (
                <option key={doctor} value={doctor}>
                  {doctor}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>

          <button
            onClick={handleExportReport}
            className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Uploads Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <SortButton field="name">File Name</SortButton>
                </th>
                <th className="px-6 py-3 text-left">
                  <SortButton field="type">Type</SortButton>
                </th>
                <th className="px-6 py-3 text-left">
                  <SortButton field="doctor">Doctor</SortButton>
                </th>
                <th className="px-6 py-3 text-left">
                  <SortButton field="uploadDate">Upload Date</SortButton>
                </th>
                <th className="px-6 py-3 text-left">
                  <SortButton field="downloads">Downloads</SortButton>
                </th>
                <th className="px-6 py-3 text-left">
                  <SortButton field="size">Size</SortButton>
                </th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUploads.map((upload) => (
                <motion.tr
                  key={upload.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getTypeIcon(upload.type)}
                      <div className="ml-3">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {upload.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {upload.course}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getTypeBadge(upload.type)}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {upload.doctor}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {upload.department}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      {upload.uploadDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {upload.downloads}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {upload.size}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(upload)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        upload={showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={() => handleDelete(showDeleteModal.id)}
      />
    </div>
  );
};

export default UploadsManagement;
