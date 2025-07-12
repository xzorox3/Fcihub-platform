// API Service for connecting frontend with backend
// Using Vite proxy to bypass CORS - all requests go through /api
const API_BASE_URL = "/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token from cookies
  getAuthToken() {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
    return token;
  }

  // Helper method to get headers with authentication
  getHeaders(includeAuth = true) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    console.log(`Making API request to: ${url}`); // Debug log

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Authentication endpoints
  auth = {
    // Login user
    loginUser: async (email, password) => {
      return this.request("/auth/login-user", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        includeAuth: false,
      });
    },

    // Login admin
    loginAdmin: async (email, password) => {
      return this.request("/auth/login-admin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        includeAuth: false,
      });
    },

    // Register user
    registerUser: async (userData) => {
      return this.request("/auth/register-user", {
        method: "POST",
        body: JSON.stringify(userData),
        includeAuth: false,
      });
    },

    // Register admin
    registerAdmin: async (adminData) => {
      return this.request("/auth/register-admin", {
        method: "POST",
        body: JSON.stringify(adminData),
        includeAuth: false,
      });
    },

    // Forgot password
    forgotPassword: async (email) => {
      return this.request("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        includeAuth: false,
      });
    },

    // Verify reset code
    verifyResetCode: async (email, code) => {
      return this.request("/auth/verify-reset-code", {
        method: "POST",
        body: JSON.stringify({ email, code }),
        includeAuth: false,
      });
    },

    // Reset password
    resetPassword: async (email, code, newPassword) => {
      return this.request("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, code, newPassword }),
        includeAuth: false,
      });
    },
  };

  // User endpoints
  user = {
    // Get user profile
    getProfile: async () => {
      return this.request("/user/profile");
    },

    // Get admin profile
    getAdminProfile: async () => {
      return this.request("/user/admin/profile");
    },

    // Get all users (admin only)
    getAllUsers: async () => {
      return this.request("/user");
    },

    // Create user
    createUser: async (userData) => {
      return this.request("/user", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
  };

  // Course endpoints
  course = {
    // Get all courses
    getAllCourses: async () => {
      return this.request("/course");
    },

    // Get course by ID
    getCourse: async (id) => {
      return this.request(`/course/${id}`);
    },

    // Create course
    createCourse: async (courseData) => {
      return this.request("/course", {
        method: "POST",
        body: JSON.stringify(courseData),
      });
    },
  };

  // Major endpoints
  major = {
    // Get all majors
    getAllMajors: async () => {
      return this.request("/major");
    },

    // Get major by ID
    getMajor: async (id) => {
      return this.request(`/major/${id}`);
    },

    // Create major
    createMajor: async (majorData) => {
      return this.request("/major", {
        method: "POST",
        body: JSON.stringify(majorData),
      });
    },
  };

  // Level endpoints
  level = {
    // Get all levels
    getAllLevels: async () => {
      return this.request("/level");
    },

    // Get level by ID
    getLevel: async (id) => {
      return this.request(`/level/${id}`);
    },

    // Create level
    createLevel: async (levelData) => {
      return this.request("/level", {
        method: "POST",
        body: JSON.stringify(levelData),
      });
    },
  };

  // Sub-major endpoints
  subMajor = {
    // Get all sub-majors
    getAllSubMajors: async () => {
      return this.request("/sub-major");
    },

    // Get sub-major by ID
    getSubMajor: async (id) => {
      return this.request(`/sub-major/${id}`);
    },

    // Create sub-major
    createSubMajor: async (subMajorData) => {
      return this.request("/sub-major", {
        method: "POST",
        body: JSON.stringify(subMajorData),
      });
    },
  };

  // Material endpoints
  material = {
    // Get all materials
    getAllMaterials: async () => {
      return this.request("/material");
    },

    // Get material by ID
    getMaterial: async (id) => {
      return this.request(`/material/${id}`);
    },

    // Create material
    createMaterial: async (materialData) => {
      return this.request("/material", {
        method: "POST",
        body: JSON.stringify(materialData),
      });
    },
  };

  // Material Folder endpoints
  materialFolder = {
    // Get all material folders
    getAllFolders: async () => {
      return this.request("/material-folder");
    },

    // Get folders for a specific course
    getCourseFolder: async (courseId) => {
      return this.request(`/material-folder/${courseId}`);
    },

    // Get folders by course ID (alternative endpoint)
    getFoldersByCourse: async (courseId) => {
      return this.request(`/material-folder?courseId=${courseId}`);
    },
  };

  // Material File endpoints
  materialFile = {
    // Get files by folder ID
    getFilesByFolder: async (folderId) => {
      return this.request(`/material-file/by-folder/${folderId}`);
    },

    // Get files by folder and course
    getFilesByFolderAndCourse: async (folderId, courseId) => {
      return this.request(`/material-file?folder_id=${folderId}&course_id=${courseId}`);
    },

    // Upload file to folder
    uploadFile: async (folderId, file, name) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name || file.name);

      return this.request(`/material-file/${folderId}/upload`, {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set content-type for FormData
      });
    },

    // Download file
    downloadFile: async (fileId) => {
      return this.request(`/material-file/${fileId}/download`);
    },
  };

  // FCI Event endpoints
  event = {
    // Get all events
    getAllEvents: async () => {
      return this.request("/event");
    },

    // Get event by ID
    getEvent: async (id) => {
      return this.request(`/fci-event/${id}`);
    },

    // Create event
    createEvent: async (eventData, authToken) => {
      const formData = new FormData();
      formData.append('title', eventData.title);
      formData.append('description', eventData.description);
      formData.append('date', eventData.date);
      formData.append('type', eventData.type);

      if (eventData.image) {
        formData.append('image', eventData.image);
      }

      return fetch(`${this.baseURL}/event`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      });
    },

    // Filter events
    filterEvents: async (filterData) => {
      return this.request("/fci-event/filter", {
        method: "POST",
        body: JSON.stringify(filterData),
      });
    },
  };

  // Lecture time endpoints
  lectureTime = {
    // Get all lecture times
    getAllLectureTimes: async () => {
      return this.request("/lecture-time");
    },

    // Get lecture time by ID
    getLectureTime: async (id) => {
      return this.request(`/lecture-time/${id}`);
    },

    // Create lecture time
    createLectureTime: async (lectureTimeData) => {
      return this.request("/lecture-time", {
        method: "POST",
        body: JSON.stringify(lectureTimeData),
      });
    },
  };

  // Section time endpoints
  sectionTime = {
    // Get all section times
    getAllSectionTimes: async () => {
      return this.request("/section-time");
    },

    // Get section time by ID
    getSectionTime: async (id) => {
      return this.request(`/section-time/${id}`);
    },

    // Create section time
    createSectionTime: async (sectionTimeData) => {
      return this.request("/section-time", {
        method: "POST",
        body: JSON.stringify(sectionTimeData),
      });
    },
  };

  // Dropbox endpoints
  dropbox = {
    // Upload file
    uploadFile: async (file, path = "/") => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", path);

      return this.request("/dropbox/upload", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set content-type for FormData
      });
    },

    // Get file list
    getFileList: async (path = "/") => {
      return this.request(`/dropbox/list?path=${encodeURIComponent(path)}`);
    },

    // Download file
    downloadFile: async (path) => {
      return this.request(`/dropbox/download?path=${encodeURIComponent(path)}`);
    },

    // Delete file
    deleteFile: async (path) => {
      return this.request("/dropbox/delete", {
        method: "DELETE",
        body: JSON.stringify({ path }),
      });
    },
  };

  // Mail endpoints
  mail = {
    // Send email
    sendEmail: async (emailData) => {
      return this.request("/mail/send", {
        method: "POST",
        body: JSON.stringify(emailData),
      });
    },
  };
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
