import React, { useState } from 'react';
import { Send, MessageSquare, Sparkles, CheckCircle2, User, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactFeedbackSection({ personal }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin: '',
    type: 'connect',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { success: boolean, message: string }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      setStatus({ success: false, message: 'Please write a message before submitting.' });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const payload = {
        ...formData,
        linkedin: formData.linkedin.trim() 
          ? (formData.linkedin.startsWith('http') ? formData.linkedin.trim() : `https://linkedin.com/in/${formData.linkedin.trim()}`) 
          : ''
      };

      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ success: true, message: '✨ Thank you! Your message/feedback has been sent successfully.' });
        setFormData({ name: '', email: '', linkedin: '', type: 'connect', message: '' });
      } else {
        setStatus({ success: false, message: data.error || 'Failed to submit. Please try again.' });
      }
    } catch (err) {
      console.error('Submit error:', err);
      setStatus({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 relative z-10 border-t border-white/10">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono">
            <Sparkles size={14} className="text-amber-400" />
            <span>Connect & Feedback Studio</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Let's Build Together or Share Feedback
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Interested in discussing backend architecture, SSE opportunities, or leaving feedback? Feel free to drop your message and LinkedIn profile below so we can connect!
          </p>
        </div>

        {/* Glassmorphic Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {status && (
            <div className={`mb-6 p-4 rounded-2xl border text-xs flex items-center gap-3 ${
              status.success 
                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-950/60 border-rose-500/30 text-rose-300'
            }`}>
              {status.success ? <CheckCircle2 size={18} className="shrink-0" /> : <MessageSquare size={18} className="shrink-0" />}
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <User size={14} className="text-sky-400" /> Your Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#090d16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-sky-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Mail size={14} className="text-sky-400" /> Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="e.g. alex@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-[#090d16] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-sky-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <span className="text-sky-400 font-bold text-xs">in</span> LinkedIn Username <span className="text-[10px] text-gray-500">(Optional)</span>
                </label>
                <div className="flex items-center w-full bg-[#090d16] border border-white/10 rounded-xl overflow-hidden focus-within:border-sky-500 transition">
                  <span className="bg-white/5 px-3 py-3 text-[11px] font-mono text-gray-400 border-r border-white/10 shrink-0 select-none">
                    linkedin.com/in/
                  </span>
                  <input 
                    type="text" 
                    placeholder="username"
                    value={formData.linkedin}
                    onChange={(e) => {
                      let val = e.target.value.trim();
                      // Strip full URL if user pastes a full URL like https://linkedin.com/in/username
                      val = val.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, '');
                      val = val.replace(/^\/|\/$/g, '');
                      setFormData(prev => ({ ...prev, linkedin: val }));
                    }}
                    className="w-full bg-transparent px-3 py-3 text-xs text-white placeholder-gray-600 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">Subject / Purpose</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'connect' }))}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition ${
                    formData.type === 'connect' 
                      ? 'bg-sky-600 text-white border-sky-500 shadow-lg shadow-sky-600/25' 
                      : 'bg-[#090d16] border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  🤝 Connect / Hire
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'feedback' }))}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition ${
                    formData.type === 'feedback' 
                      ? 'bg-sky-600 text-white border-sky-500 shadow-lg shadow-sky-600/25' 
                      : 'bg-[#090d16] border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  💡 Portfolio Feedback
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'general' }))}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition ${
                    formData.type === 'general' 
                      ? 'bg-sky-600 text-white border-sky-500 shadow-lg shadow-sky-600/25' 
                      : 'bg-[#090d16] border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  💬 General Inquiry
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Your Message</label>
              <textarea 
                rows={4}
                required
                placeholder="Share your thoughts, project ideas, feedback, or role details..."
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full bg-[#090d16] border border-white/10 rounded-xl p-4 text-xs text-white placeholder-gray-500 focus:border-sky-500 outline-none leading-relaxed transition"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-gray-400">Direct Email: <a href={`mailto:${personal.email}`} className="text-sky-400 hover:underline">{personal.email}</a></span>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-500/25 transition active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send size={14} /> Send Message
                  </>
                )}
              </button>
            </div>
          </form>

        </motion.div>
      </div>
    </section>
  );
}
