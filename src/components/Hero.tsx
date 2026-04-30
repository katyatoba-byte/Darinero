import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-[85vh] w-full flex items-center overflow-hidden bg-navy">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=2000" 
          alt="Premium corporate gift on dark background" 
          className="w-full h-full object-cover object-[70%_center] opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/40 to-transparent"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full pt-[60px] md:pt-[70px]">
        <div className="max-w-[1440px] mx-auto px-6 md:pl-20 lg:pl-32">
          <div className="max-w-[750px]">
            <h1 className="font-serif text-3xl md:text-[42px] lg:text-[52px] leading-[1.15] font-medium text-white mb-8">
              Корпоративни подаръци, които правят впечатление – без стрес и загуба на време
            </h1>
            <p className="font-sans text-base md:text-[18px] leading-[1.5] text-white/80 mb-8 font-light max-w-[600px]">
              Поемаме целия процес – от концепцията и подбора на продукти, през дизайна и персонализацията, до доставката.
            </p>
            <div>
              <Link 
                to="/categories" 
                className="inline-block bg-copper hover:bg-[#C19B2E] text-white font-semibold py-[16px] px-[40px] rounded-[8px] transition-all duration-300 shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] text-base md:text-lg uppercase tracking-widest"
              >
                Вижте коледните предложения
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
