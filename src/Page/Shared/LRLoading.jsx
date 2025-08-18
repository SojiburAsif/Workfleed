// LRLoading.js
import React, { useContext } from "react";
import { ThemeContext } from '../../Theme/ThemeProvider';

const LRLoading = ({ text = "Processing..." }) => {
  const { theme } = useContext(ThemeContext);
  const textColor = theme === "dark" ? "text-white" : "text-gray-800";
  const bgColor = theme === "dark" ? "bg-gray-900/80" : "bg-white/80";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-50 flex items-center justify-center ${bgColor} backdrop-blur-sm`}
    >
      <div className={`flex flex-col items-center justify-center gap-3 p-6 rounded-lg shadow-lg ${textColor}`}>
        <div className="flex items-center gap-4">
          {/* Circular spinner */}
          <svg
            className="animate-spin h-10 w-10"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.15"></circle>
            <path d="M22 12a10 10 0 00-10-10" strokeOpacity="1"></path>
          </svg>

          {/* Bouncing dots */}
          <div className="flex items-end gap-2">
            <span className="lr-dot lr-dot-xs" />
            <span className="lr-dot lr-dot-sm" />
            <span className="lr-dot lr-dot-md" />
            <span className="lr-dot lr-dot-lg" />
            <span className="lr-dot lr-dot-xl" />
          </div>
        </div>

        <div className="text-sm font-medium">{text}</div>

        {/* Inline CSS for dots */}
        <style>{`
          .lr-dot {
            display: inline-block;
            border-radius: 9999px;
            background: currentColor;
            opacity: 0.6;
            transform: translateY(0);
            animation: lrDotBounce 1s infinite ease-in-out;
          }
          .lr-dot-xs { width: 6px; height: 6px; animation-delay: 0s; }
          .lr-dot-sm { width: 8px; height: 8px; animation-delay: 0.08s; }
          .lr-dot-md { width: 10px; height: 10px; animation-delay: 0.16s; }
          .lr-dot-lg { width: 12px; height: 12px; animation-delay: 0.24s; }
          .lr-dot-xl { width: 14px; height: 14px; animation-delay: 0.32s; }

          @keyframes lrDotBounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.45; }
            40% { transform: translateY(-8px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LRLoading;
