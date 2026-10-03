import React from 'react';
import { useData } from '../../context/DataContext';
import { handleImageError, FALLBACK_IMAGE_URL } from '../../utils/imageFallback';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface LeadershipSectionProps {
  className?: string;
  isDarkTheme?: boolean;
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({ 
  className = '',
  isDarkTheme = true 
}) => {
  const { teamMembers } = useData();

  const sortedMembers = [...(teamMembers || [])]
    .filter(m => m.published !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <section className={`w-full py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[11px] font-heading font-black uppercase tracking-widest rounded-full shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
            <span>Executive Team &amp; Master Craftsmen</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-heading font-black text-stone-100 uppercase tracking-tight">
            Our Team!
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 font-sans leading-relaxed max-w-3xl mx-auto">
            The people at Mughal Steel Fabrication are a team of professionals with diverse backgrounds and unique talents. Even though each of us plays a unique function, we draw on our colleagues&apos; knowledge and experiences to create strategies and plans that can be put into practice. Our Executive Team invests consistently in the development of the employees to foster innovation and advancement to each degree.
          </p>
        </div>

        {/* Leadership Cards Grid (6 Professional Members in 3x2 Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sortedMembers.map((member, idx) => {
            const isOrange = idx % 2 === 0;
            return (
              <div 
                key={member.id}
                className="group relative bg-[#070D18] border border-brand-light/50 hover:border-brand-gold rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_10px_35px_rgba(204,160,75,0.2)] transition-all duration-500 flex flex-col justify-between card-interactive"
              >
                {/* Graphic Backdrop with Alternating Orange and Grey Box */}
                <div className="relative w-full aspect-[4/5] bg-gradient-to-b from-[#0B1426] to-[#040810] overflow-hidden flex items-end justify-center p-3 pt-6">
                  {/* Geometric Color Box Accent matching user screenshot */}
                  <div className={`absolute inset-x-6 top-8 bottom-0 rounded-t-2xl shadow-lg transition-transform duration-500 group-hover:scale-105 ${
                    isOrange 
                      ? 'bg-gradient-to-t from-orange-600 via-orange-500 to-amber-500' 
                      : 'bg-gradient-to-t from-stone-700 via-stone-600 to-slate-500'
                  }`} />
                  
                  {/* Secondary Glow */}
                  <div className={`absolute top-4 inset-x-10 h-20 blur-2xl pointer-events-none ${
                    isOrange ? 'bg-orange-500/25' : 'bg-slate-500/20'
                  }`} />

                  {/* Team Member Portrait Photo */}
                  <img 
                    src={member.image || FALLBACK_IMAGE_URL} 
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
                    className="relative z-10 w-full h-full object-cover object-top rounded-t-xl group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl" 
                  />

                  {/* Subtle Gradient Fog at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070D18] via-transparent to-transparent z-10 opacity-60" />
                  
                  {/* Verification Badge */}
                  <div className="absolute top-3 right-3 z-20 bg-black/75 backdrop-blur-md border border-brand-gold/40 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-brand-gold flex items-center gap-1 shadow">
                    <ShieldCheck className="w-3 h-3 text-brand-gold" />
                    <span>Verified Lead</span>
                  </div>
                </div>

              {/* Text Info - Name & Designation Only */}
              <div className="p-5 text-center flex-1 flex flex-col justify-center">
                <h3 className="font-heading font-black text-base sm:text-lg text-stone-100 uppercase tracking-wide group-hover:text-brand-gold transition-colors line-clamp-1">
                  {member.name}
                </h3>
                <p className="text-xs font-mono font-bold text-brand-gold tracking-wider uppercase mt-1">
                  {member.role}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      </div>
    </section>
  );
};
