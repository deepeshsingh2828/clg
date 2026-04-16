import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { KeyRound, ArrowLeft, CheckCircle, Mail } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/auth/forgot-password', { email, newPassword });
      setSuccess(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-10 text-center border border-gray-100 dark:border-slate-800">
          <div className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Password Changed!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            {success}
          </p>
          <Link to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md transition">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800"
      >
        <div className="px-8 pt-10 pb-8 sm:px-10">
          <div className="mb-8 text-center">
            <div className="mx-auto w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
              <KeyRound className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Change Password</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Enter your registered email and a new password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50/50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="h-4 w-4" /> Email Address
              </label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-gray-900 dark:text-white mb-4"
                placeholder="Enter your registered email" />
              
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <KeyRound className="h-4 w-4" /> New Password
              </label>
              <input type="password" required minLength="6" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-gray-900 dark:text-white"
                placeholder="Enter new password (min 6 chars)" />
            </div>

            <button type="submit" disabled={loading}
              className="group w-full flex justify-center items-center gap-2 py-3.5 px-4 text-sm font-medium rounded-xl text-white bg-amber-500 hover:bg-amber-600 transition-all shadow-md active:scale-[0.98] disabled:opacity-70">
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:underline font-medium flex items-center justify-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
