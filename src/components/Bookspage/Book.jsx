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
import PDFPreviewModal from "../PDFPreviewModal/PDFPreviewModal";

import { FaFlask, FaFilePdf, FaVideo, FaBook } from "react-icons/fa";

function BookPage() {
  const { deptName, courseName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  // Check if user has admin access (logged in and is admin)
  const hasAdminAccess = isAuthenticated && isAdmin;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [pdfPreviewModal, setPdfPreviewModal] = useState({
    isOpen: false,
    pdfUrl: "",
    examTitle: "",
  });
  const [loadingBookId, setLoadingBookId] = useState(null);

  const uploadInputRef = useRef(null);
  const updateInputRef = useRef(null);

  // Sample book data for demonstration
  useEffect(() => {
    const sampleBooks = [
      {
        id: 1,
        title: "Introduction to E-learning",
        fileType: "Book",
        size: "3.2 MB",
        uploadDate: "2025-01-20",
        downloadCount: 67,
        description:
          "Comprehensive guide to e-learning methodologies and best practices",
        status: "Available",
        pdfPath: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      },
      {
        id: 2,
        title: "Digital Learning Strategies",
        fileType: "Book",
        size: "4.1 MB",
        uploadDate: "2025-01-15",
        downloadCount: 52,
        description:
          "Advanced strategies for implementing digital learning solutions",
        status: "Available",
        pdfPath: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        id: 3,
        title: "Educational Technology Handbook",
        fileType: "Book",
        size: "5.8 MB",
        uploadDate: "2025-01-10",
        downloadCount: 43,
        description:
          "Complete handbook covering modern educational technology tools",
        status: "Available",
        pdfPath: "https://www.africau.edu/images/default/sample.pdf",
      },
    ];
    setBooks(sampleBooks);

    // Save book count to localStorage for course cards
    localStorage.setItem('bookCount', sampleBooks.length.toString());

    setLoading(false);
  }, []);

  // Helper functions
  const selectAll = () => {
    if (selectedIds.length === filteredBooks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBooks.map((book) => book.id));
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
        `Are you sure you want to delete ${selectedIds.length} book material(s)?`
      )
    ) {
      setBooks((prev) => {
        const updatedBooks = prev.filter((book) => !selectedIds.includes(book.id));
        // Update book count in localStorage
        localStorage.setItem('bookCount', updatedBooks.length.toString());
        return updatedBooks;
      });
      setSelectedIds([]);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      ["doc", "docx", "epub", "txt", "pdf"].includes(
        file.name.split(".").pop().toLowerCase()
      )
    );

    if (files.length === 0) {
      alert("يرجى اختيار ملفات كتب صالحة فقط (PDF, DOC, DOCX, EPUB, TXT).");
      return;
    }

    setLoading(true);

    const newBooks = files.map((file, index) => ({
      id: Date.now() + index,
      title: file.name,
      fileType: "Book",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split("T")[0],
      downloadCount: 0,
      description: "كتاب مرفوع من المستخدم",
      pdfPath: URL.createObjectURL(file),
      file: file, // Keep file reference for local access
      isLocalFile: true // Flag to indicate this is a local file
    }));

    setBooks((prev) => {
      const updatedBooks = [...prev, ...newBooks];
      // Update book count in localStorage
      localStorage.setItem('bookCount', updatedBooks.length.toString());
      return updatedBooks;
    });
    setLoading(false);

    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
    notification.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>تم رفع ${files.length} كتاب بنجاح! 🎉</span>
    `;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);

    // Auto-preview the first uploaded book
    if (newBooks.length > 0) {
      const firstUploadedBook = newBooks[0];
      console.log(`🔍 Auto-previewing uploaded book: ${firstUploadedBook.title}`);

      // Show preview notification
      const previewNotification = document.createElement('div');
      previewNotification.className = 'fixed top-16 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 max-w-md';
      previewNotification.innerHTML = `
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
        <div class="flex flex-col">
          <span class="font-medium">فتح معاينة الكتاب المرفوع</span>
          <span class="text-xs opacity-90 truncate">${firstUploadedBook.title}</span>
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
        handlePreview(firstUploadedBook);
      }, 1500);
    }

    // Clear the input
    e.target.value = "";
  };

  const getFileIcon = () => <FaBook className="text-green-500" />;

  const getFileTypeColor = () =>
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";

  // Download handler
  const handleDownload = (book) => {
    try {
      // Create temporary anchor element and trigger download
      const link = document.createElement("a");
      link.href = book.pdfPath;
      link.download = `${book.title}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);

      // Update download count
      setBooks((prev) =>
        prev.map((b) =>
          b.id === book.id ? { ...b, downloadCount: b.downloadCount + 1 } : b
        )
      );

      console.log("Downloaded:", book.title);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  const handlePreview = (book) => {
    setLoadingBookId(book.id);
    console.log(`🔍 Opening preview for book: ${book.title}`, book);

    // Handle different file sources
    let pdfUrl = book.pdfPath;

    // If it's an uploaded file with a File object, create a blob URL
    if (book.file && book.file instanceof File) {
      pdfUrl = URL.createObjectURL(book.file);
      console.log(`📁 Created blob URL for uploaded book: ${pdfUrl}`);
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
        examTitle: book.title,
      });
      setLoadingBookId(null);

      console.log(`✅ Book preview modal opened with URL: ${pdfUrl}`);

      // Show success notification for uploaded files
      if (book.isLocalFile || (book.file && book.file instanceof File)) {
        const successNotification = document.createElement('div');
        successNotification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        successNotification.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="text-sm">تم فتح الكتاب المرفوع بنجاح!</span>
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

  // Only filter by search term
  const filteredBooks = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase())
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
                <div className="p-4 rounded-2xl bg-gradient-to-r from-accent to-primary text-white shadow-lg">
                  <FaFlask className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Book Materials
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
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-accent to-primary hover:from-primary hover:to-darkblue text-white rounded-xl font-medium transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Material</span>
                </motion.button>
              )}

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {books.length}
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
                placeholder="Search book materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                      ? "bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm"
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
              Showing {filteredBooks.length} of {books.length} materials
            </span>
            {searchTerm && <span>Search results for "{searchTerm}"</span>}
          </div>
        </motion.div>

        {/* Selection Controls */}
        {hasAdminAccess && filteredBooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={selectAll}
                  className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                >
                  {selectedIds.length === filteredBooks.length
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
                    className="flex items-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
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
          {filteredBooks.map((book) => (
            <motion.div
              key={book.id}
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
                    checked={selectedIds.includes(book.id)}
                    onChange={() => toggleSelect(book.id)}
                  />
                </div>
              )}

              {viewMode === "grid" ? (
                // Grid View
                <>
                  <div className="flex items-center justify-center h-20 mb-4  from-lightblue/20 to-accent/20 dark:from-accent/20 dark:to-primary/20 rounded-xl">
                    <div className="text-4xl">{getFileIcon()}</div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${getFileTypeColor()}`}
                    >
                      {book.fileType}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {book.size}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {book.title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {book.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>{book.uploadDate}</span>
                    <span>{book.downloadCount} downloads</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePreview(book)}
                    disabled={loadingBookId === book.id}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loadingBookId === book.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <FaBook className="w-4 h-4" />
                        <span>Preview Book</span>
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
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {book.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${getFileTypeColor()}`}
                      >
                        {book.fileType}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {book.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{book.size}</span>
                      <span>{book.uploadDate}</span>
                      <span>{book.downloadCount} downloads</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePreview(book)}
                    disabled={loadingBookId === book.id}
                    className="flex items-center space-x-2 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loadingBookId === book.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <FaBook className="w-4 h-4" />
                        <span>Preview Book</span>
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaFlask className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {books.length === 0 ? "No Book Materials" : "No Materials Found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {books.length === 0
                ? hasAdminAccess
                  ? "Start by uploading your first book material."
                  : "Book materials will appear here when they become available."
                : "No materials match your current search and filter criteria."}
            </p>
            {hasAdminAccess && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => uploadInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-accent to-primary hover:from-primary hover:to-darkblue text-white rounded-xl font-medium transition-all shadow-lg"
              >
                {books.length === 0 ? "Upload First Material" : "Add Material"}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Hidden File Inputs */}
        <input
          type="file"
          multiple
          ref={uploadInputRef}
          accept=".doc,.docx,.epub,.txt"
          className="hidden"
          onChange={handleUpload}
        />
        <input
          type="file"
          ref={updateInputRef}
          accept=".pdf,.mp4,.avi,.mov,.wmv,.doc,.docx,.epub,.txt"
          className="hidden"
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
}

export default BookPage;
