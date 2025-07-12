// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider } from "./lib/useAuth";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Department from "./components/Department/Department";
import CoursesPage from "./components/CoursesPage/CoursesPage";
import About from "./components/About/About";
import ContactUs from "./components/ContactUs/ContactUs";
import Login from "./components/Login/Login";
import ExamsPage from "./components/ExamsPage/ExamsPage";
import PdfPage from "./components/PdfPage/PdfPage";
import BookPage from "./components/Bookspage/Book";
import VideoPage from "./components/Videopage/Videopage";
import Footer from "./components/Footer/Footer";
import ProfileCard from "./components/ProfileCard/ProfileCard";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

function App() {
  // useEffect(() => {
  //   const createAdminUser = async () => {
  //     try {
  //       const response = await fetch("/api/auth/register-admin", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           name: "admin",
  //           email: "test@gmail.com",
  //           password: "admin123",
  //           gender: "ذكر",
  //         }),
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log("Admin user created:", data);
  //       } else {
  //         console.error("Failed to create admin user:", response.statusText);
  //       }
  //     } catch (error) {
  //       console.error("Error creating admin user:", error);
  //     }
  //   };

  //   createAdminUser();
  // }, []);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Initialize dark mode from localStorage or system preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialDarkMode =
      savedDarkMode !== null ? savedDarkMode : systemPrefersDark;

    setDarkMode(initialDarkMode);

    if (initialDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());

    // Apply dark mode to document
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500">
          <Navbar darkMode={darkMode} setDarkMode={toggleDarkMode} />
          <main className="flex-grow pt-[80px] transition-all duration-300">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/department" element={<Department />} />
                <Route path="/department/:deptName" element={<CoursesPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<ProfileCard />} />
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Resource routes with department and course context */}
                <Route
                  path="/department/:deptName/course/:courseName/exams"
                  element={<ExamsPage />}
                />
                <Route
                  path="/department/:deptName/course/:courseName/pdfs"
                  element={<PdfPage />}
                />
                <Route
                  path="/department/:deptName/course/:courseName/books"
                  element={<BookPage />}
                />
                <Route
                  path="/department/:deptName/course/:courseName/videos"
                  element={<VideoPage />}
                />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
