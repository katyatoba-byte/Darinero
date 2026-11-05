import React from 'react';

// Shows the image, or an elegant branded panel when no photo has been added yet.
export default function CoverImage({ src, alt, label, className = '' }: { src?: string; alt: string; label?: string; className?: string }) {
  if (src) {
    return <img src={src} alt={alt} loading="lazy" className={`w-full h-full object-cover ${className}`} referrerPolicy="no-referrer" />;
  }
  return (
    <div className={`w-full h-full bg-navy flex items-center justify-center p-8 text-center ${className}`} role="img" aria-label={alt}>
      <span className="font-serif text-white/90 text-2xl leading-snug">
        {label || alt}<span className="text-copper">.</span>
      </span>
    </div>
  );
}
