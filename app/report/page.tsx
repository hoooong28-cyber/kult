'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { ArrowLeft, Coffee, Send, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ReportPage() {
  const [reportType, setReportType] = useState<'correction' | 'suggestion'>('correction');
  const [targetCafe, setTargetCafe] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      <Header />

      <main className="max-w-xl mx-auto px-4 py-12 flex-1 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-amber-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Cafes</span>
        </Link>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          {submitted ? (
            <div className="py-12 text-center flex flex-col items-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
              <h2 className="font-serif text-2xl font-bold text-stone-100 mb-2">Feedback Received!</h2>
              <p className="text-sm text-stone-300 max-w-sm mb-8">
                Thank you for contributing to the Seoul Expat Cafe directory. Our curator will verify your submission promptly.
              </p>
              <Link
                href="/"
                className="px-6 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-semibold text-xs shadow-md"
              >
                Return to Cafe List
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h1 className="font-serif text-2xl font-bold text-stone-100 flex items-center gap-2">
                  <Coffee className="w-6 h-6 text-amber-400" />
                  <span>Report Information or Suggest Spot</span>
                </h1>
                <p className="text-xs text-stone-400 mt-1">
                  Help keep Seoul Expat Cafes fresh. Submit information corrections or recommend new work & brunch spots.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReportType('correction')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                    reportType === 'correction'
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      : 'bg-stone-950 text-stone-400 border-stone-800'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Information Fix</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReportType('suggestion')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                    reportType === 'suggestion'
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      : 'bg-stone-950 text-stone-400 border-stone-800'
                  }`}
                >
                  <Coffee className="w-4 h-4" />
                  <span>New Cafe Suggestion</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Cafe Name & Neighborhood
                </label>
                <input
                  type="text"
                  value={targetCafe}
                  onChange={(e) => setTargetCafe(e.target.value)}
                  placeholder="e.g. Cuco (Seongsu) or New Cafe Name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Feedback Details & Curator Notes
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide updated hours, closed notice, or why this spot is great for expats..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Your Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="expat@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-amber-400 text-stone-950 hover:bg-amber-300 shadow-md transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Submit Feedback</span>
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
