import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Code2, Users, Briefcase, MessageSquare, LogOut, LayoutDashboard, Bell, ShieldCheck, UserCircle, GraduationCap, Award, PlusCircle, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useNotifications } from '../context/NotificationContext';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const { notifications, markAllRead, clearAll } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);



  // Different nav links per role
  const getNavLinks = () => {
    if (!user) return [];
    
    const common = [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ];

    if (user.role === 'admin') {
      return [
        ...common,
        { name: 'Admin Panel', path: '/admin', icon: ShieldCheck },
        { name: 'Alumni Directory', path: '/directory', icon: Users },
        { name: 'Opportunities', path: '/opportunities', icon: Briefcase },
      ];
    }

    if (user.role === 'alumni') {
      return [
        ...common,
        { name: 'Post Jobs', path: '/opportunities', icon: PlusCircle },
        { name: 'Mentorship Chat', path: '/chat', icon: MessageSquare },
        { name: 'Network', path: '/directory', icon: Users },
        { name: 'My Profile', path: '/complete-profile', icon: UserCircle },
      ];
    }

    // Student
    return [
      ...common,
      { name: 'Find Alumni', path: '/directory', icon: Users },
      { name: 'Jobs & Internships', path: '/opportunities', icon: Briefcase },
      { name: 'Messages', path: '/chat', icon: MessageSquare },
      { name: 'My Profile', path: '/complete-profile', icon: UserCircle },
    ];
  };

  const navLinks = getNavLinks();

  const roleColor = user?.role === 'alumni' ? 'violet' : user?.role === 'admin' ? 'rose' : 'blue';
  const roleGradient = user?.role === 'alumni'
    ? 'from-violet-500 to-indigo-600'
    : user?.role === 'admin'
    ? 'from-rose-500 to-pink-600'
    : 'from-blue-500 to-cyan-500';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`p-2 bg-gradient-to-br ${roleGradient} rounded-lg group-hover:shadow-lg transition`}>
              {user?.role === 'alumni' ? <Award className="h-5 w-5 text-white" /> : user?.role === 'admin' ? <ShieldCheck className="h-5 w-5 text-white" /> : <GraduationCap className="h-5 w-5 text-white" />}
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">
              BCA Connect
            </span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link key={link.name} to={link.path}
                    className={clsx(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? `bg-${roleColor}-100 text-${roleColor}-700 dark:bg-slate-800 dark:text-${roleColor}-400`
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}>
                    <Icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="hidden md:flex items-center gap-3">
            {/* Theme Select Options */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button 
                onClick={() => {
                  document.documentElement.classList.remove('dark');
                  localStorage.theme = 'light';
                  setIsDarkMode(false);
                }} 
                className={clsx("flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition", !isDarkMode ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}
              >
                <Sun className="h-3.5 w-3.5" />
                Light
              </button>
              <button 
                onClick={() => {
                  document.documentElement.classList.add('dark');
                  localStorage.theme = 'dark';
                  setIsDarkMode(true);
                }} 
                className={clsx("flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition", isDarkMode ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}
              >
                <Moon className="h-3.5 w-3.5" />
                Dark
              </button>
            </div>

            {user ? (
              <>
                {/* Bell */}
                <div className="relative">
                  <button onClick={() => { setShowNotifs(!showNotifs); if (!showNotifs) markAllRead(); }}
                    className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {showNotifs && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden z-50">
                        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                          <h3 className="font-semibold text-slate-800 dark:text-white">Notifications</h3>
                          {notifications.length > 0 && <button onClick={clearAll} className="text-xs text-slate-400 hover:text-red-500">Clear all</button>}
                        </div>
                        <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-800">
                          {notifications.length === 0
                            ? <p className="text-sm text-slate-400 text-center py-8">No notifications</p>
                            : notifications.map(n => (
                              <div key={n.id} className={clsx("p-4 text-sm", n.status === 'approved' ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : 'bg-red-50/50 dark:bg-red-900/10')}>
                                <p className="text-slate-700 dark:text-slate-200">{n.msg}</p>
                                <p className="text-xs text-slate-400 mt-1">{new Date(n.time).toLocaleTimeString()}</p>
                              </div>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User chip */}
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${roleGradient} flex items-center justify-center text-white font-bold shadow-md text-sm`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-gray-100 block leading-none">{user.name}</span>
                    <span className={`text-xs capitalize text-${roleColor}-500`}>{user.role}</span>
                  </div>
                </div>

                <button onClick={onLogout} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition" title="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 transition">Log In</Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile button */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button 
                onClick={() => {
                  document.documentElement.classList.remove('dark');
                  localStorage.theme = 'light';
                  setIsDarkMode(false);
                }} 
                className={clsx("p-1.5 rounded-md transition", !isDarkMode ? "bg-white text-slate-800 shadow-sm" : "text-slate-500")}
              >
                <Sun className="h-4 w-4" />
              </button>
              <button 
                onClick={() => {
                  document.documentElement.classList.add('dark');
                  localStorage.theme = 'dark';
                  setIsDarkMode(true);
                }} 
                className={clsx("p-1.5 rounded-md transition", isDarkMode ? "bg-slate-700 text-white shadow-sm" : "text-slate-500")}
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {user ? (
                <>
                  <div className="flex items-center gap-3 py-4 border-b border-gray-100 dark:border-slate-800 mb-2">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-r ${roleGradient} flex items-center justify-center text-white font-bold text-lg`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800 dark:text-white">{user.name}</div>
                      <div className="text-sm text-slate-500 capitalize">{user.role}</div>
                    </div>
                  </div>
                  {navLinks.map(link => (
                    <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                      <link.icon className="h-5 w-5 text-slate-500" />
                      {link.name}
                    </Link>
                  ))}
                  <button onClick={() => { onLogout(); setIsOpen(false); }}
                    className="flex w-full items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition mt-4">
                    <LogOut className="h-5 w-5" /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 py-4">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="px-4 py-3 text-center rounded-lg border border-gray-300 font-medium dark:border-slate-700">Log In</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="px-4 py-3 text-center rounded-lg bg-blue-600 font-medium text-white shadow-md">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
