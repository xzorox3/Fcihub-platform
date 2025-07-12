import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FCI from "../../assets/image/fci2.svg";
import HomeSwiper from "../HomeSwiper/HomeSwiper";
import StudentActivity from "../StudentActivity/StudentActivity";
import Courses from "../Courses/Courses";
import Statistics from "../Statistics/Statistics";

export default function Home() {
  const navigate = useNavigate();

  const handleExplorePrograms = () => {
    navigate("/department");
  };

  const handleLearnMore = () => {
    // Scroll to the content sections below
    const contentSection = document.querySelector(".content-sections");
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-transparent from-lightblue via-accent to-primary dark:from-darkblue dark:via-primary dark:to-accent transition-all duration-500">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="z-20 relative w-full h-screen overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src={FCI}
            alt="Hero"
            className="w-full h-full object-cover filter brightness-50 dark:brightness-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 dark:from-black/60 dark:via-black/75 dark:to-black/90" />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
              style={{
                textShadow:
                  "0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(59, 130, 246, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)",
              }}
            >
              Welcome to Faculty of
              <span className="block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Computer & Information Sciences
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-200 dark:text-gray-100 mb-8 leading-relaxed"
            >
              Empowering minds, shaping the future of technology and innovation
            </motion.p>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExplorePrograms}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
              >
                Explore Programs
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLearnMore}
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/30 dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20 transition-all duration-300 text-lg"
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/50 dark:border-white/40 rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-white/70 dark:bg-white/60 rounded-full mt-2"></div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Content Sections */}
      <div className="relative z-10 -mt-20 content-sections">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className=" pb-20"
        >
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-t-[3rem] pt-20">
            <HomeSwiper />
          </div>
          <StudentActivity />
          <Courses />
          <Statistics />
        </motion.div>
      </div>
    </div>
  );
}
