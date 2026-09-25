import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="w-20 h-20 rounded-3xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-black text-4xl mb-6 shadow-2xl shadow-brand-500/10">
        404
      </div>
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Page Not Found</h1>
      <p className="text-slate-400 max-w-md mb-8 text-sm sm:text-base">
        The page you are looking for might have been moved, deleted, or is temporarily inaccessible.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-lg shadow-brand-600/30 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
