import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Target,
  Eye,
  MessageSquare,
  Users,
  Award,
  Lightbulb,
  Globe,
  TrendingUp,
  Heart,
} from "lucide-react";
import Card from "../Card/Card";
import SCU from "../../assets/image/Group 219.png";
import goalsImage from "../../assets/image/bro.svg";
import emailCampaign from "../../assets/image/email-campaign.svg";
import creativeWriting from "../../assets/image/creative-writing.svg";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const goals = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Graduate Excellence",
      description:
        "Graduating batches capable of developing software in all fields using modern tools.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Social Development",
      description:
        "Developing students' ability to deal with social groups in a way that serves the surrounding environment.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Research Innovation",
      description:
        "Building an advanced human research structure that has the capacity for community cooperation.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Community Service",
      description:
        "Serving the community by raising awareness of the importance of computers and information.",
    },
  ];

  return (
    <div className="min-h-screen  from-lightblue via-accent to-primary dark:from-darkblue dark:via-primary dark:to-accent">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Welcome Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-12 lg:p-16 flex flex-col justify-center">
                <motion.div variants={itemVariants} className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl text-white">
                      <GraduationCap className="w-8 h-8" />
                    </div>
                    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                  </div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    Welcome to
                  </h1>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Faculty of Computers and Information
                  </h2>
                </motion.div>
                <motion.p
                  variants={itemVariants}
                  className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-8"
                >
                  The new College of Computers was established in 1997. The
                  college aspires to become a distinguished and advanced
                  research institution that serves the telecommunications
                  community in the field of computers and information systems at
                  the local and regional levels.
                </motion.p>
                <motion.div
                  variants={itemVariants}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Established 1997
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-xl">
                    <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">
                      Local & Regional Impact
                    </span>
                  </div>
                </motion.div>
              </div>
              <div className="p-8 lg:p-12 flex items-center justify-center  from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur-3xl opacity-20"></div>
                  <img
                    src={SCU}
                    alt="Faculty Logo"
                    className="relative h-auto w-96 max-w-full drop-shadow-2xl"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Faculty Message Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-12 lg:p-16"
          >
            <div className="text-center">
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center space-x-3 mb-8"
              >
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl text-white">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Faculty Message
                </h2>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl blur-2xl opacity-20"></div>
                  <img
                    src={emailCampaign}
                    alt="Email Campaign"
                    className="relative h-auto w-80 max-w-full mx-auto drop-shadow-xl"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
                <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-6">
                  We seek excellence and leadership scientifically and
                  practically in a social educational environment open to the
                  future in the field of information systems to advance the
                  college graduate to a level capable of competing.
                </p>
                <div className="flex justify-center">
                  <div className="px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-700/50">
                    <span className="text-purple-800 dark:text-purple-300 font-medium">
                      Excellence • Innovation • Leadership
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Faculty Vision Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.div
            variants={itemVariants}
            className=" from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl shadow-xl border border-emerald-200/50 dark:border-emerald-700/50 p-12 lg:p-16"
          >
            <div className="text-center">
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center space-x-3 mb-8"
              >
                <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl text-white">
                  <Eye className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Faculty Vision
                </h2>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur-2xl opacity-20"></div>
                  <img
                    src={creativeWriting}
                    alt="Creative Writing"
                    className="relative h-auto w-80 max-w-full mx-auto drop-shadow-xl"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
                <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-6">
                  The Faculty of Computers and Information at Suez Canal
                  University aspires to occupy a prominent position in the field
                  of computers and information systems at the local and regional
                  levels.
                </p>
                <div className="flex justify-center">
                  <div className="px-6 py-3 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50">
                    <span className="text-emerald-800 dark:text-emerald-300 font-medium">
                      Local & Regional Leadership
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Faculty Goals Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-12 lg:p-16 flex flex-col justify-center">
                <motion.div
                  variants={itemVariants}
                  className="flex items-center space-x-3 mb-8"
                >
                  <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl text-white">
                    <Target className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Faculty Goals
                  </h2>
                </motion.div>

                <motion.p
                  variants={itemVariants}
                  className="text-lg mb-8 text-gray-600 dark:text-gray-300"
                >
                  Within the framework of the vision and mission set by the
                  college, a set of strategic goals have been formulated that
                  all those affiliated with the Faculty of Computers and
                  Information at Suez Canal University seek to achieve:
                </motion.p>

                <motion.div variants={containerVariants} className="space-y-6">
                  {goals.map((goal, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 border border-gray-200/50 dark:border-gray-600/50"
                    >
                      <div className="flex-shrink-0 p-3 bg-white dark:bg-gray-700 rounded-xl shadow-lg">
                        <div className="text-blue-600 dark:text-blue-400">
                          {goal.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {goal.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {goal.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="p-8 lg:p-12 flex items-center justify-center  from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl blur-3xl opacity-20"></div>
                  <img
                    src={goalsImage}
                    alt="Faculty Goals Illustration"
                    className="relative h-auto max-w-md w-full drop-shadow-2xl"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Statistics Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-xl p-12 lg:p-16 text-white"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
              <p className="text-xl text-blue-100">
                Making a difference in education and technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  number: "26+",
                  label: "Years of Excellence",
                  icon: <Award className="w-8 h-8" />,
                },
                {
                  number: "5000+",
                  label: "Graduates",
                  icon: <GraduationCap className="w-8 h-8" />,
                },
                {
                  number: "6",
                  label: "Departments",
                  icon: <Globe className="w-8 h-8" />,
                },
                {
                  number: "100+",
                  label: "Faculty Members",
                  icon: <Users className="w-8 h-8" />,
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <div className="flex justify-center mb-4 text-blue-200">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
