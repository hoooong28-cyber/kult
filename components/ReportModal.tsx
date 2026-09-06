'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertTriangle, Coffee } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cafeName?: string;
}

export default function ReportModal({ isOpen, onClose, cafeName }: ReportModalProps) {
  const [reportType, setReportType] = useState<'correction' | 'suggestion'>('correction');
  const [targetCafe, setTargetCafe] = useState(cafeName || '');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate lightweight client submission feedback
    setSubmitted(true);
    setTimeout(() => {
      // reset after 2.5s
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl text-stone-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-3 animate-bounce" />
            <h3 className="font-serif text-xl font-bold text-stone-100 mb-1">Thank You!</h3>
            <p className="text-sm text-stone-300 max-w-xs mb-6">
              Your feedback has been received. Our curator will verify the details and update the list.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-amber-400 text-stone-950 font-semibold text-xs"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-amber-400" />
              <h3 className="font-serif text-lg font-bold text-stone-100">
                Submit Feedback / Suggestion
              </h3>
            </div>
            <p className="text-xs text-stone-400">
              Spotted wrong hours, closed spots, or want to recommend a great expat cafe in Seoul?
            </p>

            {/* Type selector */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReportType('correction')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                  reportType === 'correction'
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                    : 'bg-stone-950 text-stone-400 border-stone-800'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Info Correction</span>
              </button>
              <button
                type="button"
                onClick={() => setReportType('suggestion')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                  reportType === 'suggestion'
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                    : 'bg-stone-950 text-stone-400 border-stone-800'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>New Cafe Suggestion</span>
              </button>
            </div>

            {/* Cafe name input */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Cafe Name & Location
              </label>
              <input
                type="text"
                value={targetCafe}
                onChange={(e) => setTargetCafe(e.target.value)}
                placeholder="e.g. Cuco (Seongsu) or New Cafe Name"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Details message */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Feedback Details / Notes
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what needs updating (e.g. closed on Tuesdays, bad wifi, great power outlets)..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Your Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="expat@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-800 text-stone-300 hover:bg-stone-750"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-amber-400 text-stone-950 hover:bg-amber-300 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Curator</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
