import React, { useEffect, useState } from "react";

const TrailerModal = ({ videoKey, isOpen, onClose }) => {
  const [showModal, setShowModal] = useState(false);

  // Sync internal state with props for animation handling
  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      document.body.style.overflow = "hidden";
    } else {
      setShowModal(false);
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    // Backdrop (Darker and blurrier now to emphasize the glow)
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-500 ${
        showModal ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      {/* --- THE GLOW EFFECT --- */}
      {/* This div sits behind the modal and creates the diffuse light */}
      <div
        className={`absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] pointer-events-none transition-all duration-700 ease-out ${
          showModal
            ? "opacity-50 scale-100 blur-[150px]"
            : "opacity-0 scale-50 blur-[50px]"
        }`}
        style={{
          // You can change these RGB colors to match your brand (currently cyan -> purple)
          background:
            "radial-gradient(circle, rgba(6,182,212,0.8) 0%, rgba(124,58,237,0.5) 40%, rgba(0,0,0,0) 80%)",
        }}
      ></div>
      {/* ----------------------- */}

      {/* Modal Container (Added relative z-10 to sit on top of the glow) */}
      <div
        className={`relative z-10 w-full max-w-5xl p-1 mx-4 bg-[#1a1a1a] rounded-2xl shadow-2xl border border-white/10 ring-1 ring-white/5 transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${
          showModal
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-10"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Close Button Bar */}
        <div className="flex justify-between items-center mb-2 px-2 pt-2">
          <p className="text-gray-300 text-sm font-medium tracking-wider uppercase drop-shadow-sm">
            Official Trailer
          </p>
          <button
            onClick={onClose}
            className="group relative flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-300 group-hover:text-white transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Video Wrapper */}
        <div className="relative pt-[56.25%] w-full rounded-xl overflow-hidden bg-black shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] border border-white/5">
          {videoKey ? (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&fs=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            // Improved loading/error state aesthetic
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-gray-500 space-y-4 bg-[#0f0f0f]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 opacity-20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
              <p>Video unavailable</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
