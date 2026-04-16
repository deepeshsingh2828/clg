import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Users, Briefcase, MessageSquare, TrendingUp, Sparkles,
  GraduationCap, BookOpen, Target, UserCheck, Award,
  Building, Globe, PlusCircle, ChevronRight
} from 'lucide-react';

const Dashboard = ({ user }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/users/profile/check/status');
        if (data.completed) setProfile(data.profile);
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, []);

  if (user.role === 'alumni') return <AlumniDashboard user={user} profile={profile} />;
  return <StudentDashboard user={user} profile={profile} />;
};

/* ═══════════════════════════════════════════
   STUDENT DASHBOARD – Blue/Cyan theme
   ═══════════════════════════════════════════ */
const StudentDashboard = ({ user, profile }) => {
  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          Hey, {user.name.split(' ')[0]}! <GraduationCap className="h-9 w-9 text-blue-500" />
        </h1>
        <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
          {profile?.currentYear || 'BCA Student'} — Explore alumni, find mentors, and land your dream opportunity.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <Users className="h-10 w-10 mb-4 opacity-80" />
          <h3 className="text-2xl font-bold mb-1">Find Alumni</h3>
          <p className="text-blue-100 text-sm mb-6">Connect with BCA graduates at top companies worldwide.</p>
          <Link to="/directory" className="inline-flex items-center gap-1 font-medium text-sm bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-lg transition">
            Browse Directory <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-100 dark:border-slate-700">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4">
            <Briefcase className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Internships & Jobs</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Exclusive opportunities shared by alumni.</p>
          <Link to="/opportunities" className="text-emerald-600 dark:text-emerald-400 font-medium text-sm hover:underline flex items-center gap-1">
            Explore <TrendingUp className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-100 dark:border-slate-700">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Get Mentorship</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Chat with alumni for career guidance and tips.</p>
          <Link to="/chat" className="text-purple-600 dark:text-purple-400 font-medium text-sm hover:underline flex items-center gap-1">
            Start Chatting <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      {/* Profile Summary */}
      {profile && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" /> Your Student Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/15 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{profile.currentYear || '—'}</p>
              <p className="text-sm text-slate-500">Current Year</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/15 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{profile.enrollmentNumber || '—'}</p>
              <p className="text-sm text-slate-500">Enrollment No.</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/15 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{profile.skills?.length || 0}</p>
              <p className="text-sm text-slate-500">Skills</p>
            </div>
          </div>
          {profile.interests?.length > 0 && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Target className="h-4 w-4 text-slate-400" />
              {profile.interests.map(i => (
                <span key={i} className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full text-xs font-medium">{i}</span>
              ))}
            </div>
          )}
          <Link to="/complete-profile" className="mt-4 inline-block text-sm text-blue-600 hover:underline font-medium">
            Edit Profile →
          </Link>
        </motion.div>
      )}

      {/* Tips section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" /> Quick Tips
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: UserCheck, title: 'Request Contact', desc: 'Click "Request Contact" on alumni cards to unlock their private details.' },
            { icon: Award, title: 'Build Your Profile', desc: 'A complete profile helps alumni identify and mentor you better.' },
          ].map((tip, i) => (
            <div key={i} className="flex gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <tip.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-white text-sm">{tip.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   ALUMNI DASHBOARD – Violet/Indigo theme
   ═══════════════════════════════════════════ */
const AlumniDashboard = ({ user, profile }) => {
  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          Welcome back, {user.name.split(' ')[0]} <Award className="h-9 w-9 text-violet-500" />
        </h1>
        <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
          {profile?.role ? `${profile.role} at ${profile.company}` : 'BCA Alumni'} — Inspire and guide the next generation.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-violet-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <PlusCircle className="h-10 w-10 mb-4 opacity-80" />
          <h3 className="text-2xl font-bold mb-1">Post Opportunity</h3>
          <p className="text-violet-100 text-sm mb-6">Share job or internship openings with students.</p>
          <Link to="/opportunities" className="inline-flex items-center gap-1 font-medium text-sm bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-lg transition">
            Go to Job Board <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-100 dark:border-slate-700">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Mentorship Chat</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Respond to students and share your insights.</p>
          <Link to="/chat" className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline flex items-center gap-1">
            Open Messages <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-100 dark:border-slate-700">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Alumni Network</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">View other alumni and expand your network.</p>
          <Link to="/directory" className="text-emerald-600 dark:text-emerald-400 font-medium text-sm hover:underline flex items-center gap-1">
            View Directory <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      {/* Professional Profile Card */}
      {profile && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
            <Building className="h-5 w-5 text-violet-500" /> Your Professional Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-violet-50 dark:bg-violet-900/15 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-violet-700 dark:text-violet-400 truncate">{profile.company || '—'}</p>
              <p className="text-sm text-slate-500">Company</p>
            </div>
            <div className="bg-violet-50 dark:bg-violet-900/15 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-violet-700 dark:text-violet-400 truncate">{profile.role || '—'}</p>
              <p className="text-sm text-slate-500">Role</p>
            </div>
            <div className="bg-violet-50 dark:bg-violet-900/15 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-violet-700 dark:text-violet-400">{profile.experienceYears || 0}</p>
              <p className="text-sm text-slate-500">Yrs Experience</p>
            </div>
            <div className="bg-violet-50 dark:bg-violet-900/15 rounded-xl p-4 text-center flex items-center justify-center gap-2">
              <Globe className="h-5 w-5 text-violet-500" />
              <div>
                <p className="text-lg font-bold text-violet-700 dark:text-violet-400">{profile.isAbroad ? 'Abroad' : 'India'}</p>
                <p className="text-sm text-slate-500">Location</p>
              </div>
            </div>
          </div>
          {profile.skills?.length > 0 && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Sparkles className="h-4 w-4 text-slate-400" />
              {profile.skills.map(s => (
                <span key={s} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-full text-xs font-medium">{s}</span>
              ))}
            </div>
          )}
          <Link to="/complete-profile" className="mt-4 inline-block text-sm text-violet-600 hover:underline font-medium">
            Edit Profile →
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
