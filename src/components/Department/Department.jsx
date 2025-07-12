// src/components/Department/Department.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCode,
  FaBrain,
  FaDatabase,
  FaCogs,
  FaDna,
  FaGraduationCap,
} from "react-icons/fa";

function Department() {
  const navigate = useNavigate();

  const departments = [
    {
      name: "General",
      color: "from-orange-500 to-orange-600",
      description: "Foundation courses for all students",
      icon: <FaGraduationCap size={48} />,
      courses: "25+ Courses",
      students: "500+ Students",
    },
    {
      name: "Information Systems",
      color: "from-teal-500 to-teal-600",
      description: "Business intelligence and data management",
      icon: <FaDatabase size={48} />,
      courses: "30+ Courses",
      students: "300+ Students",
    },
    {
      name: "Computer Science",
      color: "from-blue-600 to-blue-700",
      description: "Core programming and algorithms",
      icon: <FaCode size={48} />,
      courses: "35+ Courses",
      students: "450+ Students",
    },
    {
      name: "Artificial Intelligence",
      color: "from-blue-500 to-blue-600",
      description: "Machine learning and intelligent systems",
      icon: <FaBrain size={48} />,
      courses: "20+ Courses",
      students: "250+ Students",
    },
    {
      name: "Software Engineering",
      color: "from-green-500 to-green-600",
      description: "Software development lifecycle",
      icon: <FaCogs size={48} />,
      courses: "28+ Courses",
      students: "350+ Students",
    },
    {
      name: "Bioinformatics",
      color: "from-green-600 to-green-700",
      description: "Biology meets computer science",
      icon: <FaDna size={48} />,
      courses: "15+ Courses",
      students: "150+ Students",
    },
  ];

  const handleSelectDepartment = (department) => {
    navigate(`/department/${encodeURIComponent(department.name)}`);
  };

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
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our Departments
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our diverse academic departments and find your path to excellence
          </p>
        </div>

        {/* Departments Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {departments.map((department) => (
            <motion.div
              key={department.name}
              variants={cardVariants}
              whileHover={{
                y: -10,
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectDepartment(department)}
              className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70 transition-all duration-500 cursor-pointer overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${department.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>

              {/* Content */}
              <div className="relative p-8">
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${department.color} text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {department.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {department.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {department.description}
                </p>

              

                {/* Action Button */}
                <button
                  className={`w-full py-3 px-6 bg-gradient-to-r ${department.color} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform group-hover:scale-105 transition-all duration-300`}
                >
                  Explore Department
                </button>

                {/* Decorative Elements */}
                <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Department;
