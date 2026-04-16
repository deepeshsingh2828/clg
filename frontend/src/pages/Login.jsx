import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, ArrowRight, ShieldCheck, GraduationCap, Clock } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      onLogin(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => {
    setEmail('admin@bca.com');
    setPassword('admin123');
    setIsAdminLogin(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center -mt-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800"
      >
        <div className="px-8 pt-10 pb-8 sm:px-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${isAdminLogin ? 'bg-rose-600 shadow-rose-500/30' : 'bg-blue-600 shadow-blue-500/30'}`}>
              {isAdminLogin ? <ShieldCheck className="h-8 w-8 text-white" /> : <Code2 className="h-8 w-8 text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {isAdminLogin ? 'Admin Login' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {isAdminLogin ? 'Sign in to the Admin Control Panel' : 'Sign in to your BCA Alumni Connect account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50/50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}


            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setIsAdminLogin(false); }}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 dark:text-white"
                  placeholder="john.doe@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 dark:text-white"
                  placeholder="••••••••" />
              </div>
              <div className="text-right">
                <Link to="/forgot-password" className="text-xs text-amber-600 hover:text-amber-500 font-medium hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className={`group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${isAdminLogin ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {loading ? 'Please wait...' : 'Sign In'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-slate-700"></div></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white dark:bg-slate-900 px-3 text-slate-400">or</span></div>
          </div>

          {/* Admin Quick Login */}
          <button onClick={fillAdmin}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-medium text-sm hover:bg-rose-50 dark:hover:bg-rose-900/10 transition">
            <ShieldCheck className="h-4 w-4" />
            Login as Admin
          </button>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Create one now
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
