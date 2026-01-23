"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext(undefined);

// API base URL - adjust based on your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpecto.org/api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper to check if email is a workspace/college email
const isWorkspaceEmail = (email) => {
  if (!email) return false;
  const workspaceDomains = [
    ".edu",
    ".edu.in",
    ".ac.in",
    ".ac.uk",
    ".edu.au",
    ".edu.sg",
    ".edu.my",
    ".edu.ph",
    ".edu.pk",
    ".edu.bd",
    ".edu.ng",
    ".edu.za",
    ".edu.cn",
    ".edu.hk",
    ".edu.tw",
    ".edu.jp",
    ".edu.kr",
    ".iitkgp.ac.in",
    ".iitb.ac.in",
    ".iitd.ac.in",
    ".iitm.ac.in",
    ".iitr.ac.in",
    ".iitk.ac.in",
    ".iitg.ac.in",
    ".iith.ac.in",
    ".iitp.ac.in",
    ".iitism.ac.in",
  ];

  return workspaceDomains.some((domain) =>
    email.toLowerCase().endsWith(domain),
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);

  // Fetch current user on mount
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include", // Important for cookies
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          // Check if profile needs completion
          if (!data.user.collegeName) {
            setShowProfileCompletion(true);
          }
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Login with Google - redirects to backend OAuth
  const loginWithGoogle = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  // Complete user profile
  const completeProfile = async (profileData) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setShowProfileCompletion(false);
        return { success: true };
      } else {
        setError(data.message);
        return { success: false, error: data.message };
      }
    } catch (err) {
      const errorMsg = "Failed to update profile";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.message);
        return { success: false, error: data.message };
      }
    } catch (err) {
      const errorMsg = "Failed to update profile";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setShowProfileCompletion(false);
    } catch (err) {
      console.error("Logout failed:", err);
      // Still clear local state even if request fails
      setUser(null);
      setShowProfileCompletion(false);
    }
  };

  // Check if user's email is a workspace email
  const userHasWorkspaceEmail = user ? isWorkspaceEmail(user.email) : false;

  // Determine what profile fields are required
  const getRequiredProfileFields = () => {
    if (!user) return [];
    if (userHasWorkspaceEmail) {
      // Workspace email users only need to provide college name
      return ["collegeName"];
    }
    // Non-workspace email users need both college email and name
    return ["collegeName", "collegeEmail"];
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    userHasWorkspaceEmail,
    showProfileCompletion,
    setShowProfileCompletion,
    getRequiredProfileFields,
    loginWithGoogle,
    logout,
    completeProfile,
    updateProfile,
    refreshUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
