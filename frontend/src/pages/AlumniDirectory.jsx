import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Briefcase, Globe, Lock, Eye, Clock, CheckCircle, XCircle, Mail, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AlumniDirectory = ({ user }) => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAbroad, setFilterAbroad] = useState(false);
  const [requestStatuses, setRequestStatuses] = useState({});
  const [requestingId, setRequestingId] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchAlumni = async () => {
    try {
      const { data } = await axios.get('/users/alumni');
      setAlumni(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const { data } = await axios.get('/contact-requests/mine');
      const map = {};
      data.forEach(req => {
        map[req.targetAlumni?._id] = { status: req.status, message: req.adminMessage };
      });
      setRequestStatuses(map);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlumni();
    fetchMyRequests();
  }, []);

  const handleRequestContact = async (alumniUserId) => {
    setRequestingId(alumniUserId);
    try {
      await axios.post('/contact-requests', { targetAlumniId: alumniUserId });
      setRequestStatuses(prev => ({ ...prev, [alumniUserId]: { status: 'pending' } }));
      showToast('Request sent! Awaiting admin approval.', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send request.';
      showToast(msg, 'error');
    } finally {
      setRequestingId(null);
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filteredAlumni = alumni.filter(profile => {
    const matchesSearch =
      profile.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAbroad = filterAbroad ? profile.isAbroad : true;
    return matchesSearch && matchesAbroad;
  });

  const getRequestState = (alumniUserId) => requestStatuses[alumniUserId] || { status: 'none' };

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-xl text-white font-medium text-sm ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Alumni Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Connect with graduates around the world.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text" placeholder="Search by name or company..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setFilterAbroad(!filterAbroad)}
            className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-medium transition-all ${filterAbroad ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700/50 dark:text-indigo-300' : 'bg-white border-gray-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
          >
            <Globe className="h-4 w-4" /> Working Abroad
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredAlumni.length === 0 ? (
        <div className="text-center p-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">No alumni found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((profile, i) => {
            const reqState = getRequestState(profile.user?._id);
            const isApproved = profile.contactVisible;
            const isOwnProfile = user._id === profile.user?._id;

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                key={profile._id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0">
                    {profile.user?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{profile.user?.name}</h3>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Class of {profile.graduationYear || '2020'}</p>
                  </div>
                  {isApproved && (
                    <span className="ml-auto bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-2 py-1 rounded-full">
                      Unlocked
                    </span>
                  )}
                </div>

                {/* Always-visible info */}
                <div className="space-y-2 mb-4">
                  {profile.role && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                      <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate">{profile.role} at <strong className="text-slate-800 dark:text-slate-200">{profile.company || 'N/A'}</strong></span>
                    </div>
                  )}
                  {profile.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {profile.skills.slice(0, 3).map(s => (
                        <span key={s} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Private details section */}
                <div className={`rounded-xl p-4 mb-4 flex-1 ${isApproved ? 'bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700'}`}>
                  {isApproved ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Contact Details
                      </p>
                      {profile.email && (
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                          <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                          <a href={`mailto:${profile.email}`} className="hover:underline text-blue-600 dark:text-blue-400 truncate">{profile.email}</a>
                        </div>
                      )}
                      {profile.location && (
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>{profile.location}, {profile.country}</span>
                        </div>
                      )}
                      {profile.socialLinks?.linkedin && (
                        <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                          <ExternalLink className="h-4 w-4" /> LinkedIn Profile
                        </a>
                      )}
                      {profile.socialLinks?.github && (
                        <a href={profile.socialLinks.github} target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 hover:underline">
                          <ExternalLink className="h-4 w-4" /> GitHub Profile
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-2 gap-2">
                      <Lock className="h-6 w-6 text-slate-400" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">Contact details are private</p>
                      {reqState.status === 'rejected' && reqState.message && (
                        <p className="text-xs text-red-500 mt-1 italic">"{reqState.message}"</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {!isOwnProfile && (
                  <div className="mt-auto">
                    {isApproved ? (
                      <div className="flex items-center justify-center gap-2 py-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle className="h-4 w-4" /> Access Granted
                      </div>
                    ) : reqState.status === 'pending' ? (
                      <div className="flex items-center justify-center gap-2 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl text-sm font-medium border border-amber-200 dark:border-amber-800">
                        <Clock className="h-4 w-4" /> Request Pending
                      </div>
                    ) : reqState.status === 'rejected' ? (
                      <button
                        onClick={() => handleRequestContact(profile.user?._id)}
                        disabled={requestingId === profile.user?._id}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-200 dark:border-red-900 transition"
                      >
                        <XCircle className="h-4 w-4" /> Request Again
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRequestContact(profile.user?._id)}
                        disabled={requestingId === profile.user?._id}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-md shadow-blue-500/20 transition active:scale-[0.98] disabled:opacity-70"
                      >
                        {requestingId === profile.user?._id ? (
                          <><div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending...</>
                        ) : (
                          <><Lock className="h-4 w-4" /> Request Contact</>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AlumniDirectory;
