import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, CheckCircle, XCircle, Clock, Trash2, Users,
  AlertCircle, GraduationCap, Award, Briefcase, MapPin,
  Mail, Phone, Globe, Eye, UserCheck, UserX, ChevronRight,
  KeyRound, CheckCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('contacts');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectMsg, setRejectMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchAll = async () => {
    try {
      const [statsRes, reqRes, usersRes, profilesRes] = await Promise.all([
        axios.get('/users/admin/stats'),
        axios.get('/contact-requests/all'),
        axios.get('/users/all'),
        axios.get('/users/admin/profiles')
      ]);
      setStats(statsRes.data);
      setRequests(reqRes.data);
      setUsers(usersRes.data);
      setProfiles(profilesRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Account Approval (Legacy - Auto Approval now on) ──
  // Removed account approval routines

  // ── Contact Request Approval ──
  const handleApproveContact = async (id) => {
    setActionLoading(id + '_ctr_approve');
    try {
      await axios.put(`/contact-requests/${id}`, { status: 'approved', adminMessage: '' });
      showToast('✅ Contact request approved! Student can now see alumni details.');
      await fetchAll();
    } catch { showToast('Failed.', 'error'); }
    finally { setActionLoading(null); }
  };

  const handleApproveUser = async (id, name) => {
    try {
      await axios.put(`/users/approve/${id}`, { approved: true });
      showToast(`User "${name}" approved.`);
      await fetchAll();
    } catch { showToast('Failed to approve user.', 'error'); }
  };

  const handleRejectContact = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal + '_ctr_reject');
    try {
      await axios.put(`/contact-requests/${rejectModal}`, { status: 'rejected', adminMessage: rejectMsg });
      showToast('❌ Contact request rejected. Message sent to student.');
      setRejectModal(null);
      setRejectMsg('');
      await fetchAll();
    } catch { showToast('Failed.', 'error'); }
    finally { setActionLoading(null); }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete "${name}" permanently?`)) return;
    try {
      await axios.delete(`/users/${id}`);
      showToast(`User "${name}" deleted.`);
      await fetchAll();
    } catch { showToast('Failed.', 'error'); }
  };




  const pendingContactCount = requests.filter(r => r.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[85vh] bg-slate-100 dark:bg-slate-950 -mt-8 py-8 px-4 sm:px-6">
      <div className="max-w-[90rem] mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-xl shadow-xl text-white font-medium text-sm ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Area */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Admin Console</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">System management and oversight</p>
          </div>
        </div>
        
        {/* Compact Stats */}
        {stats && (
          <div className="flex gap-4 sm:gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.totalStudents}</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold flex items-center gap-1"><GraduationCap className="h-3 w-3" /> Students</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.totalAlumni}</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold flex items-center gap-1"><Award className="h-3 w-3" /> Alumni</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 flex gap-2 lg:flex-col overflow-x-auto pb-2 lg:pb-0">
          {[
            { id: 'contacts', label: 'Contact Requests', badge: pendingContactCount, icon: Mail },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'profiles', label: 'All Profiles', icon: Eye }
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-3.5 rounded-xl font-medium text-sm flex items-center justify-between transition-all whitespace-nowrap ${
                tab === t.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}>
              <div className="flex items-center gap-3">
                <t.icon className="h-5 w-5" />
                {t.label}
              </div>
              {t.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tab === t.id ? 'bg-white/20' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">

      {/* ═══════════ TAB 2: CONTACT REQUESTS ═══════════ */}
      {tab === 'contacts' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {requests.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Mail className="h-10 w-10 mx-auto mb-3 opacity-50" />
              No contact detail requests yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                  <tr>
                    {['Student (Requester)', '', 'Alumni (Target)', 'Date', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-4 text-left font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                  {requests.map(req => (
                    <tr key={req._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shrink-0">{req.requester?.name?.charAt(0)}</div>
                          <div>
                            <div className="font-medium text-slate-800 dark:text-white">{req.requester?.name}</div>
                            <div className="text-xs text-slate-400">{req.requester?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-4"><ChevronRight className="h-4 w-4 text-slate-300" /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">{req.targetAlumni?.name?.charAt(0)}</div>
                          <div>
                            <div className="font-medium text-slate-800 dark:text-white">{req.targetAlumni?.name}</div>
                            <div className="text-xs text-slate-400">{req.targetAlumni?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">
                        {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                          req.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          req.status === 'rejected' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>{req.status}</span>
                        {req.adminMessage && <p className="text-xs text-red-400 mt-1 italic truncate max-w-[120px]" title={req.adminMessage}>"{req.adminMessage}"</p>}
                      </td>
                      <td className="px-5 py-4">
                        {req.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button onClick={() => handleApproveContact(req._id)}
                              disabled={actionLoading === req._id + '_ctr_approve'}
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-xs transition shadow disabled:opacity-60">
                              {actionLoading === req._id + '_ctr_approve' ? <div className="h-3 w-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                              Approve
                            </button>
                            <button onClick={() => { setRejectModal(req._id); setRejectMsg(''); }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-xs transition shadow">
                              <XCircle className="h-3.5 w-3.5" /> Reject
                            </button>
                          </div>
                        ) : <span className="text-xs text-slate-400 italic">Done</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══════════ TAB 3: ALL USERS ═══════════ */}
      {tab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                <tr>
                  {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                          u.role === 'admin' ? 'bg-gradient-to-br from-rose-500 to-pink-600' :
                          u.role === 'alumni' ? 'bg-gradient-to-br from-violet-500 to-indigo-600' :
                          'bg-gradient-to-br from-blue-500 to-cyan-500'
                        }`}>{u.name.charAt(0)}</div>
                        <span className="font-medium text-slate-800 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        u.role === 'admin' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                        u.role === 'alumni' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-4">
                      {u.role === 'admin' ? (
                        <span className="text-xs text-rose-500 font-medium">Admin</span>
                      ) : u.isApproved ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium"><CheckCircle className="h-3 w-3" /> Approved</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-600 font-medium"><Clock className="h-3 w-3" /> Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-5 py-4">
                      {u.role !== 'admin' && (
                        <div className="flex gap-2">
                          {!u.isApproved && (
                            <button onClick={() => handleApproveUser(u._id, u.name)}
                              className="flex items-center gap-1 px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-xs transition">
                              <CheckCircle className="h-3 w-3" /> Approve
                            </button>
                          )}
                          <button onClick={() => handleDeleteUser(u._id, u.name)}
                            className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs transition border border-red-200 dark:border-red-900 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400">
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════ TAB 4: ALL PROFILES ═══════════ */}
      {tab === 'profiles' && (
        <div>
          {profiles.length === 0 ? (
            <div className="text-center py-16 text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700">
              No completed profiles yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {profiles.map((p, i) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className={`px-5 py-4 ${p.user?.role === 'alumni' ? 'bg-gradient-to-r from-violet-500/10 to-indigo-500/10' : 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`h-14 w-14 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md shrink-0 ${
                        p.user?.role === 'alumni' ? 'bg-gradient-to-br from-violet-500 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                      }`}>{p.user?.name?.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">{p.user?.name}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            p.user?.role === 'alumni' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>{p.user?.role}</span>
                          {p.user?.isApproved ? (
                            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5"><CheckCircle className="h-2.5 w-2.5" /> Approved</span>
                          ) : (
                            <span className="text-[10px] text-amber-600 font-medium flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" /> Pending</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-4 space-y-3">
                    {p.bio && <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{p.bio}"</p>}
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="text-blue-600 dark:text-blue-400">{p.user?.email}</span>
                      </div>
                      {p.phone && <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Phone className="h-4 w-4 text-slate-400 shrink-0" /><span>{p.phone}</span></div>}
                      {p.location && <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><MapPin className="h-4 w-4 text-slate-400 shrink-0" /><span>{p.location}, {p.country}{p.isAbroad ? ' 🌍' : ''}</span></div>}
                    </div>
                    {p.user?.role === 'alumni' && p.company && (
                      <div className="bg-violet-50 dark:bg-violet-900/10 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-sm"><Briefcase className="h-4 w-4 text-violet-500" /><span className="font-medium text-slate-800 dark:text-slate-200">{p.role} at {p.company}</span></div>
                        <div className="text-xs text-slate-500 mt-1">{p.experienceYears} yrs exp · Class of {p.graduationYear}</div>
                      </div>
                    )}
                    {p.user?.role === 'student' && (
                      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-sm"><GraduationCap className="h-4 w-4 text-blue-500" /><span className="font-medium">{p.currentYear}</span>{p.enrollmentNumber && <span className="text-xs text-slate-400">({p.enrollmentNumber})</span>}</div>
                      </div>
                    )}
                    {p.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {p.skills.map(s => <span key={s} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 px-2 py-0.5 rounded-full text-[10px] font-medium">{s}</span>)}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

        </div> {/* flex-1 min-w-0 */}
      </div> {/* flex flex-col lg:flex-row gap-6 */}
      </div> {/* max-w-[90rem] */}

      {/* ═══════════ REJECT CONTACT MODAL ═══════════ */}
      <AnimatePresence>
        {rejectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setRejectModal(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" /> Reject Contact Request
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
                Write a reason. This will be sent as a notification to the student.
              </p>
              <textarea rows="4" value={rejectMsg} onChange={e => setRejectMsg(e.target.value)}
                placeholder="e.g. Your profile needs to be updated first..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-red-400 text-slate-900 dark:text-white text-sm resize-none mb-4" />
              <div className="flex justify-end gap-3">
                <button onClick={() => setRejectModal(null)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm transition">Cancel</button>
                <button onClick={handleRejectContact}
                  disabled={!rejectMsg.trim() || actionLoading}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition shadow disabled:opacity-60 flex items-center gap-2">
                  {actionLoading ? <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <XCircle className="h-4 w-4" />}
                  Reject & Notify
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
};

export default AdminDashboard;
