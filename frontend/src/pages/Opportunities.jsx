import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Briefcase, Building, MapPin, ExternalLink, Plus } from 'lucide-react';

const Opportunities = ({ user }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'Job', company: '', location: '', applyLink: ''
  });

  const fetchOpportunities = async () => {
    try {
      const { data } = await axios.get('/opportunities');
      setOpportunities(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/opportunities', formData);
      setShowForm(false);
      setFormData({ title: '', description: '', type: 'Job', company: '', location: '', applyLink: '' });
      fetchOpportunities();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Job Board</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Discover exclusive internships and full-time roles.</p>
        </div>
        
        {user.role === 'alumni' && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition shadow-md"
          >
            <Plus className="h-5 w-5" /> Post Opportunity
          </button>
        )}
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 mb-8"
        >
          <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Create New Post</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
               <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-white" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
               <input type="text" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-white" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
               <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-white" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
               <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-white">
                 <option>Job</option>
                 <option>Internship</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Application Link</label>
               <input type="url" value={formData.applyLink} onChange={e => setFormData({...formData, applyLink: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-white" />
            </div>
            <div className="col-span-1 md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
               <textarea rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-white"></textarea>
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow transition">Submit Post</button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="text-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div></div>
      ) : opportunities.length === 0 ? (
         <div className="text-center p-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700">
           <Briefcase className="h-12 w-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
           <p className="text-slate-500 dark:text-slate-400">No opportunities have been posted yet.</p>
         </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={opp._id} 
              className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="h-16 w-16 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Building className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{opp.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">{opp.company}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider w-max ${opp.type === 'Internship' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                    {opp.type}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {opp.location || 'Remote'}</div>
                  <div className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> Posted by {opp.postedBy?.name}</div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-4">{opp.description}</p>
                
                {opp.applyLink && (
                  <a href={opp.applyLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Apply Now <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Opportunities;
