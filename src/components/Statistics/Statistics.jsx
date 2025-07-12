import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import {
  FaUserGraduate,
  FaUsers,
  FaChalkboardTeacher,
  FaUserTie,
  FaTrophy,
  FaBookOpen,
} from "react-icons/fa";

const stats = [
  {
    icon: <FaUsers size={32} />,
    label: "Active Students",
    value: 2500,
    gradient: "from-primary to-accent",
    bg: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
  },
  {
    icon: <FaChalkboardTeacher size={32} />,
    label: "Faculty Members",
    value: 120,
    gradient: "from-primary to-darkblue",
    bg: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
  },
  {
    icon: <FaUserTie size={32} />,
    label: "Staff Members",
    value: 60,
    gradient: "from-accent to-lightblue",
    bg: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
  },
  {
    icon: <FaUserGraduate size={32} />,
    label: "Total Graduates",
    value: 18000,
    gradient: "from-lightblue to-primary",
    bg: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
  },
  {
    icon: <FaTrophy size={32} />,
    label: "Awards Won",
    value: 95,
    gradient: "from-accent to-primary",
    bg: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
  },
  {
    icon: <FaBookOpen size={32} />,
    label: "Research Papers",
    value: 450,
    gradient: "from-darkblue to-primary",
    bg: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
  },
];

const Statistics = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-24 px-6 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500"
      ref={ref}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Our Achievements
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Numbers that reflect our commitment to excellence in education and
          research
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative overflow-hidden bg-gradient-to-br ${item.bg} backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70 transition-all duration-500 p-8 group border border-gray-200/60 dark:border-gray-700/50 hover:border-gray-300/80 dark:hover:border-gray-600/70`}
          >
            {/* Additional Light Mode Enhancement */}
            <div className="absolute inset-0 bg-white/40 dark:bg-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 dark:from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>

            {/* Icon */}
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} text-white shadow-lg hover:shadow-xl mb-6 relative z-10 group-hover:scale-110 transition-all duration-300`}
            >
              {item.icon}
            </motion.div>

            {/* Value */}
            <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 relative z-10 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">
              {inView ? (
                <CountUp
                  end={item.value}
                  duration={2.5}
                  separator=","
                  suffix={item.value >= 1000 ? "+" : ""}
                />
              ) : (
                "0"
              )}
            </div>

            {/* Label */}
            <div className="text-base font-semibold text-gray-700 dark:text-gray-300 relative z-10 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors duration-300">
              {item.label}
            </div>

            {/* Hover Effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-3 dark:group-hover:opacity-10 transition-opacity duration-300`}
            ></div>

            {/* Animated Border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-transparent via-gray-200/30 dark:via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Decoration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          ✨ Building tomorrow's tech leaders today ✨
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Statistics;
