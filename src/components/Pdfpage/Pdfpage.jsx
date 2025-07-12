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
import materialStorageService from "../../services/materialStorageService";
import {
  FaChalkboardTeacher,
  FaFilePdf,
  FaVideo,
  FaBook,
} from "react-icons/fa";

function PdfPage() {
  const { deptName, courseName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const [pdfs, setPdfs] = useState([]);
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
  const [loadingPdfId, setLoadingPdfId] = useState(null);

  // Check if user has admin access (logged in and is admin)
  const hasAdminAccess = isAuthenticated && isAdmin;

  const uploadInputRef = useRef(null);
  const updateInputRef = useRef(null);

  // Function to load materials
  const loadMaterials = async () => {
    setLoading(true);
    setError(false);

    try {
      // Get course ID from localStorage or use a default
      const courseId = localStorage.getItem("selectedCourseId") || "1";

      console.log(`🔍 Loading materials for course: ${courseId}`);

      // Fetch materials from JSON storage service (static + uploaded)
      const materials = await materialStorageService.fetchMaterialsByCourse(courseId);

      // Format materials for display
      const formattedMaterials = materials.map(material =>
        materialStorageService.formatMaterialForDisplay(material)
      );

      // Add source badges and ensure PDF path
      const materialsWithBadges = formattedMaterials.map(material => ({
        ...material,
        status: "Available",
        pdfPath: material.pdfPath || "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
      }));

      setPdfs(materialsWithBadges);

      // Save PDF count to localStorage for course cards
      localStorage.setItem('pdfCount', materialsWithBadges.length.toString());

      console.log(`✅ Loaded ${materialsWithBadges.length} materials:`, {
        static: materialsWithBadges.filter(m => m.source === 'static').length,
        uploaded: materialsWithBadges.filter(m => m.source === 'uploaded').length,
        cloudinary: materialsWithBadges.filter(m => m.source === 'cloudinary').length
      });

    } catch (error) {
      console.error('❌ Error loading materials:', error);
      setError(true);

      // Fallback to sample data if loading fails
      const fallbackPdfs = [
        {
          id: "fallback_1",
          title: "Sample PDF - Programming Basics",
          fileType: "PDF",
          size: "2.5 MB",
          uploadDate: "2025-01-20",
          downloadCount: 0,
          description: "Sample PDF for demonstration",
          status: "Available",
          source: "sample",
          pdfPath: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
        }
      ];
      setPdfs(fallbackPdfs);
    } finally {
      setLoading(false);
    }
  };

  // Load PDF materials from JSON storage and uploaded materials
  useEffect(() => {
    loadMaterials();
  }, []);

  // Helper functions
  const selectAll = () => {
    if (selectedIds.length === filteredPdfs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPdfs.map((pdf) => pdf.id));
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
    const selectedPdfs = pdfs.filter(pdf => selectedIds.includes(pdf.id));
    const uploadedCount = selectedPdfs.filter(pdf => pdf.source === 'uploaded').length;
    const staticCount = selectedPdfs.filter(pdf => pdf.source === 'static').length;

    let confirmMessage = `هل أنت متأكد من حذف ${selectedIds.length} ملف؟\n\n`;

    if (uploadedCount > 0) {
      confirmMessage += `${uploadedCount} ملف مرفوع (سيتم حذفه نهائياً)\n`;
    }
    if (staticCount > 0) {
      confirmMessage += `${staticCount} ملف ثابت (سيتم إخفاؤه مؤقتاً فقط)\n`;
    }

    if (window.confirm(confirmMessage)) {
      // Delete uploaded materials from storage
      selectedPdfs.forEach(pdf => {
        if (pdf.source === 'uploaded') {
          materialStorageService.deleteUploadedMaterial(pdf.id);
        }
      });

      // Remove from UI
      setPdfs((prev) => {
        const updatedPdfs = prev.filter((pdf) => !selectedIds.includes(pdf.id));
        // Update PDF count in localStorage
        localStorage.setItem('pdfCount', updatedPdfs.length.toString());
        return updatedPdfs;
      });
      setSelectedIds([]);

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
      notification.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
        <span>تم حذف ${selectedIds.length} ملف بنجاح! 🗑️</span>
      `;
      document.body.appendChild(notification);

      // Remove notification after 3 seconds
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
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

    try {
      // Get course information
      const courseId = localStorage.getItem("selectedCourseId") || "1";
      const courseName = localStorage.getItem("selectedCourseTitle") || "General Course";

      console.log(`📤 Uploading ${files.length} file(s) for course: ${courseName} (${courseId})`);

      const newPdfs = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          // Create material object
          const materialData = {
            title: file.name,
            name: file.name,
            fileType: "PDF",
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            uploadDate: new Date().toISOString().split("T")[0],
            downloadCount: 0,
            description: "مادة مرفوعة من المستخدم",
            courseId: courseId,
            courseName: courseName,
            // Create blob URL for immediate preview
            downloadUrl: URL.createObjectURL(file),
            pdfPath: URL.createObjectURL(file),
            file: file, // Keep file reference for local access
            isLocalFile: true // Flag to indicate this is a local file
          };

          // Save to storage service
          const savedMaterial = materialStorageService.saveUploadedMaterial(materialData);

          // Format for display
          const formattedMaterial = materialStorageService.formatMaterialForDisplay(savedMaterial);

          newPdfs.push({
            ...formattedMaterial,
            status: "Available"
          });

          console.log(`✅ Saved material: ${file.name}`);

        } catch (error) {
          console.error(`❌ Failed to save material: ${file.name}`, error);

          // Fallback: add to UI without saving to storage
          newPdfs.push({
            id: `temp_${Date.now()}_${i}`,
            title: file.name,
            fileType: "PDF",
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            uploadDate: new Date().toISOString().split("T")[0],
            downloadCount: 0,
            description: "فشل الحفظ - مؤقت فقط",
            source: "temp",
            status: "Available",
            file: file,
            pdfPath: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
          });
        }
      }

      // Add new materials to the UI
      setPdfs((prev) => {
        const updatedPdfs = [...prev, ...newPdfs];
        // Update PDF count in localStorage
        localStorage.setItem('pdfCount', updatedPdfs.length.toString());
        return updatedPdfs;
      });

      const successCount = newPdfs.filter(pdf => pdf.source === 'uploaded').length;
      const failCount = newPdfs.length - successCount;

      if (successCount > 0) {
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        notification.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>تم رفع ${successCount} ملف بنجاح! 🎉</span>
        `;
        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);

        // Auto-preview the first uploaded file immediately
        if (newPdfs.length > 0) {
          const firstUploadedFile = newPdfs[0];
          console.log(`🔍 Auto-previewing uploaded file: ${firstUploadedFile.title}`);

          // Show preview notification with file name
          const previewNotification = document.createElement('div');
          previewNotification.className = 'fixed top-16 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 max-w-md';
          previewNotification.innerHTML = `
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <div class="flex flex-col">
              <span class="font-medium">فتح معاينة الملف المرفوع</span>
              <span class="text-xs opacity-90 truncate">${firstUploadedFile.title}</span>
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
            handlePreview(firstUploadedFile);
          }, 1500);
        }

        // Reload materials to sync with storage
        setTimeout(async () => {
          await loadMaterials();
        }, 2000);
      }
      if (failCount > 0) {
        alert(`⚠️ فشل حفظ ${failCount} ملف - تم إضافتها مؤقتاً فقط.`);
      }

    } catch (error) {
      console.error('❌ Upload process failed:', error);
      alert(`❌ فشل في عملية الرفع: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = () => <FaFilePdf className="text-red-500" />;

  const getFileTypeColor = () =>
    "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";

  // Download handler
  const handleDownload = (pdf) => {
    try {
      // Create temporary anchor element and trigger download
      const link = document.createElement("a");
      link.href = pdf.pdfPath;
      link.download = `${pdf.title}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);

      // Update download count
      setPdfs((prev) =>
        prev.map((p) =>
          p.id === pdf.id ? { ...p, downloadCount: p.downloadCount + 1 } : p
        )
      );

      console.log("Downloaded:", pdf.title);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  const handlePreview = (pdf) => {
    setLoadingPdfId(pdf.id);
    console.log(`🔍 Opening preview for: ${pdf.title}`, pdf);

    // Handle different file sources
    let pdfUrl = pdf.pdfPath;

    // If it's an uploaded file with a File object, create a blob URL
    if (pdf.file && pdf.file instanceof File) {
      pdfUrl = URL.createObjectURL(pdf.file);
      console.log(`📁 Created blob URL for uploaded file: ${pdfUrl}`);
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
        examTitle: pdf.title,
      });
      setLoadingPdfId(null);

      console.log(`✅ PDF preview modal opened with URL: ${pdfUrl}`);

      // Show success notification for uploaded files
      if (pdf.source === 'uploaded' || pdf.isLocalFile) {
        const successNotification = document.createElement('div');
        successNotification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        successNotification.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="text-sm">تم فتح الملف المرفوع بنجاح!</span>
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
  const filteredPdfs = pdfs.filter((pdf) => {
    return (
      pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.description.toLowerCase().includes(searchTerm.toLowerCase())
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
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
                  <FaChalkboardTeacher className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    PDF Materials
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
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Material</span>
                </motion.button>
              )}

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pdfs.length}
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
                placeholder="Search pdf materials..."
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
              Showing {filteredPdfs.length} of {pdfs.length} materials
            </span>
            {searchTerm && <span>Search results for "{searchTerm}"</span>}
          </div>
        </motion.div>

        {/* Selection Controls */}
        {hasAdminAccess && filteredPdfs.length > 0 && (
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
                  {selectedIds.length === filteredPdfs.length
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
          {filteredPdfs.map((pdf) => (
            <motion.div
              key={pdf.id}
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
                    className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    checked={selectedIds.includes(pdf.id)}
                    onChange={() => toggleSelect(pdf.id)}
                  />
                </div>
              )}

              {viewMode === "grid" ? (
                // Grid View
                <>
                  <div className="flex items-center justify-center h-20 mb-4  from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                    <div className="text-4xl">{getFileIcon()}</div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${getFileTypeColor()}`}
                    >
                      PDF
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {pdf.size}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {pdf.title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {pdf.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>{pdf.uploadDate}</span>
                    <span>{pdf.downloadCount} downloads</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePreview(pdf)}
                    disabled={loadingPdfId === pdf.id}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loadingPdfId === pdf.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        <span>Preview PDF</span>
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
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {pdf.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${getFileTypeColor()}`}
                      >
                        PDF
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {pdf.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{pdf.size}</span>
                      <span>{pdf.uploadDate}</span>
                      <span>{pdf.downloadCount} downloads</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePreview(pdf)}
                    disabled={loadingPdfId === pdf.id}
                    className="flex items-center space-x-2 py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loadingPdfId === pdf.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        <span>Preview PDF</span>
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredPdfs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaChalkboardTeacher className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {pdfs.length === 0 ? "No PDF Materials" : "No Materials Found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {pdfs.length === 0
                ? hasAdminAccess
                  ? "Start by uploading your first pdf material."
                  : "PDF materials will appear here when they become available."
                : "No materials match your current search and filter criteria."}
            </p>
            {hasAdminAccess && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => uploadInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg"
              >
                {pdfs.length === 0 ? "Upload First Material" : "Add Material"}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Hidden File Inputs */}
        <input
          type="file"
          multiple
          ref={uploadInputRef}
          accept=".pdf"
          className="hidden"
          onChange={handleUpload}
        />
        <input
          type="file"
          ref={updateInputRef}
          accept=".pdf"
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

export default PdfPage;
