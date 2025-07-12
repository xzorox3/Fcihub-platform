import { useState, useEffect, createContext, useContext } from 'react';
import Cookies from 'js-cookie';
import apiService from './api';

// Create authentication context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check for existing authentication instead of clearing it
      await checkAuthStatus();
    } catch (error) {
      console.error('Error initializing auth:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      // Check cookies first, then localStorage as fallback
      let token = Cookies.get('authToken') || localStorage.getItem('authToken');
      let userData = Cookies.get('user') || localStorage.getItem('user');
      let userRole = Cookies.get('userRole') || localStorage.getItem('userRole');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsAdmin(userRole === 'admin');

        // If data was found in localStorage but not cookies, restore cookies
        if (!Cookies.get('authToken') && localStorage.getItem('authToken')) {
          Cookies.set('authToken', token, {
            expires: 7,
            secure: import.meta.env.PROD,
            sameSite: 'strict',
            path: '/',
          });
          Cookies.set('user', userData, {
            expires: 7,
            secure: import.meta.env.PROD,
            sameSite: 'strict',
            path: '/',
          });
          Cookies.set('userRole', userRole, {
            expires: 7,
            secure: import.meta.env.PROD,
            sameSite: 'strict',
            path: '/',
          });
        }
      } else {
        // No valid authentication found, ensure state is reset
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      logout();
    }
  };

  const login = async (email, password, userType = 'admin') => {
    try {
      const loginMethod = userType === 'admin' 
        ? apiService.auth.loginAdmin 
        : apiService.auth.loginUser;

      const data = await loginMethod(email, password);

      // Store authentication data in both cookies and localStorage for persistence
      if (data.token) {
        Cookies.set('authToken', data.token, {
          expires: 7,
          secure: import.meta.env.PROD,
          sameSite: 'strict',
          path: '/',
        });
        localStorage.setItem('authToken', data.token);
      }

      if (data.user) {
        const userDataString = JSON.stringify(data.user);

        Cookies.set('user', userDataString, {
          expires: 7,
          secure: import.meta.env.PROD,
          sameSite: 'strict',
          path: '/',
        });

        Cookies.set('userRole', data.user.role, {
          expires: 7,
          secure: import.meta.env.PROD,
          sameSite: 'strict',
          path: '/',
        });

        // Also store in localStorage
        localStorage.setItem('user', userDataString);
        localStorage.setItem('userRole', data.user.role);

        setUser(data.user);
        setIsAuthenticated(true);
        setIsAdmin(data.user.role === 'admin');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData, userType = 'user') => {
    try {
      const registerMethod = userType === 'admin' 
        ? apiService.auth.registerAdmin 
        : apiService.auth.registerUser;

      const data = await registerMethod(userData);
      return { success: true, data };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    // Remove cookies
    Cookies.remove('authToken');
    Cookies.remove('user');
    Cookies.remove('userRole');

    // Remove localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');

    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const refreshUser = async () => {
    try {
      if (!isAuthenticated) return;

      const profileMethod = isAdmin 
        ? apiService.user.getAdminProfile 
        : apiService.user.getProfile;

      const data = await profileMethod();
      
      if (data.userData) {
        setUser(data.userData);
        const userDataString = JSON.stringify(data.userData);

        Cookies.set('user', userDataString, {
          expires: 7,
          secure: import.meta.env.PROD,
          sameSite: 'strict',
          path: '/',
        });

        // Also update localStorage
        localStorage.setItem('user', userDataString);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      // If refresh fails, logout the user
      logout();
    }
  };

  const forgotPassword = async (email) => {
    try {
      const data = await apiService.auth.forgotPassword(email);
      return { success: true, data };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: error.message };
    }
  };

  const verifyResetCode = async (email, code) => {
    try {
      const data = await apiService.auth.verifyResetCode(email, code);
      return { success: true, data };
    } catch (error) {
      console.error('Verify reset code error:', error);
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    try {
      const data = await apiService.auth.resetPassword(email, code, newPassword);
      return { success: true, data };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    register,
    logout,
    refreshUser,
    checkAuthStatus,
    forgotPassword,
    verifyResetCode,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 