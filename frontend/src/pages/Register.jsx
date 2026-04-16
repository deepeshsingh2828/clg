import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, ArrowRight, CheckCircle, Clock } from 'lucide-react';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/auth/register', formData);
      onLogin(data); // Auto-login user
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-[85vh] flex items-center justify-center -mt-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800 my-8"
      >
        <div className="px-8 pt-10 pb-8 sm:px-10">
          <div className="mb-8 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
              <Code2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Create an Account</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Join the BCA Alumni Connect community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50/50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                  placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                  placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <input type="password" name="password" required value={formData.password} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                  placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`cursor-pointer rounded-xl border px-4 py-3 text-center transition-all ${formData.role === 'student' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400'}`}>
                    <input type="radio" name="role" value="student" className="sr-only" onChange={handleChange} checked={formData.role === 'student'} />
                    <span className="font-medium text-sm">🎓 Student</span>
                  </label>
                  <label className={`cursor-pointer rounded-xl border px-4 py-3 text-center transition-all ${formData.role === 'alumni' ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400'}`}>
                    <input type="radio" name="role" value="alumni" className="sr-only" onChange={handleChange} checked={formData.role === 'alumni'} />
                    <span className="font-medium text-sm">🏢 Alumni</span>
                  </label>
                </div>
              </div>
            </div>


            <button type="submit" disabled={loading}
              className="mt-2 group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md active:scale-[0.98] disabled:opacity-70">
              {loading ? 'Please wait...' : 'Create Account'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Log in instead</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
