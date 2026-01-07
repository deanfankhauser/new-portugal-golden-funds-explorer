import React from 'react';
import { Users, ArrowRight } from 'lucide-react';

const CommunityBanner: React.FC = () => {
  return (
    <a
      href="https://www.facebook.com/groups/portugalgoldenvisausa"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-br from-[#4B0F23] to-[#3a0b1b] rounded-xl p-8 max-w-[600px] w-full mx-auto shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 group"
    >
      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-7">
        {/* Icon */}
        <div className="flex-shrink-0 w-14 h-14 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center">
          <Users className="w-7 h-7 text-white/90" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#A97155] mb-1.5">
            Private Community
          </div>
          <div className="text-[17px] font-semibold text-white leading-snug mb-1">
            Portugal Golden Visa for Americans
          </div>
          <div className="text-sm text-white/65 leading-relaxed">
            Connect with US investors navigating the Golden Visa process.
          </div>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <span className="inline-flex items-center justify-center gap-2 bg-[#A97155] hover:bg-[#ba8266] text-white text-sm font-medium px-5 py-3 rounded-lg transition-colors w-full sm:w-auto whitespace-nowrap">
            Join Group
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </a>
  );
};

export default CommunityBanner;
