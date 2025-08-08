import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session on initial load
    const checkAuth = async () => {
      try {
        const token = Cookies.get('token');
        if (token) {
          // In a real app, you would validate the token with your backend
          // For demo purposes, we'll just set a mock user
          setUser({
            id: 1,
            name: 'Demo Admin',
            email: 'demo@delighthomes.com',
            role: 'admin'
          });
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // In a real app, you would make an API call to your backend
      if (email === 'demo@delighthomes.com' && password === 'demo123') {
        const userData = {
          id: 1,
          name: 'Demo Admin',
          email: 'demo@delighthomes.com',
          role: 'admin'
        };
        
        // Set a cookie with the token
        Cookies.set('token', 'demo-token', { expires: 1 }); // Expires in 1 day
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const logout = async () => {
    try {
      // In a real app, you would make an API call to invalidate the token
      Cookies.remove('token');
      setUser(null);
      router.push('/login');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'An error occurred during logout' };
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        hasRole,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
