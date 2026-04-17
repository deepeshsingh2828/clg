import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AlumniDirectory from './pages/AlumniDirectory';
import Opportunities from './pages/Opportunities';
import Chat from './pages/Chat';
import AdminDashboard from './pages/AdminDashboard';
import CompleteProfile from './pages/CompleteProfile';
import ForgotPassword from './pages/ForgotPassword';
import { NotificationProvider } from './context/NotificationContext';
import axios from 'axios';

axios.defaults.baseURL = "https://clg.onrender.com";

// Handle 401 errors globally
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      // We can't use useNavigate here as it's outside the component, 
      // but we can signal a logout via window event or just let the app handle it on next render
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);

// Route guard: must be logged in
const ProtectedRoute = ({ user, children, adminOnly = false }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

// Route guard: must have complete profile (except for admin)
const ProfileRequiredRoute = ({ user, profileChecked, profileComplete, children, adminOnly = false }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  if (profileChecked && !profileComplete && user.role !== 'admin') {
    return <Navigate to="/complete-profile" replace />;
  }
  return children;
};

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);
  const [profileChecked, setProfileChecked] = useState(false);
  const [profileComplete, setProfileComplete] = useState(true);

  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      // Check if profile is completed
      axios.get('/users/profile/check/status')
        .then(({ data }) => {
          setProfileComplete(data.completed);
          setProfileChecked(true);
        })
        .catch(() => setProfileChecked(true));
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileChecked(true);
    }
  }, [user]);

  useEffect(() => {
    const handleUnauthorized = () => {
      handleLogout();
    };
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const handleLogin = (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
    setUser(userInfo);
    setProfileChecked(false);
    setProfileComplete(false);
  };

  const handleLogout = () => {
    setUser(null);
    setProfileComplete(true);
    setProfileChecked(true);
    localStorage.removeItem('userInfo');
    delete axios.defaults.headers.common['Authorization'];
  };

  const handleProfileComplete = () => {
    setProfileComplete(true);
    setProfileChecked(true);
  };



  return (
    <NotificationProvider user={user}>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
          <Navbar user={user} onLogout={handleLogout} />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
              <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} />
              <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />} />

              <Route path="/complete-profile" element={<ProtectedRoute user={user}><CompleteProfile user={user} onProfileComplete={handleProfileComplete} /></ProtectedRoute>} />

              <Route path="/dashboard" element={<ProfileRequiredRoute user={user} profileChecked={profileChecked} profileComplete={profileComplete}><Dashboard user={user} /></ProfileRequiredRoute>} />
              <Route path="/directory" element={<ProfileRequiredRoute user={user} profileChecked={profileChecked} profileComplete={profileComplete}><AlumniDirectory user={user} /></ProfileRequiredRoute>} />
              <Route path="/opportunities" element={<ProfileRequiredRoute user={user} profileChecked={profileChecked} profileComplete={profileComplete}><Opportunities user={user} /></ProfileRequiredRoute>} />
              <Route path="/chat" element={<ProfileRequiredRoute user={user} profileChecked={profileChecked} profileComplete={profileComplete}><Chat user={user} /></ProfileRequiredRoute>} />
              <Route path="/admin" element={<ProfileRequiredRoute user={user} profileChecked={profileChecked} profileComplete={profileComplete} adminOnly><AdminDashboard /></ProfileRequiredRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </NotificationProvider>
  );
};

export default App;
