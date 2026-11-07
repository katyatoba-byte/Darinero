import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useContent } from '../content';

const SeasonalBanner = () => {
  const { settings } = useContent();
  if (!settings.bannerEnabled || !settings.bannerText) return null;
  const link = settings.bannerLink || '/katalozi';
  return (
    <div className="bg-navy text-white border-t border-copper/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="flex items-center gap-3 text-center md:text-left">
          <Sparkles size={20} className="text-copper shrink-0" />
          <span className="font-light">{settings.bannerText}</span>
        </p>
        {settings.bannerButton && (
          <Link to={link} className="btn-premium bg-copper text-white hover:bg-offwhite hover:text-navy whitespace-nowrap text-xs">
            {settings.bannerButton} →
          </Link>
        )}
      </div>
    </div>
  );
};

export default SeasonalBanner;
