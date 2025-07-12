import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Download,
  Edit3,
  Trash2,
  Plus,
  FileText,
  Eye,
  Calendar,
  Clock,
  Search,
  X,
  Filter,
  Grid3X3,
  List,
  Loader2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../lib/useAuth";
import PDFPreviewModal from "../PDFPreviewModal/PDFPreviewModal";

import { FaFileAlt } from "react-icons/fa";

const ExamsPage = () => {
  const { deptName, courseName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  // Check if user has admin access (logged in and is admin)
  const hasAdminAccess = isAuthenticated && isAdmin;

  const [exams, setExams] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [pdfPreviewModal, setPdfPreviewModal] = useState({
    isOpen: false,
    pdfUrl: "",
    examTitle: "",
  });
  const [loadingExamId, setLoadingExamId] = useState(null);

  // Remove or disable toggleUserRole so userRole cannot be switched
  // const toggleUserRole = () => {
  //   setUserRole((current) => {
  //     if (current === "student") return "admin";
  //     return "student";
  //   });
  // };

  const uploadInputRef = useRef(null);
  const updateInputRef = useRef(null);

  // Sample exam data for demonstration
  useEffect(() => {
    const sampleExams = [
      {
        id: 1,
        title: "Midterm Exam - Programming Fundamentals",
        type: "Midterm",
        duration: "2 hours",
        date: "2025-02-15",
        totalMarks: 100,
        uploadDate: "2025-01-20",
        status: "Unsolved",
        pdfPath: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      },
      {
        id: 2,
        title: "Quiz 1 - Data Structures",
        type: "Quiz",
        duration: "30 minutes",
        date: "2025-01-25",
        totalMarks: 25,
        uploadDate: "2025-01-15",
        status: "Solved",
        pdfPath: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        id: 3,
        title: "Final Exam - Advanced Programming",
        type: "Final",
        duration: "3 hours",
        date: "2025-03-10",
        totalMarks: 150,
        uploadDate: "2025-01-10",
        status: "Unsolved",
        pdfPath: "/Material/examsmaterial/Midterm2021-2022 (1).pdf",
      },
    ];
    setExams(sampleExams);

    // Save exam count to localStorage for course cards
    localStorage.setItem('examCount', sampleExams.length.toString());
  }, []);

  const selectAll = () => {
    if (selectedIds.length === exams.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(exams.map((exam) => exam.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} exam(s)?`
      )
    ) {
      setExams((prev) => {
        const updatedExams = prev.filter((exam) => !selectedIds.includes(exam.id));
        // Update exam count in localStorage
        localStorage.setItem('examCount', updatedExams.length.toString());
        return updatedExams;
      });
      setSelectedIds([]);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      ["pdf"].includes(file.name.split(".").pop().toLowerCase())
    );

    if (files.length === 0) {
      alert("يرجى اختيار ملفات PDF صالحة فقط.");
      return;
    }

    setLoading(true);

    const newExams = files.map((file, index) => ({
      id: Date.now() + index,
      title: file.name.replace(".pdf", ""),
      type: "Quiz",
      duration: "1 hour",
      date: new Date().toISOString().split("T")[0],
      totalMarks: 50,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "Unsolved",
      pdfPath: URL.createObjectURL(file),
      file: file, // Keep file reference for local access
      isLocalFile: true // Flag to indicate this is a local file
    }));

    setExams((prev) => {
      const updatedExams = [...prev, ...newExams];
      // Update exam count in localStorage
      localStorage.setItem('examCount', updatedExams.length.toString());
      return updatedExams;
    });
    setLoading(false);

    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
    notification.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>تم رفع ${files.length} امتحان بنجاح! 🎉</span>
    `;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);

    // Auto-preview the first uploaded exam
    if (newExams.length > 0) {
      const firstUploadedExam = newExams[0];
      console.log(`🔍 Auto-previewing uploaded exam: ${firstUploadedExam.title}`);

      // Show preview notification
      const previewNotification = document.createElement('div');
      previewNotification.className = 'fixed top-16 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 max-w-md';
      previewNotification.innerHTML = `
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
        <div class="flex flex-col">
          <span class="font-medium">فتح معاينة الامتحان المرفوع</span>
          <span class="text-xs opacity-90 truncate">${firstUploadedExam.title}</span>
        </div>
      `;
      document.body.appendChild(previewNotification);

      // Remove preview notification after 2 seconds
      setTimeout(() => {
        if (document.body.contains(previewNotification)) {
          document.body.removeChild(previewNotification);
        }
      }, 2000);

      // Open preview after a short delay
      setTimeout(() => {
        handlePreview(firstUploadedExam);
      }, 1500);
    }

    // Clear the input
    e.target.value = "";
  };

  const handleUpdate = (e) => {
    const file = e.target.files[0];
    if (!file || selectedIds.length === 0) return;
    setExams((prev) =>
      prev.map((exam) =>
        selectedIds.includes(exam.id)
          ? { ...exam, title: file.name, file }
          : exam
      )
    );
    setSelectedIds([]);
  };

  const handleTakeExam = (exam) => {
    setLoadingExamId(exam.id);

    // Simulate brief loading before opening modal
    setTimeout(() => {
      setPdfPreviewModal({
        isOpen: true,
        pdfUrl: exam.pdfPath,
        examTitle: exam.title,
      });
      setLoadingExamId(null);
    }, 500);
  };

  const handlePreview = (exam) => {
    setLoadingExamId(exam.id);
    console.log(`🔍 Opening preview for exam: ${exam.title}`, exam);

    // Handle different file sources
    let pdfUrl = exam.pdfPath;

    // If it's an uploaded file with a File object, create a blob URL
    if (exam.file && exam.file instanceof File) {
      pdfUrl = URL.createObjectURL(exam.file);
      console.log(`📁 Created blob URL for uploaded exam: ${pdfUrl}`);
    }

    // If no valid URL, use fallback
    if (!pdfUrl) {
      pdfUrl = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";
      console.log(`⚠️ Using fallback PDF URL`);
    }

    // Simulate brief loading before opening modal
    setTimeout(() => {
      setPdfPreviewModal({
        isOpen: true,
        pdfUrl: pdfUrl,
        examTitle: exam.title,
      });
      setLoadingExamId(null);

      console.log(`✅ Exam preview modal opened with URL: ${pdfUrl}`);

      // Show success notification for uploaded files
      if (exam.isLocalFile || (exam.file && exam.file instanceof File)) {
        const successNotification = document.createElement('div');
        successNotification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        successNotification.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="text-sm">تم فتح الامتحان المرفوع بنجاح!</span>
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

  const closePdfPreview = () => {
    setPdfPreviewModal({
      isOpen: false,
      pdfUrl: "",
      examTitle: "",
    });
  };

  const handleExport = (exam) => {
    // Create temporary anchor element and trigger download
    const link = document.createElement("a");
    link.href = exam.pdfPath;
    link.download = `${exam.title}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);

    console.log("Exported:", exam.title);
  };

  const decodedDeptName = decodeURIComponent(deptName);
  const decodedCourseName = courseName
    ? decodeURIComponent(courseName).replace(/-/g, " ")
    : "";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Solved":
        return "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50 shadow-sm";
      case "Unsolved":
        return "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50 shadow-sm";
      case "Active":
        return "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50 shadow-sm";
      case "Upcoming":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700/50 shadow-sm";
      case "Completed":
        return "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700/50 shadow-sm";
      case "Draft":
        return "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/50 shadow-sm";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700/50 shadow-sm";
    }
  };

  const filteredExams = exams.filter((exam) => {
    const matchesSearchTerm =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTypeFilter =
      selectedExamType === "all" || exam.type === selectedExamType;

    return matchesSearchTerm && matchesTypeFilter;
  });

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
                <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg">
                  <FaFileAlt className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Exams & Assessments
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {decodedDeptName} • {decodedCourseName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Add Exam Button (Admin/Doctor only) */}
              {hasAdminAccess && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => uploadInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Exam</span>
                </motion.button>
              )}

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {exams.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Exams
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
                placeholder="Search exam materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              {/* Exam Type Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <select
                  value={selectedExamType}
                  onChange={(e) => setSelectedExamType(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="Midterm">Midterm</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Final">Final</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
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
              Showing {filteredExams.length} of {exams.length} materials
            </span>
            {searchTerm && <span>Search results for "{searchTerm}"</span>}
          </div>
        </motion.div>

        {/* Selection Controls */}
        {hasAdminAccess && exams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={selectAll}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  {selectedIds.length === exams.length
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
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
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

        {/* Exams Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredExams.map((exam) => (
            <motion.div
              key={exam.id}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70 transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 group relative"
            >
              {/* Selection Checkbox */}
              {hasAdminAccess && (
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    checked={selectedIds.includes(exam.id)}
                    onChange={() => toggleSelect(exam.id)}
                  />
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusColor(
                    exam.status
                  )}`}
                >
                  {exam.status}
                </span>
              </div>

              {/* Exam Header */}
              <div className="relative h-32  from-orange-500 to-red-600 flex items-center justify-center">
                <FaFileAlt className="w-12 h-12 text-white/80" />
                <div className="absolute bottom-2 left-2 text-white text-xs">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{exam.duration}</span>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 text-white text-xs font-semibold">
                  {exam.totalMarks} pts
                </div>
              </div>

              <div className="p-4">
                {/* Exam Info */}
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {exam.title}
                  </h3>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    {exam.type}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{exam.date}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {!hasAdminAccess ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTakeExam(exam)}
                      disabled={loadingExamId === exam.id}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg font-medium transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loadingExamId === exam.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          <span>Preview Exam</span>
                        </>
                      )}
                    </motion.button>
                  ) : (
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePreview(exam)}
                        disabled={loadingExamId === exam.id}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loadingExamId === exam.id ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Loading</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Preview</span>
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleExport(exam)}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export</span>
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredExams.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Exams Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {hasAdminAccess
                ? "Start by creating your first exam or assessment."
                : "Exams and assessments will appear here when they become available."}
            </p>
            {hasAdminAccess && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => uploadInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg"
              >
                Create First Exam
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Hidden File Inputs */}
        <input
          type="file"
          multiple
          ref={uploadInputRef}
          accept="application/pdf,image/*,.doc,.docx"
          className="hidden"
          onChange={handleUpload}
        />
        <input
          type="file"
          ref={updateInputRef}
          accept="application/pdf,image/*,.doc,.docx"
          className="hidden"
          onChange={handleUpdate}
        />

        {/* PDF Preview Modal */}
        <PDFPreviewModal
          isOpen={pdfPreviewModal.isOpen}
          onClose={closePdfPreview}
          pdfUrl={pdfPreviewModal.pdfUrl}
          examTitle={pdfPreviewModal.examTitle}
        />
      </div>
    </div>
  );
};

export default ExamsPage;
