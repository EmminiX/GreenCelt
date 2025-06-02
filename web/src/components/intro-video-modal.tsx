'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export function IntroVideoModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenIntro = localStorage.getItem('introVideoShown');
    
    if (!hasSeenIntro) {
      // Show the intro video modal with a slight delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Prevent scrolling when modal is open
        document.body.style.overflow = 'hidden';
      }, 500);
      
      // Mark that the intro video has been shown
      localStorage.setItem('introVideoShown', 'true');
      
      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setIsVisible(false);
    // Restore scrolling
    document.body.style.overflow = '';
    
    // Give time for the animation to complete before unmounting
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/85 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => {
        // Close when clicking outside the video
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="relative w-full max-w-[1200px] mx-auto aspect-video bg-black rounded-lg shadow-2xl">
        <button
          onClick={closeModal}
          className="absolute -top-10 -right-10 sm:right-0 sm:-top-9 z-[51] flex h-9 w-9 items-center justify-center rounded-full bg-destructive text-white hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Close introduction video"
        >
          <X className="h-5 w-5" />
        </button>
        
        <iframe
          src="https://www.youtube.com/embed/-foH3hFTvmc?autoplay=1&rel=0&fs=1"
          className="absolute inset-0 w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          title="GreenCeltAI Introduction Video"
        ></iframe>
      </div>
    </div>
  );
}

// Add keyboard event listener to close on Escape key
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.querySelector('[aria-label="Close introduction video"]');
      if (modal) {
        (modal as HTMLButtonElement).click();
      }
    }
  });
}
