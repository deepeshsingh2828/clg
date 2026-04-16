import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, MapPin, Phone, Globe, FileText, Sparkles, ArrowRight, Plus, X } from 'lucide-react';

const CompleteProfile = ({ user, onProfileComplete }) => {
  const navigate = useNavigate();
  const isAlumni = user.role === 'alumni';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const [formData, setFormData] = useState({
    bio: '',
    phone: '',
    location: '',
    country: 'India',
    skills: [],
    socialLinks: { linkedin: '', github: '', twitter: '' },
    // Alumni fields
    company: '',
    role: '',
    experienceYears: 0,
    isAbroad: false,
    graduationYear: new Date().getFullYear(),
    // Student fields
    currentYear: '1st Year',
    enrollmentNumber: '',
    interests: []
  });

  const [interestInput, setInterestInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('social.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const removeSkill = (s) => setFormData(prev => ({ ...prev, skills: prev.skills.filter(sk => sk !== s) }));

  const addInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData(prev => ({ ...prev, interests: [...prev.interests, interestInput.trim()] }));
      setInterestInput('');
    }
  };

  const removeInterest = (i) => setFormData(prev => ({ ...prev, interests: prev.interests.filter(x => x !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/users/profile', formData);
      if (onProfileComplete) onProfileComplete();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className={`px-8 py-6 ${isAlumni ? 'bg-gradient-to-r from-violet-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-cyan-500'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              {isAlumni ? <Briefcase className="h-6 w-6 text-white" /> : <GraduationCap className="h-6 w-6 text-white" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isAlumni ? 'Complete Your Alumni Profile' : 'Complete Your Student Profile'}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {isAlumni
                  ? 'Help students connect with you by sharing your professional journey'
                  : 'Tell us about yourself so alumni can help guide your career'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 text-sm px-4 py-3 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* Bio */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="h-4 w-4" /> About You
            </label>
            <textarea
              name="bio" rows="3" value={formData.bio} onChange={handleChange}
              placeholder={isAlumni ? 'Tell students about your journey after BCA...' : 'Share your aspirations and what you hope to learn...'}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white resize-none transition-all"
            />
          </div>

          {/* Phone & Location row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="h-4 w-4" /> Phone Number
              </label>
              <input
                type="tel" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="h-4 w-4" /> Location
              </label>
              <input
                type="text" name="location" value={formData.location} onChange={handleChange}
                placeholder="e.g. Mumbai, Delhi, Bangalore"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-all"
              />
            </div>
          </div>

          {/* ============ ALUMNI-SPECIFIC FIELDS ============ */}
          {isAlumni && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 p-5 bg-violet-50 dark:bg-violet-900/10 rounded-2xl border border-violet-200 dark:border-violet-800">
              <h3 className="flex items-center gap-2 font-semibold text-violet-800 dark:text-violet-300">
                <Briefcase className="h-5 w-5" /> Professional Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Company</label>
                  <input
                    type="text" name="company" required value={formData.company} onChange={handleChange}
                    placeholder="e.g. Google, TCS, Infosys"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-900 dark:text-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Job Role</label>
                  <input
                    type="text" name="role" required value={formData.role} onChange={handleChange}
                    placeholder="e.g. Software Engineer, Data Analyst"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-900 dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Experience (Years)</label>
                  <input
                    type="number" name="experienceYears" min="0" value={formData.experienceYears} onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-900 dark:text-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Graduation Year</label>
                  <input
                    type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-900 dark:text-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Country</label>
                  <input
                    type="text" name="country" value={formData.country} onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-900 dark:text-white transition-all"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" name="isAbroad" checked={formData.isAbroad} onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Globe className="h-4 w-4" /> I am currently working abroad
                </span>
              </label>
            </motion.div>
          )}

          {/* ============ STUDENT-SPECIFIC FIELDS ============ */}
          {!isAlumni && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 p-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-200 dark:border-blue-800">
              <h3 className="flex items-center gap-2 font-semibold text-blue-800 dark:text-blue-300">
                <GraduationCap className="h-5 w-5" /> Academic Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Current Year</label>
                  <select
                    name="currentYear" value={formData.currentYear} onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-all"
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Enrollment Number</label>
                  <input
                    type="text" name="enrollmentNumber" value={formData.enrollmentNumber} onChange={handleChange}
                    placeholder="e.g. BCA2024001"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-all"
                  />
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Areas of Interest</label>
                <div className="flex gap-2">
                  <input
                    type="text" value={interestInput} onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    placeholder="e.g. Web Development"
                    className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                  />
                  <button type="button" onClick={addInterest} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.interests.map(i => (
                    <span key={i} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      {i} <button type="button" onClick={() => removeInterest(i)}><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Skills (Common) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Sparkles className="h-4 w-4" /> Skills
            </label>
            <div className="flex gap-2">
              <input
                type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="e.g. React, Python, Java"
                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
              />
              <button type="button" onClick={addSkill} className="p-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl transition">
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.skills.map(s => (
                <span key={s} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  {s} <button type="button" onClick={() => removeSkill(s)}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Social Links (Common) */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Social Links (optional)</label>
            <input type="url" name="social.linkedin" value={formData.socialLinks.linkedin} onChange={handleChange}
              placeholder="LinkedIn URL" className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm" />
            <input type="url" name="social.github" value={formData.socialLinks.github} onChange={handleChange}
              placeholder="GitHub URL" className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm" />
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className={`group w-full flex justify-center items-center gap-2 py-3.5 text-white text-sm font-medium rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 ${
              isAlumni
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-violet-500/25'
                : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-blue-500/25'
            }`}
          >
            {loading ? 'Saving...' : 'Save Profile & Continue'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
