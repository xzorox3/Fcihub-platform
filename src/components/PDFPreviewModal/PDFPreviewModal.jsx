import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  Eye,
  FileText,
  Loader2,
  Hand,
  Move,
} from "lucide-react";

const PDFPreviewModal = ({ isOpen, onClose, pdfUrl, examTitle }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPanMode, setIsPanMode] = useState(false);

  // Simulate loading when modal opens
  useEffect(() => {
    if (isOpen && pdfUrl) {
      setIsLoading(true);
      setPdfLoaded(false);
      setPdfError(false);
      setZoom(100);
      setRotation(0);
      setIsFullscreen(false);
      setPanPosition({ x: 0, y: 0 });
      setIsPanMode(false);
      setIsDragging(false);

      // Simulate API call delay
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
        setPdfLoaded(true);
      }, 1200); // 1.2 seconds loading time

      return () => clearTimeout(loadingTimer);
    } else {
      setIsLoading(false);
      setPdfLoaded(false);
      setPdfError(false);
      setPanPosition({ x: 0, y: 0 });
      setIsPanMode(false);
      setIsDragging(false);
    }
  }, [isOpen, pdfUrl]);

  const handleDownload = () => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${examTitle}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 25));
  };

  const resetZoom = () => {
    setZoom(100);
    setRotation(0);
    setPanPosition({ x: 0, y: 0 });
    setIsPanMode(false);
  };

  const togglePanMode = () => {
    setIsPanMode(!isPanMode);
    if (isPanMode) {
      setPanPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e) => {
    if (isPanMode && zoom > 100) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y,
      });
    }
  };

  const handleWheel = (e) => {
    if (isPanMode && zoom > 100) {
      e.preventDefault();
      const deltaX = e.deltaX * 0.5; // Reduce sensitivity
      const deltaY = e.deltaY * 0.5;

      const scaleFactor = zoom / 100;
      const maxPan = 200 * scaleFactor;

      // Apply wheel movement with constraints
      const newX = panPosition.x - deltaX;
      const newY = panPosition.y - deltaY;

      const constrainedX = Math.max(-maxPan, Math.min(maxPan, newX));
      const constrainedY = Math.max(-maxPan, Math.min(maxPan, newY));

      setPanPosition({
        x: constrainedX,
        y: constrainedY,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && isPanMode) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Allow more liberal panning when zoomed
      if (zoom > 100) {
        // Calculate reasonable bounds based on zoom level
        const scaleFactor = zoom / 100;
        const maxPan = 200 * scaleFactor; // Scale the max pan with zoom level

        const constrainedX = Math.max(-maxPan, Math.min(maxPan, newX));
        const constrainedY = Math.max(-maxPan, Math.min(maxPan, newY));

        setPanPosition({
          x: constrainedX,
          y: constrainedY,
        });
      } else {
        // At 100% zoom or less, minimal panning
        setPanPosition({
          x: Math.max(-50, Math.min(50, newX)),
          y: Math.max(-50, Math.min(50, newY)),
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard pan support
  const handleKeyDown = (e) => {
    if (isPanMode && zoom > 100) {
      const step = 30;
      let newX = panPosition.x;
      let newY = panPosition.y;

      switch (e.key) {
        case "ArrowLeft":
          newX += step;
          break;
        case "ArrowRight":
          newX -= step;
          break;
        case "ArrowUp":
          newY += step;
          break;
        case "ArrowDown":
          newY -= step;
          break;
        default:
          return;
      }

      e.preventDefault();

      // Apply simplified constraints
      const scaleFactor = zoom / 100;
      const maxPan = 200 * scaleFactor;

      const constrainedX = Math.max(-maxPan, Math.min(maxPan, newX));
      const constrainedY = Math.max(-maxPan, Math.min(maxPan, newY));

      setPanPosition({
        x: constrainedX,
        y: constrainedY,
      });
    }
  };

  // Add mouse and keyboard event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart, panPosition]);

  useEffect(() => {
    if (isPanMode && isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isPanMode, isOpen, panPosition, zoom]);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden ${
            isFullscreen
              ? "w-[95vw] h-[95vh]"
              : "w-[90vw] max-w-4xl h-[85vh] max-h-[800px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  PDF Preview
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {examTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Zoom Controls */}
              <div
                className={`flex items-center space-x-1 bg-white dark:bg-gray-700 rounded-lg p-1 border border-gray-200 dark:border-gray-600 ${
                  isLoading ? "opacity-50" : ""
                }`}
              >
                <button
                  onClick={handleZoomOut}
                  disabled={isLoading}
                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:cursor-not-allowed"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={resetZoom}
                  className="px-2 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem] text-center hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                  title="Reset zoom and rotation"
                >
                  {zoom}%
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={isLoading}
                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:cursor-not-allowed"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {/* Rotate Button */}
              <button
                onClick={handleRotate}
                disabled={isLoading}
                className={`p-2 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors disabled:cursor-not-allowed ${
                  isLoading ? "opacity-50" : ""
                }`}
                title="Rotate"
              >
                <RotateCw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Pan Mode Toggle */}
              <button
                onClick={togglePanMode}
                disabled={isLoading || zoom <= 100}
                className={`p-2 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors disabled:cursor-not-allowed ${
                  isPanMode
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                } ${isLoading || zoom <= 100 ? "opacity-50" : ""}`}
                title={
                  zoom <= 100
                    ? "Pan mode (zoom in first)"
                    : isPanMode
                    ? "Exit pan mode"
                    : "Enable pan mode"
                }
              >
                {isPanMode ? (
                  <Move className="w-4 h-4" />
                ) : (
                  <Hand className="w-4 h-4" />
                )}
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                disabled={isLoading}
                className={`p-2 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors disabled:cursor-not-allowed ${
                  isLoading ? "opacity-50" : ""
                }`}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                )}
              </button>

              {/* Download Button */}
              <motion.button
                whileHover={!isLoading ? { scale: 1.05 } : {}}
                whileTap={!isLoading ? { scale: 0.95 } : {}}
                onClick={handleDownload}
                disabled={isLoading}
                className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all shadow-lg disabled:cursor-not-allowed ${
                  isLoading ? "opacity-50" : ""
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </motion.button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 p-4">
            {isLoading ? (
              // Loading State
              <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mb-6"
                >
                  <Loader2 className="w-12 h-12 text-blue-500" />
                </motion.div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Loading PDF Document
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Fetching exam content from server...
                  </p>
                  <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </div>
            ) : pdfError ? (
              // Error State
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Unable to Load PDF
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    The PDF file could not be loaded. This might be because the file is not available or there's a network issue.
                  </p>
                  <button
                    onClick={() => window.open(pdfUrl, '_blank')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Try Opening in New Tab
                  </button>
                </div>
              </div>
            ) : pdfLoaded ? (
              // PDF Content
              <div
                className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-4"
                style={{
                  minHeight: "400px",
                  maxHeight: "calc(100vh - 200px)",
                }}
              >
                <div className="flex justify-center items-start min-h-full">
                  <div
                    className="relative"
                    style={{
                      transform: `translate(${panPosition.x}px, ${
                        panPosition.y
                      }px) scale(${zoom / 100}) rotate(${rotation}deg)`,
                      transformOrigin: "center",
                      transition: isDragging ? "none" : "transform 0.3s ease",
                      width: "600px",
                      height: "800px",
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`bg-white shadow-2xl rounded-lg border border-gray-200 relative w-full h-full ${
                        isPanMode && zoom > 100 ? "cursor-grab" : ""
                      } ${isDragging ? "cursor-grabbing" : ""}`}
                      onMouseDown={handleMouseDown}
                      onWheel={handleWheel}
                    >
                      {/* Transform indicator */}
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-20">
                        {zoom}% • {rotation}°{" "}
                        {isPanMode && zoom > 100 ? "• Pan Mode" : ""}
                      </div>

                      {/* Pan mode indicator */}
                      {isPanMode && zoom > 100 && (
                        <div className="absolute top-2 right-2 bg-blue-500/80 text-white text-xs px-2 py-1 rounded z-20 flex items-center space-x-1">
                          <Hand className="w-3 h-3" />
                          <span>Drag to pan</span>
                        </div>
                      )}

                      {/* PDF iframe */}
                      <iframe
                        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1`}
                        className="w-full h-full border-0 rounded-lg"
                        title="PDF Preview"
                        style={{
                          pointerEvents: isPanMode ? "none" : "auto",
                        }}
                        onLoad={() => {
                          console.log('PDF loaded successfully');
                        }}
                        onError={() => {
                          console.error('PDF failed to load:', pdfUrl);
                          setPdfError(true);
                          setPdfLoaded(false);
                        }}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to server...</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>PDF Preview Mode</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isLoading
                ? "Please wait while we fetch the document"
                : isPanMode && zoom > 100
                ? `Zoom: ${zoom}% • Rotation: ${rotation}° • Pan Mode: Drag, scroll wheel, or arrow keys to navigate`
                : `Zoom: ${zoom}% • Rotation: ${rotation}° • ${
                    zoom > 100
                      ? "Click hand icon to enable pan mode"
                      : "Zoom in to enable pan mode"
                  }`}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PDFPreviewModal;
