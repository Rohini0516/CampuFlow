import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#FFF5F1] flex flex-col items-center justify-center p-6 text-center text-[#2D2526]">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#E27B88] to-[#F4A6A6] text-white flex items-center justify-center font-black text-4xl mb-6 shadow-xl shadow-[#F4A6A6]/30">
        404
      </div>
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-[#2D2526]">Page Not Found</h1>
      <p className="text-[#6F6264] max-w-md mb-8 text-sm sm:text-base font-medium">
        The page you are looking for might have been moved, deleted, or is temporarily inaccessible.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => window.history.back()}
          className="peach-button-secondary text-sm flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
        <Link
          to="/dashboard"
          className="peach-button-primary text-sm flex items-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
