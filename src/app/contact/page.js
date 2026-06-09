'use client';

import React, { useState } from 'react';
import { trackContactFormStarted, trackContactFormSubmitted } from '@/utils/monitoring';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    
    // Trigger contact_form_started on first keystroke
    if (!started) {
      setStarted(true);
      trackContactFormStarted();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill out all fields.');
      return;
    }

    // Success flow
    setSubmitted(true);
    trackContactFormSubmitted();
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('General Inquiry');
    setMessage('');
    setStarted(false);
    setSubmitted(false);
  };

  return (
    <div className="flex-grow bg-brand-cream pb-20 page-switch-enter">
      {/* Page Header Banner */}
      <section
        className="relative w-full bg-brand-cream px-6 md:px-12 lg:px-24 xl:px-32 pt-16 pb-12"
        style={{
          backgroundImage: 'url(/images/5.avif)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-4xl mx-auto w-full text-center space-y-3">
          <h1 className="text-4xl font-extrabold font-display leading-snug text-brand-purple-dark">
            Get in Touch
          </h1>
          <p className="text-sm font-bold leading-relaxed text-brand-purple-dark/85 max-w-xl mx-auto">
            Have a question, feedback, or a partnership inquiry? We are here to listen and connect with the rare disease community.
          </p>
          <div className="w-16 h-1 bg-brand-purple rounded-full mt-4 mx-auto"></div>
        </div>
      </section>

      {/* Contact Form Container */}
      <div className="max-w-2xl mx-auto px-4 md:px-8 mt-10">
        <div className="glass-panel rounded-3xl p-8 border border-white/50 shadow-2xl relative overflow-hidden">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-xl font-black text-brand-purple-dark font-display border-b border-brand-purple/10 pb-3">
                Send Us a Message
              </h2>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <span>⚠️ {error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    data-clarity-mask="true"
                    value={name}
                    onChange={handleInputChange(setName)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/70 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition text-sm text-gray-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    data-clarity-mask="true"
                    value={email}
                    onChange={handleInputChange(setEmail)}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/70 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition text-sm text-gray-800 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={handleInputChange(setSubject)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/70 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition text-sm text-gray-750 font-semibold"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Support Request">Support / Feed Help</option>
                  <option value="Story Submission">Your Story Advocacy</option>
                  <option value="Partnership">Partnership Opportunities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  data-clarity-mask="true"
                  value={message}
                  onChange={handleInputChange(setMessage)}
                  rows={5}
                  placeholder="Tell us how we can help you or share your thoughts..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition text-sm text-gray-850 font-medium resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  data-cta="submit_contact_form"
                  className="w-full py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold rounded-full text-sm shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
                >
                  Submit Form
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-10 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
                ✓
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-brand-purple-dark font-display">Message Sent!</h2>
                <p className="text-sm font-semibold text-gray-600 leading-relaxed max-w-sm mx-auto">
                  Thank you for reaching out to Beyond Rare. Your voice matters, and we will get back to you as soon as possible.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-8 py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold rounded-full text-xs shadow-sm hover:shadow transition duration-200 cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
