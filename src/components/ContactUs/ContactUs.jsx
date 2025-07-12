import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ContactForm() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  from-lightblue via-accent to-primary dark:from-darkblue dark:via-primary dark:to-accent p-4 transition-colors duration-300">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl"
      >
        <div className="flex flex-col md:flex-row w-full backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-3xl overflow-hidden transition">
          {/* Left Side - Form */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center flex-1 p-10 lg:p-16"
          >
            <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 animate-gradient-x">
              Get In Touch
            </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-300 text-lg">
              We are here for you! How can we help?
            </p>

            <form className="flex flex-col gap-6">
              <input
                type="text"
                placeholder="Your name"
                className="p-4 rounded-xl bg-white/80 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-lg transition-all"
              />
              <textarea
                placeholder="Go ahead, we are listening..."
                rows="6"
                className="p-4 rounded-xl bg-white/80 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-lg transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white py-4 rounded-xl shadow-lg transition duration-300 font-semibold text-lg flex items-center justify-center"
              >
                Submit
              </motion.button>
            </form>
          </motion.div>

          {/* Right Side - Contact Info */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center flex-1 p-10 lg:p-16 bg-white/60 dark:bg-gray-900/60 transition rounded-r-3xl"
          >
            <h3 className="font-bold mb-2 text-lg text-blue-700 dark:text-blue-400">
              The Address:
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <FaMapMarkerAlt className="text-blue-500" />
              <span className="text-gray-800 dark:text-gray-200">
                Ismailia - New University
              </span>
            </div>

            <h3 className="font-bold mb-2 text-lg text-blue-700 dark:text-blue-400">
              Contact Information:
            </h3>
            <div className="flex items-center gap-3 mb-2">
              <FaPhoneAlt className="text-blue-500" />
              <span className="text-gray-800 dark:text-gray-200">
                0643232253 / 01022474253
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-blue-500" />
              <a
                href="mailto:dean@ci.suez.edu.eg"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                dean@ci.suez.edu.eg
              </a>
            </div>

            {/* Map */}
            <div className="mt-8">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-blue-100 dark:border-blue-900">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3429.2536741892347!2d32.26839331512485!3d30.621079881675396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f8597f201556e7%3A0x72bc6dda925e6428!2z2YPZhNmK2Kkg2KfZhNit2KfYs9io2KfYqiDZiNin2YTZhdi52YTZiNmF2KfYqi0g2KzYp9mF2LnYqSDZgtmG2KfYqSDYp9mE2LPZiNmK2LM!5e0!3m2!1sen!2seg!4v1647894321012"
                  className="absolute top-0 left-0 w-full h-full"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Faculty of Computers and Information - Suez Canal University"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-8 text-gray-600 dark:text-gray-400"
        >
          <p className="text-sm">
            © 2025 Faculty of Computers and Information. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
