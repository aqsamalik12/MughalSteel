import React from 'react';

export const ArchitecturalAuthBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#070D18]">
      {/* Subtle Architectural Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(212, 175, 55, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(212, 175, 55, 0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Solid Luxury Radial Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top and Bottom Solid Edge Accents */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
    </div>
  );
};
