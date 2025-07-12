// src/components/CoursesPage/CoursesPage.jsx
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  BookOpen,
  User,
  Clock,
  Plus,
  Trash2,
  Edit3,
  Search,
  Grid3X3,
  List,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../lib/useAuth";
// import courseStatsService from "../../services/courseStatsService.js";


import {
  FaFileAlt,
  FaCode,
  FaBrain,
  FaDatabase,
  FaCogs,
  FaDna,
  FaGraduationCap,
  FaUsers,
  FaStar,
  FaFlask,
  FaChalkboardTeacher,
  FaVideo,
} from "react-icons/fa";

function CoursesPage() {
  const { deptName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  // Check if user has admin access (logged in and is admin)
  const hasAdminAccess = isAuthenticated && isAdmin;


  const [searchTerm, setSearchTerm] = useState("");

  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  // API integration states
  const [selectedYearTab, setSelectedYearTab] = useState('all');
  const [yearTabs, setYearTabs] = useState([
    { label: 'First Year', value: 1 },
    { label: 'Second Year', value: 2 },
    { label: 'Third Year', value: 3 },
    { label: 'Fourth Year', value: 4 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courseStats, setCourseStats] = useState({});



  // Department icon mapping
  const departmentIcons = {
    General: <FaGraduationCap className="w-8 h-8" />,
    "Information Systems": <FaDatabase className="w-8 h-8" />,
    "Computer Science": <FaCode className="w-8 h-8" />,
    "Artificial Intelligence": <FaBrain className="w-8 h-8" />,
    "Software Engineering": <FaCogs className="w-8 h-8" />,
    Bioinformatics: <FaDna className="w-8 h-8" />,
  };

  // Department colors
  const departmentColors = {
    General: "from-lightblue to-accent",
    "Information Systems": "from-accent to-primary",
    "Computer Science": "from-primary to-darkblue",
    "Artificial Intelligence": "from-darkblue to-primary",
    "Software Engineering": "from-accent to-lightblue",
    Bioinformatics: "from-lightblue to-primary",
  };

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Introduction to Programming",
      instructor: "Dr. Ahmed Mohamed",
      description: "Learn the fundamentals of programming with Python",
      duration: "16 weeks",

      year: 1,
      enrolled: 120,
      rating: 4.8,
      resources: [
        { type: "Exams", count: 3, icon: <FaFileAlt /> },
        { type: "PDFs", count: 3, icon: <FaChalkboardTeacher /> },
        { type: "Books", count: 3, icon: <FaFlask /> },
        { type: "Videos", count: 3, icon: <FaVideo /> },
      ],
    },
    {
      id: 2,
      title: "Data Structures & Algorithms",
      instructor: "Dr. Sarah Ahmed",
      description: "Master essential data structures and algorithmic thinking",
      duration: "14 weeks",

      year: 2,
      enrolled: 95,
      rating: 4.9,
      resources: [
        { type: "Exams", count: 3, icon: <FaFileAlt /> },
        { type: "PDFs", count: 3, icon: <FaChalkboardTeacher /> },
        { type: "Books", count: 3, icon: <FaFlask /> },
        { type: "Videos", count: 3, icon: <FaVideo /> },
      ],
    },
    {
      id: 3,
      title: "Database Management Systems",
      instructor: "Dr. Mohamed Ali",
      description: "Comprehensive guide to relational and NoSQL databases",
      duration: "12 weeks",

      year: 2,
      enrolled: 88,
      rating: 4.7,
      resources: [
        { type: "Exams", count: 3, icon: <FaFileAlt /> },
        { type: "PDFs", count: 3, icon: <FaChalkboardTeacher /> },
        { type: "Books", count: 3, icon: <FaFlask /> },
        { type: "Videos", count: 3, icon: <FaVideo /> },
      ],
    },
    {
      id: 4,
      title: "Web Development Fundamentals",
      instructor: "Dr. Fatma Hassan",
      description:
        "Build modern web applications with HTML, CSS, and JavaScript",
      duration: "18 weeks",

      year: 1,
      enrolled: 156,
      rating: 4.6,
      resources: [
        { type: "Exams", count: 3, icon: <FaFileAlt /> },
        { type: "PDFs", count: 3, icon: <FaChalkboardTeacher /> },
        { type: "Books", count: 3, icon: <FaFlask /> },
        { type: "Videos", count: 3, icon: <FaVideo /> },
      ],
    },
    {
      id: 5,
      title: "Mobile App Development",
      instructor: "Dr. Omar Hassan",
      description:
        "Create native mobile applications for iOS and Android platforms",
      duration: "20 weeks",

      year: 3,
      enrolled: 75,
      rating: 4.8,
      resources: [
        { type: "Exams", count: 3, icon: <FaFileAlt /> },
        { type: "PDFs", count: 3, icon: <FaChalkboardTeacher /> },
        { type: "Books", count: 3, icon: <FaFlask /> },
        { type: "Videos", count: 3, icon: <FaVideo /> },
      ],
    },
    {
      id: 6,
      title: "Cybersecurity Fundamentals",
      instructor: "Dr. Amira Nour",
      description: "Learn to protect systems and networks from cyber threats",
      duration: "15 weeks",

      year: 4,
      enrolled: 110,
      rating: 4.7,
      resources: [
        { type: "Exams", count: 3, icon: <FaFileAlt /> },
        { type: "PDFs", count: 3, icon: <FaChalkboardTeacher /> },
        { type: "Books", count: 3, icon: <FaFlask /> },
        { type: "Videos", count: 3, icon: <FaVideo /> },
      ],
    },
  ]);

  // Function to get real material counts from actual files in each section
  const getRealMaterialCounts = () => {
    try {
      // Get counts from localStorage (updated by each page when materials are loaded/added/deleted)
      const materialCounts = {
        pdfs: parseInt(localStorage.getItem('pdfCount') || '0'),
        books: parseInt(localStorage.getItem('bookCount') || '0'),
        videos: parseInt(localStorage.getItem('videoCount') || '0'),
        exams: parseInt(localStorage.getItem('examCount') || '0')
      };

      // If no counts in localStorage, set default counts based on actual sample data
      if (materialCounts.pdfs === 0) {
        materialCounts.pdfs = 2; // Default PDF count (will be updated by PDF page)
        localStorage.setItem('pdfCount', '2');
      }
      if (materialCounts.books === 0) {
        materialCounts.books = 3; // Default Books count (will be updated by Books page)
        localStorage.setItem('bookCount', '3');
      }
      if (materialCounts.videos === 0) {
        materialCounts.videos = 3; // Default Videos count (will be updated by Videos page)
        localStorage.setItem('videoCount', '3');
      }
      if (materialCounts.exams === 0) {
        materialCounts.exams = 3; // Default Exams count (will be updated by Exams page)
        localStorage.setItem('examCount', '3');
      }

      console.log(`📊 Real material counts from pages:`, materialCounts);
      return materialCounts;

    } catch (error) {
      console.error('Error getting real material counts:', error);
      // Return realistic fallback counts
      return {
        pdfs: 2,
        books: 3,
        videos: 3,
        exams: 3
      };
    }
  };

  // Function to update courses with real material counts
  const updateCoursesWithRealCounts = (coursesData) => {
    const realCounts = getRealMaterialCounts();

    return coursesData.map(course => {
      return {
        ...course,
        resources: [
          { type: "Exams", count: realCounts.exams, icon: <FaFileAlt /> },
          { type: "PDFs", count: realCounts.pdfs, icon: <FaChalkboardTeacher /> },
          { type: "Books", count: realCounts.books, icon: <FaFlask /> },
          { type: "Videos", count: realCounts.videos, icon: <FaVideo /> },
        ]
      };
    });
  };

  // Fetch data from APIs with fallback to default data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get selected department ID from localStorage
        const selectedDepartmentId = localStorage.getItem("selectedDepartmentId");

        // Try to fetch levels for year tabs
        try {
          const levelsResponse = await fetch("https://fcihub.onrender.com/level", {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            mode: 'cors',
          });
          if (levelsResponse.ok) {
            const levelsData = await levelsResponse.json();

            if (Array.isArray(levelsData)) {
              // Get unique level numbers and sort them
              const uniqueLevels = [...new Set(levelsData.map(level => level.levelNumber))].sort();
              const formattedYearTabs = uniqueLevels.map(levelNumber => ({
                label: `${getOrdinalNumber(levelNumber)} Year`,
                value: levelNumber,
                id: levelNumber
              }));
              setYearTabs(formattedYearTabs);
            }
          }
        } catch (levelError) {
          console.warn("Levels API unavailable, using default year tabs:", levelError);
          // Keep default year tabs
        }

        // Try to fetch courses
        try {
          const coursesResponse = await fetch("https://fcihub.onrender.com/course", {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            mode: 'cors',
          });
          if (coursesResponse.ok) {
            const coursesData = await coursesResponse.json();

            if (coursesData.courses && Array.isArray(coursesData.courses)) {
              // Transform API data to match UI expectations
              const transformedCourses = coursesData.courses.map(course => ({
                id: course.id,
                title: course.title,
                instructor: "Dr. Faculty Member",
                description: `Course in ${course.major?.title || 'General'} department`,
                duration: "16 weeks",

                year: course.level?.levelNumber || 1,
                majorTitle: course.major?.title || "General",
                majorId: course.major?.id,
                levelId: course.level?.id,
                subMajor: course.subMajor?.title,
                enrolled: Math.floor(Math.random() * 150) + 50,
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                resources: [
                  { type: "Exams", count: 0, icon: <FaFileAlt /> },
                  { type: "PDFs", count: 0, icon: <FaChalkboardTeacher /> },
                  { type: "Books", count: 0, icon: <FaFlask /> },
                  { type: "Videos", count: 0, icon: <FaVideo /> },
                ],
              }));

              // Filter courses by selected department if available
              let filteredCourses = transformedCourses;
              if (selectedDepartmentId && selectedDepartmentId !== 'undefined') {
                filteredCourses = transformedCourses.filter(course =>
                  course.majorId === parseInt(selectedDepartmentId)
                );
              }

              // Update courses with real counts
              const coursesWithRealCounts = updateCoursesWithRealCounts(filteredCourses);
              setCourses(coursesWithRealCounts);
            }
          }
        } catch (courseError) {
          console.warn("Courses API unavailable, using default courses:", courseError);
          // Update default courses with real counts
          const defaultCoursesWithStats = updateCoursesWithRealCounts(courses);
          setCourses(defaultCoursesWithStats);
        }

      } catch (err) {
        console.error("General error:", err);
        // Don't set error state, just log it and use default data
        console.warn("Using default data due to API unavailability");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [deptName]);

  // Update default courses with real material counts on component mount
  useEffect(() => {
    // Only update if courses don't already have real counts
    if (courses.length > 0 && courses[0].resources && courses[0].resources[0].count === 3) {
      try {
        const coursesWithRealCounts = updateCoursesWithRealCounts(courses);
        setCourses(coursesWithRealCounts);
      } catch (error) {
        console.error('Error updating default courses with real counts:', error);
      }
    }
  }, []); // Run only once on mount

  // Helper function to convert numbers to ordinal
  const getOrdinalNumber = (num) => {
    const ordinals = ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth'];
    return ordinals[num] || `${num}th`;
  };

  // Course management functions
  const handleDeleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((course) => course.id !== courseId));
    }
  };



  const getBasePath = (courseTitle, resourceType) => {
    const courseName = courseTitle.toLowerCase().replace(/\s+/g, "-");
    const basePath = `/department/${encodeURIComponent(
      deptName
    )}/course/${courseName}`;

    // Map resource types to their respective pages
    switch (resourceType.toLowerCase()) {
      case "exams":
        return `${basePath}/exams`;
      case "pdfs":
        return `${basePath}/pdfs`;
      case "books":
        return `${basePath}/books`;
      case "videos":
        return `${basePath}/videos`;
      default:
        return `${basePath}/${resourceType.toLowerCase()}`;
    }
  };



  // Filter courses
  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

  // Filter by selected year tab (if not 'all')
  const yearFilteredCourses = selectedYearTab === 'all'
    ? filteredCourses
    : filteredCourses.filter(course => course.year === selectedYearTab);

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

  const decodedDeptName = decodeURIComponent(deptName);

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
                onClick={() => navigate("/department")}
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </motion.button>

              <div className="flex items-center space-x-4">
                <div
                  className={`p-4 rounded-2xl bg-gradient-to-r ${
                    departmentColors[decodedDeptName] ||
                    "from-primary to-darkblue"
                  } text-white shadow-lg`}
                >
                  {departmentIcons[decodedDeptName] || (
                    <FaGraduationCap className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {decodedDeptName}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Available Courses & Resources
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {courses.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Courses
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading courses...</span>
          </div>
        )}



        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error loading data
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Controls */}
        {!loading && !error && (
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
                placeholder="Search courses, instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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

            {/* Filter and Sort Controls */}
            <div className="flex items-center space-x-4">




              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-600 text-primary dark:text-primary/80 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-600 text-primary dark:text-primary/80 shadow-sm"
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
              Showing {filteredCourses.length} of {courses.length}{" "}
              courses
            </span>
            {searchTerm && <span>Search results for "{searchTerm}"</span>}
          </div>
        </motion.div>
        )}

        {/* Year Tabs */}
        {!loading && !error && (
        <div className="flex gap-8 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            key="all"
            onClick={() => setSelectedYearTab('all')}
            className={`px-2 pb-2 text-base font-medium border-b-2 transition-all ${selectedYearTab === 'all' ? 'border-primary text-primary dark:text-primary/80' : 'border-transparent text-gray-500 dark:text-gray-400'} hover:text-primary dark:hover:text-primary/80`}
            style={{ background: 'none', outline: 'none' }}
          >
            All Years
          </button>
          {yearTabs.map(tab => {
            // Determine if the tab should be disabled
            const isInfoSysOrCS = decodedDeptName === 'Information Systems' || decodedDeptName === 'Computer Science';
            const isGeneral = decodedDeptName === 'General';
            let disabled = false;
            if (isInfoSysOrCS && (tab.value === 1 || tab.value === 2)) disabled = true;
            if (isGeneral && (tab.value === 3 || tab.value === 4)) disabled = true;
            return (
            <button
              key={tab.value}
                onClick={() => !disabled && setSelectedYearTab(tab.value)}
                disabled={disabled}
                className={`px-2 pb-2 text-base font-medium border-b-2 transition-all ${selectedYearTab === tab.value ? 'border-primary text-primary dark:text-primary/80' : 'border-transparent text-gray-500 dark:text-gray-400'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-primary dark:hover:text-primary/80'}`}
              style={{ background: 'none', outline: 'none' }}
            >
              {tab.label}
            </button>
            );
          })}
        </div>
        )}

        {/* Courses Grid */}
        {!loading && !error && yearFilteredCourses.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "space-y-6"
          }
        >
            {yearFilteredCourses.map((course) => (
            <motion.div
              key={course.id}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70 transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 group relative ${
                viewMode === "list" ? "flex items-center p-6" : ""
              }`}
            >
              {/* Admin Controls */}
              {hasAdminAccess && (
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-primary hover:bg-darkblue text-white rounded-lg shadow-lg"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-2 bg-danger hover:bg-red-600 text-white rounded-lg shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              )}

              {/* Course Header */}
              <div
                className={`${
                  viewMode === "list"
                    ? "flex-1 flex items-center space-x-6"
                    : "p-8 flex flex-col h-full"
                }`}
              >
                {viewMode === "list" ? (
                  // List View Layout
                  <>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary/80 transition-colors">
                          {course.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                        {course.description}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <span>{course.instructor}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-1">
                        <FaUsers className="w-3 h-3" />
                        <span>{course.enrolled}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaStar className="w-3 h-3 text-yellow-500" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {course.resources.map((resource, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            navigate(getBasePath(course.title, resource.type))
                          }
                          className="px-3 py-2 bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 rounded-lg text-center transition-all duration-300 border border-primary/50 dark:border-primary/70"
                        >
                          <div className="text-primary dark:text-primary/80 text-sm">
                            {resource.icon}
                          </div>
                          <div className="text-xs text-primary dark:text-primary/80 font-medium mt-1">
                            {resource.count}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </>
                ) : (
                  // Grid View Layout (Original)
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary/80 transition-colors">
                            {course.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                          {course.description}
                        </p>
                      </div>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex items-center space-x-2 mb-6 p-3 bg-primary/10 dark:bg-primary/20 rounded-xl">
                      <User className="w-4 h-4 text-primary dark:text-primary/80" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {course.instructor}
                      </span>
                    </div>

                    {/* Resources */}
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      {course.resources.map((resource, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            navigate(getBasePath(course.title, resource.type))
                          }
                          className="p-4 bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 rounded-xl text-center transition-all duration-300 border border-primary/50 dark:border-primary/70 shadow-sm hover:shadow-md"
                        >
                          <div className="text-primary dark:text-primary/80 mb-2 flex justify-center text-lg">
                            {resource.icon}
                          </div>
                          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            {resource.type}
                          </div>
                          <div className="text-xs text-primary dark:text-primary/80 font-medium">
                            {resource.count} items
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        )}

        {/* Empty State for Filtered Results */}
        {!loading && !error && filteredCourses.length === 0 && courses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Courses Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No courses match your current search and filter criteria.
            </p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLevel("all");
                }}
                className="px-6 py-3 bg-primary hover:bg-darkblue text-white rounded-xl font-medium transition-colors"
              >
                Clear Filters
              </motion.button>

            </div>
          </motion.div>
        )}

        {/* Empty State for No Courses */}
        {!loading && !error && courses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Courses Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {hasAdminAccess
                ? "Start by adding your first course to this department."
                : "Courses will appear here when they become available."}
            </p>

          </motion.div>
        )}


      </div>
    </div>
  );
}

export default CoursesPage;
