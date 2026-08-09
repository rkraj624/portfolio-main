import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  Check, 
  ArrowLeft, 
  User, 
  Briefcase, 
  FolderGit2, 
  Code2, 
  Award, 
  Plus, 
  Trash2,
  Download,
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  BarChart2,
  Headphones,
  Users,
  MessageSquare
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data';

export default function AdminDashboard({ data, onUpdateData, onClose }) {
  const [formData, setFormData] = useState({
    ...data,
    customSections: data.customSections || []
  });
  const [activeTab, setActiveTab] = useState('analytics');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [metrics, setMetrics] = useState({ pageViews: 0, audioListens: 0, audioCompletions: 0 });
  const [comments, setComments] = useState([]);

  React.useEffect(() => {
    fetch('/api/track-event')
      .then(res => res.json())
      .then(d => { if (d.metrics) setMetrics(d.metrics); })
      .catch(() => {});

    fetch('/api/comments')
      .then(res => res.json())
      .then(d => { if (d.comments) setComments(d.comments); })
      .catch(() => {});
  }, []);

  const [pushToGit, setPushToGit] = useState(true);
  const [resumePdfBase64, setResumePdfBase64] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [avatarBase64, setAvatarBase64] = useState(null);
  const [avatarFileName, setAvatarFileName] = useState('');
  // Authentication Lock State (Persists in sessionStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.sessionStorage.getItem('admin_authenticated') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isVerifyingLogin, setIsVerifyingLogin] = useState(false);

  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginPassword.trim()) {
      setLoginError('Please enter the Admin Password.');
      return;
    }

    setIsVerifyingLogin(true);
    setLoginError('');

    try {
      // Verify against bcrypt endpoint /api/verify-password
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword })
      });
      const result = await res.json();

      if (!res.ok || !result.authenticated) {
        setLoginError('🔒 Incorrect Admin Password! Access Denied.');
        setIsVerifyingLogin(false);
        return;
      }

      // Granted bcrypt authenticated access
      sessionStorage.setItem('admin_authenticated', 'true');
      setAdminPassword(loginPassword);
      setIsAuthenticated(true);
      setIsVerifyingLogin(false);
    } catch (err) {
      console.error('Bcrypt Login verification error:', err);
      setLoginError('Server connection error. Please try again.');
      setIsVerifyingLogin(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    onClose();
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personal: { ...prev.personal, [name]: value }
    }));
  };

  const handleStatChange = (index, field, value) => {
    const updatedStats = [...formData.personal.stats];
    updatedStats[index][field] = value;
    setFormData(prev => ({
      ...prev,
      personal: { ...prev.personal, stats: updatedStats }
    }));
  };

  const handleAddStat = () => {
    if (formData.personal.stats.length >= 4) {
      setNotification({ type: 'error', message: 'Maximum 4 Hero Metric cards allowed!' });
      return;
    }
    const newStat = { value: '99.9%', label: 'Metric Description' };
    setFormData(prev => ({
      ...prev,
      personal: { ...prev.personal, stats: [...prev.personal.stats, newStat] }
    }));
  };

  const handleRemoveStat = (statIdx) => {
    setFormData(prev => ({
      ...prev,
      personal: { ...prev.personal, stats: prev.personal.stats.filter((_, idx) => idx !== statIdx) }
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setNotification({ type: 'error', message: 'Please upload a valid image file (JPG/PNG).' });
        return;
      }
      setAvatarFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result.split(',')[1];
        setAvatarBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setNotification({ type: 'error', message: 'Please upload a valid PDF file.' });
        return;
      }
      setPdfFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result.split(',')[1];
        setResumePdfBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const openSaveModal = () => {
    setShowPasswordModal(true);
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!adminPassword.trim()) {
      setNotification({ type: 'error', message: 'Please enter your Admin Password.' });
      return;
    }

    setIsSubmitting(true);
    onUpdateData(formData);

    try {
      const res = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: formData,
          pushToGit: pushToGit,
          pdfBase64: resumePdfBase64,
          avatarBase64: avatarBase64,
          password: adminPassword
        })
      });
      const result = await res.json();

      if (!res.ok || result.error) {
        setNotification({ 
          type: 'error', 
          message: result.error || 'Invalid Admin Password! Please check environment variable.' 
        });
        setIsSubmitting(false);
        return;
      }

      setSavedSuccess(true);
      setShowPasswordModal(false);
      setIsSubmitting(false);

      if (result.gitPushed) {
        setNotification({ 
          type: 'success', 
          message: '✨ Changes saved successfully & pushed directly to GitHub repository! 🚀' 
        });
      } else {
        setNotification({ 
          type: 'success', 
          message: '✨ Changes saved locally to disk successfully!' 
        });
      }

      setTimeout(() => {
        setSavedSuccess(false);
        setNotification(null);
      }, 5000);

    } catch (err) {
      console.error("Failed to write data.js:", err);
      setNotification({ type: 'error', message: 'Server Connection Error: Unable to save changes.' });
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset all edits to original resume defaults?")) {
      setFormData({ ...PORTFOLIO_DATA, customSections: [] });
      onUpdateData({ ...PORTFOLIO_DATA, customSections: [] });
    }
  };

  // Work Experience Handlers
  const handleAddExperience = () => {
    const newExp = {
      company: 'New Company',
      role: 'Senior Software Engineer',
      period: '2026 – Present',
      techStack: ['Java', 'Spring Boot', 'Kafka'],
      highlights: ['Key achievement or responsibility description.']
    };
    setFormData(prev => ({ ...prev, experience: [newExp, ...prev.experience] }));
  };

  const handleRemoveExperience = (expIdx) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, idx) => idx !== expIdx)
    }));
  };

  // Key Projects Handlers
  const handleAddProject = () => {
    const newProj = {
      title: 'New Enterprise System',
      client: 'Internal Platform / Client',
      description: 'High-throughput system architecture description.',
      tags: ['Java', 'Microservices', 'Redis'],
      metrics: ['Reduced latency by 30%.', 'Achieved 99.99% uptime under peak traffic.']
    };
    setFormData(prev => ({ ...prev, keyProjects: [newProj, ...prev.keyProjects] }));
  };

  const handleRemoveProject = (projIdx) => {
    setFormData(prev => ({
      ...prev,
      keyProjects: prev.keyProjects.filter((_, idx) => idx !== projIdx)
    }));
  };

  // Personal Projects Handlers
  const handleAddPersonalProject = () => {
    const newPersonalProj = {
      name: 'New Personal Project',
      tagline: 'Open source system / tool description',
      github: 'https://github.com/rkraj-portfolio',
      tech: ['Java', 'Spring Boot', 'React'],
      features: ['Feature 1: Scalable authentication and session lifecycle.']
    };
    setFormData(prev => ({ ...prev, personalProjects: [newPersonalProj, ...prev.personalProjects] }));
  };

  const handleRemovePersonalProject = (pProjIdx) => {
    setFormData(prev => ({
      ...prev,
      personalProjects: prev.personalProjects.filter((_, idx) => idx !== pProjIdx)
    }));
  };

  // Custom Section Handlers
  const handleAddCustomSection = () => {
    const newSec = {
      id: 'sec_' + Date.now(),
      title: 'New Custom Section',
      subtitle: 'Section Description',
      icon: '💡',
      items: [
        {
          title: 'Sample Item Title',
          subtitle: 'Subheading / Date',
          description: 'Add detailed description or notes here.',
          tags: ['Tag1', 'Tag2']
        }
      ]
    };
    setFormData(prev => ({
      ...prev,
      customSections: [...prev.customSections, newSec]
    }));
  };

  const handleRemoveCustomSection = (secIdx) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections.filter((_, idx) => idx !== secIdx)
    }));
  };

  const handleAddCustomItem = (secIdx) => {
    const updated = [...formData.customSections];
    updated[secIdx].items.push({
      title: 'New Card Item',
      subtitle: 'Subheading',
      description: 'Enter item description.',
      tags: ['Tag']
    });
    setFormData(prev => ({ ...prev, customSections: updated }));
  };

  const handleRemoveCustomItem = (secIdx, itemIdx) => {
    const updated = [...formData.customSections];
    updated[secIdx].items = updated[secIdx].items.filter((_, idx) => idx !== itemIdx);
    setFormData(prev => ({ ...prev, customSections: updated }));
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "portfolio_config.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Render Lock Screen if not authenticated via Bcrypt Password
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#090d16] flex items-center justify-center p-4 font-sans">
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="bg-[#111827] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 mb-2">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Admin Dashboard Protected</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Enter your password to access analytics & content management. Password verification is encrypted & processed via <code className="text-sky-400 font-mono">bcrypt</code>.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-200 text-xs text-center font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Admin Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  autoFocus
                  placeholder="Enter admin password..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-[#090d16] border border-white/10 rounded-xl pl-4 pr-10 py-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 outline-none font-mono"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 p-1 rounded-lg transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 transition"
              >
                Back to Site
              </button>
              <button 
                type="submit"
                disabled={isVerifyingLogin}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition active:scale-95 disabled:opacity-50"
              >
                {isVerifyingLogin ? 'Verifying Bcrypt...' : 'Unlock Dashboard 🔓'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#090d16] overflow-y-auto text-gray-100 flex flex-col font-sans">
      
      {/* Admin Top Header */}
      <div className="bg-[#111827] border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={onClose}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono transition text-gray-300"
            title="Back to Live Portfolio"
          >
            <ArrowLeft size={16} /> 
            <span className="hidden sm:inline">Back to Live Portfolio</span>
            <span className="sm:hidden">Portfolio</span>
          </button>
          <div className="h-5 w-px bg-white/10 hidden sm:block" />
          <h1 className="text-sm sm:text-lg font-bold flex items-center gap-2">
            <span>⚙️ <span className="hidden xs:inline">Admin Dashboard</span></span>
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <label className="flex items-center gap-1 text-[11px] sm:text-xs text-sky-400 font-mono bg-sky-500/10 px-2 sm:px-2.5 py-1.5 rounded-lg border border-sky-500/20 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={pushToGit} 
              onChange={(e) => setPushToGit(e.target.checked)} 
              className="rounded accent-sky-500"
            />
            <span>Auto-Push</span>
          </label>
          
          <button 
            onClick={exportJSON}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] sm:text-xs font-medium border border-white/10 transition"
            title="Download JSON Config"
          >
            <Download size={14} /> 
            <span className="hidden md:inline">Export JSON</span>
          </button>
          
          <button 
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px] sm:text-xs font-medium border border-rose-500/20 transition"
            title="Reset to Defaults"
          >
            <RotateCcw size={14} /> 
            <span className="hidden md:inline">Reset</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-gray-500/10 hover:bg-gray-500/20 text-gray-300 text-[11px] sm:text-xs font-medium border border-gray-500/20 transition"
            title="Lock Dashboard & Logout"
          >
            <span>🔒</span> 
            <span className="hidden lg:inline">Logout</span>
          </button>
          
          <button 
            onClick={openSaveModal}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-[11px] sm:text-xs shadow-lg shadow-indigo-500/25 transition active:scale-95"
          >
            {savedSuccess ? <Check size={16} className="text-emerald-300" /> : <Save size={16} />}
            <span>{savedSuccess ? "Saved!" : "Apply"}</span>
          </button>
        </div>
      </div>

      {/* Glassmorphic Floating Notification Banner */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className={`px-5 py-3.5 rounded-2xl backdrop-blur-xl border shadow-2xl flex items-center gap-3 text-xs font-semibold ${
            notification.type === 'success' 
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200 shadow-emerald-900/40' 
              : 'bg-rose-950/80 border-rose-500/40 text-rose-200 shadow-rose-900/40'
          }`}>
            <span className="text-base">{notification.type === 'success' ? '✨' : '🔒'}</span>
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-3 text-gray-400 hover:text-white font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Security Verification Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-indigo-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🔒 Security Verification</span>
              </h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Please enter your <code className="text-sky-400 font-mono">ADMIN_PASSWORD</code> to authorize & apply changes live to your portfolio.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Admin Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    autoFocus
                    placeholder="Enter admin password..."
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-[#090d16] border border-indigo-500/40 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:border-indigo-400 outline-none font-mono"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 p-1 rounded-lg transition"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Confirm & Apply</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-6xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-3 space-y-2">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${activeTab === 'analytics' ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/30' : 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20'}`}
          >
            <BarChart2 size={16} /> Traffic & Audio Analytics
          </button>
          <button 
            onClick={() => setActiveTab('comments')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition ${activeTab === 'comments' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={16} /> Visitor Messages
            </div>
            {comments.length > 0 && (
              <span className="bg-sky-500 text-white font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                {comments.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('personal')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${activeTab === 'personal' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
          >
            <User size={16} /> Personal Info & Stats
          </button>
          <button 
            onClick={() => setActiveTab('experience')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${activeTab === 'experience' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
          >
            <Briefcase size={16} /> Work Experience
          </button>
          <button 
            onClick={() => setActiveTab('companyProjects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${activeTab === 'companyProjects' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
          >
            <FolderGit2 size={16} /> Company Projects ({formData.keyProjects.length})
          </button>
          <button 
            onClick={() => setActiveTab('personalProjects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${activeTab === 'personalProjects' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
          >
            <Code2 size={16} /> Personal Projects ({formData.personalProjects.length})
          </button>
          <button 
            onClick={() => setActiveTab('skills')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${activeTab === 'skills' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
          >
            <Layers size={16} /> Skills Matrix
          </button>
          <button 
            onClick={() => setActiveTab('achievements')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${activeTab === 'achievements' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
          >
            <Award size={16} /> Honors & Education
          </button>
          <button 
            onClick={() => setActiveTab('custom')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${activeTab === 'custom' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}
          >
            <Layers size={16} /> Custom Sections ({formData.customSections.length})
          </button>
        </div>

        {/* Content Form Area */}
        <div className="md:col-span-9 bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-2xl">
          
          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <BarChart2 className="text-sky-400" size={18} /> Portfolio Traffic & Engagement Metrics
                  </h2>
                  <p className="text-xs text-gray-400">Live stats of visitor traffic and audio intro plays</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-3 py-1 rounded-full border ${
                    metrics.isKvConfigured 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {metrics.isKvConfigured ? '⚡ Redis KV Connected' : '📁 Local Storage Mode'}
                  </span>
                  <span className="text-[10px] font-mono bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full border border-sky-500/20 animate-pulse">
                    ● Realtime
                  </span>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#090d16] border border-sky-500/30 rounded-2xl p-5 space-y-2 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-sky-400 group-hover:scale-110 transition">
                    <Users size={64} />
                  </div>
                  <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold">
                    <Users size={16} /> Total Page Views
                  </div>
                  <div className="text-3xl font-black font-mono text-white">
                    {metrics.pageViews || 0}
                  </div>
                  <p className="text-[11px] text-gray-400">Total portfolio impressions recorded</p>
                </div>

                <div className="bg-[#090d16] border border-indigo-500/30 rounded-2xl p-5 space-y-2 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-400 group-hover:scale-110 transition">
                    <Headphones size={64} />
                  </div>
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                    <Headphones size={16} /> Audio Intro Listens
                  </div>
                  <div className="text-3xl font-black font-mono text-white">
                    {metrics.audioListens || 0}
                  </div>
                  <p className="text-[11px] text-gray-400">Visitors who played your voice intro</p>
                </div>

                <div className="bg-[#090d16] border border-emerald-500/30 rounded-2xl p-5 space-y-2 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-400 group-hover:scale-110 transition">
                    <Sparkles size={64} />
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                    <Sparkles size={16} /> Full Audio Completions
                  </div>
                  <div className="text-3xl font-black font-mono text-white">
                    {metrics.audioCompletions || 0}
                  </div>
                  <p className="text-[11px] text-gray-400">Visitors who listened to 100% of recording</p>
                </div>
              </div>

              {/* Conversion Insight Card */}
              <div className="p-4 bg-gradient-to-r from-sky-950/40 via-indigo-950/40 to-purple-950/40 border border-sky-500/20 rounded-2xl space-y-2">
                <h3 className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                  <Sparkles size={14} /> Engagement Rate Breakdown
                </h3>
                <p className="text-xs text-gray-300">
                  <strong className="text-white font-mono">
                    {metrics.pageViews > 0 ? ((metrics.audioListens / metrics.pageViews) * 100).toFixed(1) : 0}%
                  </strong> of visitors click to hear your audio introduction, and{' '}
                  <strong className="text-white font-mono">
                    {metrics.audioListens > 0 ? ((metrics.audioCompletions / metrics.audioListens) * 100).toFixed(1) : 0}%
                  </strong> of those listeners listen all the way to the end!
                </p>
              </div>
            </div>
          )}

          {/* COMMENTS & FEEDBACK TAB */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="text-sky-400" size={18} /> Visitor Messages & Connection Requests ({comments.length})
                  </h2>
                  <p className="text-xs text-gray-400">Stored in <code className="text-sky-400 font-mono">src/comments.js</code> & persistent storage</p>
                </div>
              </div>

              {comments.length === 0 ? (
                <div className="text-center py-12 bg-[#090d16] border border-white/10 rounded-2xl space-y-2">
                  <p className="text-xs text-gray-400">No visitor messages or feedback submitted yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-[#090d16] border border-white/10 rounded-2xl space-y-2 relative group hover:border-sky-500/30 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white">{comment.name}</span>
                          {comment.email && (
                            <a href={`mailto:${comment.email}`} className="text-[11px] text-sky-400 font-mono hover:underline">
                              &lt;{comment.email}&gt;
                            </a>
                          )}
                          {comment.linkedin && (
                            <a href={comment.linkedin} target="_blank" rel="noreferrer" className="text-[10px] bg-sky-500/10 text-sky-300 px-2 py-0.5 rounded-md border border-sky-500/20 font-mono hover:underline flex items-center gap-1">
                              <span>in</span> LinkedIn Profile
                            </a>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase ${
                            comment.type === 'connect' 
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' 
                              : comment.type === 'feedback'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                          }`}>
                            {comment.type}
                          </span>
                          {comment.isTop && (
                            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30 font-bold flex items-center gap-1">
                              ⭐ Top Featured Comment
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch('/api/comments', {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id: comment.id, isTop: !comment.isTop })
                                });
                                const d = await res.json();
                                if (d.comments) setComments(d.comments);
                              } catch (e) {}
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                              comment.isTop 
                                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40' 
                                : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10'
                            }`}
                          >
                            <span>{comment.isTop ? '⭐ Featured on Main Page' : '📌 Mark as Top Comment'}</span>
                          </button>

                          <button
                            onClick={async () => {
                              if (window.confirm("Are you sure you want to delete this visitor message?")) {
                                try {
                                  const res = await fetch(`/api/comments?id=${comment.id}`, {
                                    method: 'DELETE'
                                  });
                                  const d = await res.json();
                                  if (d.comments) setComments(d.comments);
                                } catch (e) {}
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition flex items-center gap-1"
                            title="Delete Message"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed bg-[#111827] p-3 rounded-xl border border-white/5 whitespace-pre-wrap">
                        {comment.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* PERSONAL TAB */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">Edit Personal Details</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.personal.name} 
                    onChange={handlePersonalChange}
                    className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Professional Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={formData.personal.title} 
                    onChange={handlePersonalChange}
                    className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.personal.email} 
                    onChange={handlePersonalChange}
                    className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Phone</label>
                  <input 
                    type="text" 
                    name="phone" 
                    value={formData.personal.phone} 
                    onChange={handlePersonalChange}
                    className="w-full bg-[#090d16] border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Professional Summary</label>
                <textarea 
                  rows={4}
                  value={formData.summary} 
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full bg-[#090d16] border border-white/10 rounded-xl p-3 text-xs focus:border-indigo-500 outline-none leading-relaxed"
                />
              </div>

              {/* Upload Profile Picture section */}
              <div className="p-4 bg-sky-950/30 border border-sky-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-sky-300">Upload New Profile Photo</label>
                  <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-md">Optional</span>
                </div>
                <p className="text-[11px] text-gray-400">Optionally select a new image (JPG/PNG) to update your hero headshot (<code className="text-sky-400">public/avatar.jpg</code>). Leave empty to keep existing photo.</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarUpload}
                  className="block w-full text-xs text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
                />
                {avatarFileName && (
                  <p className="text-xs text-emerald-400 font-mono flex items-center gap-1 mt-1">
                    <Check size={14} /> Selected: {avatarFileName} (Will update avatar image on save & push)
                  </p>
                )}
              </div>

              {/* Upload Resume PDF section */}
              <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-indigo-300">Upload New Resume PDF</label>
                  <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md">Optional</span>
                </div>
                <p className="text-[11px] text-gray-400">Optionally select a new PDF file to update <code className="text-indigo-400">public/Ravi_Raja_Resume.pdf</code>. Leave empty to keep existing resume.</p>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={handlePdfUpload}
                  className="block w-full text-xs text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />
                {pdfFileName && (
                  <p className="text-xs text-emerald-400 font-mono flex items-center gap-1 mt-1">
                    <Check size={14} /> Selected: {pdfFileName} (Will update PDF on save & push)
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-bold text-gray-300">Hero Metric Cards</h3>
                    <p className="text-[11px] text-gray-400">Manage key metrics displayed in hero section (Max 4 cards)</p>
                  </div>
                  {formData.personal.stats.length < 4 && (
                    <button 
                      onClick={handleAddStat}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition"
                    >
                      <Plus size={14} /> Add Metric Card ({formData.personal.stats.length}/4)
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.personal.stats.map((stat, idx) => (
                    <div key={idx} className="p-3.5 bg-[#090d16] border border-white/10 rounded-xl space-y-2 relative group">
                      <div className="flex items-center justify-between border-b border-white/5 pb-1">
                        <span className="text-[10px] font-mono text-sky-400">Card #{idx + 1}</span>
                        {formData.personal.stats.length > 1 && (
                          <button 
                            onClick={() => handleRemoveStat(idx)}
                            className="text-rose-400 hover:text-rose-300 p-0.5 text-[10px] flex items-center gap-0.5"
                            title="Delete Card"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-500 block">Value</label>
                          <input 
                            type="text" 
                            value={stat.value} 
                            onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                            className="w-full bg-[#111827] border border-white/10 rounded-md p-1.5 font-mono font-bold text-sky-400 text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 block">Label</label>
                          <input 
                            type="text" 
                            value={stat.label} 
                            onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                            className="w-full bg-[#111827] border border-white/10 rounded-md p-1.5 text-gray-300 text-xs outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* EXPERIENCE TAB */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-base font-bold text-white">Edit Work Experience</h2>
                <button 
                  onClick={handleAddExperience}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30"
                >
                  <Plus size={16} /> Add Experience
                </button>
              </div>
              
              {formData.experience.map((exp, idx) => (
                <div key={idx} className="p-4 bg-[#090d16] border border-white/10 rounded-xl space-y-4 relative group">
                  <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                    <span className="text-xs font-mono font-bold text-sky-400">Experience #{idx + 1}</span>
                    <button 
                      onClick={() => handleRemoveExperience(idx)}
                      className="p-1 text-rose-400 hover:bg-rose-500/10 rounded text-xs flex items-center gap-1"
                      title="Delete Experience"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Company</label>
                      <input 
                        type="text" 
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...formData.experience];
                          updated[idx].company = e.target.value;
                          setFormData(prev => ({ ...prev, experience: updated }));
                        }}
                        className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Role</label>
                      <input 
                        type="text" 
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...formData.experience];
                          updated[idx].role = e.target.value;
                          setFormData(prev => ({ ...prev, experience: updated }));
                        }}
                        className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Period</label>
                      <input 
                        type="text" 
                        value={exp.period}
                        onChange={(e) => {
                          const updated = [...formData.experience];
                          updated[idx].period = e.target.value;
                          setFormData(prev => ({ ...prev, experience: updated }));
                        }}
                        className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Tech Stack (Comma separated)</label>
                    <input 
                      type="text" 
                      value={exp.techStack ? exp.techStack.join(', ') : ''}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].techStack = e.target.value.split(',').map(s => s.trim());
                        setFormData(prev => ({ ...prev, experience: updated }));
                      }}
                      className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs text-indigo-300 font-mono mb-3"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Key Highlights (One per line)</label>
                    <textarea 
                      rows={4}
                      value={exp.highlights.join('\n')}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].highlights = e.target.value.split('\n');
                        setFormData(prev => ({ ...prev, experience: updated }));
                      }}
                      className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* COMPANY PROJECTS TAB */}
          {activeTab === 'companyProjects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white">Company / Enterprise Projects</h2>
                  <p className="text-xs text-gray-400">High-scale client projects delivered during work experience</p>
                </div>
                <button 
                  onClick={handleAddProject}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition shadow-lg shadow-sky-600/30"
                >
                  <Plus size={16} /> Add Company Project
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.keyProjects.map((proj, idx) => (
                  <div key={idx} className="p-4 bg-[#090d16] border border-white/10 rounded-xl space-y-3 relative group">
                    <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <span className="text-xs font-mono font-bold text-sky-400">Company Project #{idx + 1}</span>
                      <button 
                        onClick={() => handleRemoveProject(idx)}
                        className="p-1 text-rose-400 hover:bg-rose-500/10 rounded text-xs flex items-center gap-1"
                        title="Delete Project"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Title</label>
                        <input 
                          type="text" 
                          value={proj.title}
                          onChange={(e) => {
                            const updated = [...formData.keyProjects];
                            updated[idx].title = e.target.value;
                            setFormData(prev => ({ ...prev, keyProjects: updated }));
                          }}
                          className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Client / Company</label>
                        <input 
                          type="text" 
                          value={proj.client}
                          onChange={(e) => {
                            const updated = [...formData.keyProjects];
                            updated[idx].client = e.target.value;
                            setFormData(prev => ({ ...prev, keyProjects: updated }));
                          }}
                          className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs text-sky-300 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Description</label>
                      <input 
                        type="text" 
                        value={proj.description}
                        onChange={(e) => {
                          const updated = [...formData.keyProjects];
                          updated[idx].description = e.target.value;
                          setFormData(prev => ({ ...prev, keyProjects: updated }));
                        }}
                        className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Tags (Comma separated)</label>
                      <input 
                        type="text" 
                        value={proj.tags ? proj.tags.join(', ') : ''}
                        onChange={(e) => {
                          const updated = [...formData.keyProjects];
                          updated[idx].tags = e.target.value.split(',').map(s => s.trim());
                          setFormData(prev => ({ ...prev, keyProjects: updated }));
                        }}
                        className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs font-mono text-gray-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Key Impact Metrics (One per line)</label>
                      <textarea 
                        rows={3}
                        value={proj.metrics ? proj.metrics.join('\n') : ''}
                        onChange={(e) => {
                          const updated = [...formData.keyProjects];
                          updated[idx].metrics = e.target.value.split('\n');
                          setFormData(prev => ({ ...prev, keyProjects: updated }));
                        }}
                        className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PERSONAL PROJECTS TAB */}
          {activeTab === 'personalProjects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white">Personal & Open Source Projects</h2>
                  <p className="text-xs text-gray-400">Independent projects, open-source tools & GitHub repositories</p>
                </div>
                <button 
                  onClick={handleAddPersonalProject}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30"
                >
                  <Plus size={16} /> Add Personal Project
                </button>
              </div>

              <div className="space-y-4">
                {formData.personalProjects.map((pProj, idx) => (
                  <div key={idx} className="p-4 bg-[#090d16] border border-indigo-500/20 rounded-xl space-y-3 relative group">
                    <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <span className="text-xs font-mono font-bold text-indigo-400">Personal Project #{idx + 1}</span>
                      <button 
                        onClick={() => handleRemovePersonalProject(idx)}
                        className="p-1 text-rose-400 hover:bg-rose-500/10 rounded text-xs flex items-center gap-1"
                        title="Delete Personal Project"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Project Name</label>
                        <input 
                          type="text" 
                          value={pProj.name}
                          onChange={(e) => {
                            const updated = [...formData.personalProjects];
                            updated[idx].name = e.target.value;
                            setFormData(prev => ({ ...prev, personalProjects: updated }));
                          }}
                          className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">GitHub Link</label>
                        <input 
                          type="text" 
                          value={pProj.github || ''}
                          onChange={(e) => {
                            const updated = [...formData.personalProjects];
                            updated[idx].github = e.target.value;
                            setFormData(prev => ({ ...prev, personalProjects: updated }));
                          }}
                          className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs text-sky-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-emerald-400 font-semibold block mb-1">Live Demo URL</label>
                        <input 
                          type="text" 
                          value={pProj.demo || ''}
                          placeholder="https://..."
                          onChange={(e) => {
                            const updated = [...formData.personalProjects];
                            updated[idx].demo = e.target.value;
                            setFormData(prev => ({ ...prev, personalProjects: updated }));
                          }}
                          className="w-full bg-[#111827] border border-emerald-500/30 rounded-lg p-2 text-xs text-emerald-300 focus:border-emerald-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Tagline</label>
                      <input 
                        type="text" 
                        value={pProj.tagline}
                        onChange={(e) => {
                          const updated = [...formData.personalProjects];
                          updated[idx].tagline = e.target.value;
                          setFormData(prev => ({ ...prev, personalProjects: updated }));
                        }}
                        className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Tech Stack (Comma separated)</label>
                      <input 
                        type="text" 
                        value={pProj.tech ? pProj.tech.join(', ') : ''}
                        onChange={(e) => {
                          const updated = [...formData.personalProjects];
                          updated[idx].tech = e.target.value.split(',').map(s => s.trim());
                          setFormData(prev => ({ ...prev, personalProjects: updated }));
                        }}
                        className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs font-mono text-gray-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Key Features (One per line)</label>
                      <textarea 
                        rows={3}
                        value={pProj.features ? pProj.features.join('\n') : ''}
                        onChange={(e) => {
                          const updated = [...formData.personalProjects];
                          updated[idx].features = e.target.value.split('\n');
                          setFormData(prev => ({ ...prev, personalProjects: updated }));
                        }}
                        className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs leading-relaxed mb-3"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-sky-400 font-semibold block mb-1">⚡ Key Engineering Takeaways & Learnings</label>
                      <textarea 
                        rows={2}
                        value={pProj.learning || ''}
                        onChange={(e) => {
                          const updated = [...formData.personalProjects];
                          updated[idx].learning = e.target.value;
                          setFormData(prev => ({ ...prev, personalProjects: updated }));
                        }}
                        placeholder="Describe key architectural takeaways & learnings..."
                        className="w-full bg-[#111827] border border-sky-500/30 rounded-lg p-2 text-xs text-sky-200 leading-relaxed outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">Edit Skills Matrix</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.skills.map((group, idx) => (
                  <div key={idx} className="p-4 bg-[#090d16] border border-white/10 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold text-indigo-400">{group.category}</h3>
                    <div>
                      <label className="text-[10px] text-gray-500 block mb-1">Items (Comma separated)</label>
                      <input 
                        type="text" 
                        value={group.items.join(', ')}
                        onChange={(e) => {
                          const updated = [...formData.skills];
                          updated[idx].items = e.target.value.split(',').map(s => s.trim());
                          setFormData(prev => ({ ...prev, skills: updated }));
                        }}
                        className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">Edit Honors & Education</h2>
              
              <div className="space-y-4">
                {formData.achievements.map((ach, idx) => (
                  <div key={idx} className="p-4 bg-[#090d16] border border-white/10 rounded-xl space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Award Title</label>
                        <input 
                          type="text" 
                          value={ach.title}
                          onChange={(e) => {
                            const updated = [...formData.achievements];
                            updated[idx].title = e.target.value;
                            setFormData(prev => ({ ...prev, achievements: updated }));
                          }}
                          className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Date</label>
                        <input 
                          type="text" 
                          value={ach.date}
                          onChange={(e) => {
                            const updated = [...formData.achievements];
                            updated[idx].date = e.target.value;
                            setFormData(prev => ({ ...prev, achievements: updated }));
                          }}
                          className="w-full bg-[#111827] border border-white/10 rounded-lg p-2 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-xs font-bold text-gray-300 mb-3">Education</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Institution</label>
                      <input 
                        type="text" 
                        value={formData.education.institution}
                        onChange={(e) => setFormData(prev => ({ ...prev, education: { ...prev.education, institution: e.target.value } }))}
                        className="w-full bg-[#090d16] border border-white/10 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">GPA</label>
                      <input 
                        type="text" 
                        value={formData.education.gpa}
                        onChange={(e) => setFormData(prev => ({ ...prev, education: { ...prev.education, gpa: e.target.value } }))}
                        className="w-full bg-[#090d16] border border-white/10 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOM SECTIONS TAB */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white">Add & Edit Custom Sections</h2>
                  <p className="text-xs text-gray-400">Create new dynamic sections for Certifications, Publications, Speaking, etc.</p>
                </div>
                <button 
                  onClick={handleAddCustomSection}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-lg shadow-emerald-600/30"
                >
                  <Plus size={16} /> Add New Section
                </button>
              </div>

              {formData.customSections.length === 0 ? (
                <div className="p-8 text-center bg-[#090d16] border border-white/5 rounded-2xl">
                  <Sparkles size={32} className="text-gray-500 mx-auto mb-3" />
                  <p className="text-xs text-gray-400">No custom sections added yet.</p>
                  <button 
                    onClick={handleAddCustomSection}
                    className="mt-3 text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    + Create your first custom section
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {formData.customSections.map((sec, secIdx) => (
                    <div key={sec.id || secIdx} className="p-5 bg-[#090d16] border border-emerald-500/20 rounded-2xl space-y-4">
                      
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-3 flex-1 mr-4">
                          <input 
                            type="text" 
                            value={sec.icon}
                            onChange={(e) => {
                              const updated = [...formData.customSections];
                              updated[secIdx].icon = e.target.value;
                              setFormData(prev => ({ ...prev, customSections: updated }));
                            }}
                            className="w-10 text-center bg-[#111827] border border-white/10 rounded-lg py-1 text-sm"
                            title="Emoji Icon"
                          />
                          <input 
                            type="text" 
                            value={sec.title}
                            onChange={(e) => {
                              const updated = [...formData.customSections];
                              updated[secIdx].title = e.target.value;
                              setFormData(prev => ({ ...prev, customSections: updated }));
                            }}
                            className="flex-1 bg-[#111827] border border-white/10 rounded-lg px-3 py-1 text-xs font-bold text-white"
                            placeholder="Section Title"
                          />
                        </div>
                        <button 
                          onClick={() => handleRemoveCustomSection(secIdx)}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                          title="Delete Section"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Section Subtitle</label>
                        <input 
                          type="text" 
                          value={sec.subtitle}
                          onChange={(e) => {
                            const updated = [...formData.customSections];
                            updated[secIdx].subtitle = e.target.value;
                            setFormData(prev => ({ ...prev, customSections: updated }));
                          }}
                          className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300"
                        />
                      </div>

                      {/* Items under this custom section */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-400">Card Items ({sec.items.length})</span>
                          <button 
                            onClick={() => handleAddCustomItem(secIdx)}
                            className="text-[11px] font-semibold text-sky-400 hover:underline flex items-center gap-1"
                          >
                            <Plus size={12} /> Add Item Card
                          </button>
                        </div>

                        {sec.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="p-3 bg-[#111827] border border-white/5 rounded-xl space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <input 
                                type="text" 
                                value={item.title}
                                onChange={(e) => {
                                  const updated = [...formData.customSections];
                                  updated[secIdx].items[itemIdx].title = e.target.value;
                                  setFormData(prev => ({ ...prev, customSections: updated }));
                                }}
                                className="flex-1 bg-[#090d16] border border-white/10 rounded px-2 py-1 text-xs font-semibold text-white"
                                placeholder="Item Title"
                              />
                              <button 
                                onClick={() => handleRemoveCustomItem(secIdx, itemIdx)}
                                className="p-1 text-rose-400 hover:bg-rose-500/10 rounded"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <input 
                                type="text" 
                                value={item.subtitle}
                                onChange={(e) => {
                                  const updated = [...formData.customSections];
                                  updated[secIdx].items[itemIdx].subtitle = e.target.value;
                                  setFormData(prev => ({ ...prev, customSections: updated }));
                                }}
                                className="bg-[#090d16] border border-white/10 rounded px-2 py-1 text-xs text-sky-300"
                                placeholder="Subtitle / Date"
                              />
                              <input 
                                type="text" 
                                value={item.tags ? item.tags.join(', ') : ''}
                                onChange={(e) => {
                                  const updated = [...formData.customSections];
                                  updated[secIdx].items[itemIdx].tags = e.target.value.split(',').map(s => s.trim());
                                  setFormData(prev => ({ ...prev, customSections: updated }));
                                }}
                                className="bg-[#090d16] border border-white/10 rounded px-2 py-1 text-xs text-gray-400"
                                placeholder="Tags (comma separated)"
                              />
                            </div>

                            <textarea 
                              rows={2}
                              value={item.description}
                              onChange={(e) => {
                                const updated = [...formData.customSections];
                                updated[secIdx].items[itemIdx].description = e.target.value;
                                setFormData(prev => ({ ...prev, customSections: updated }));
                              }}
                              className="w-full bg-[#090d16] border border-white/10 rounded px-2 py-1 text-xs text-gray-300"
                              placeholder="Description..."
                            />
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
