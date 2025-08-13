"use client";

import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onViewAll?: () => void;
  showViewAll?: boolean;
}

export default function SectionHeader({ title, subtitle, onViewAll, showViewAll = true }: SectionHeaderProps) {
  console.log('SectionHeader rendered:', title);

  return (
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <div>
        <h2 className="text-2xl font-extrabold bg-wosolive-gradient bg-clip-text text-transparent" data-macaly="section-title">
          {title}
        </h2>
        {subtitle && (
          <p className="text-woso-purple-600 text-sm mt-1" data-macaly="section-subtitle">
            {subtitle}
          </p>
        )}
      </div>
      
      {showViewAll && onViewAll && (
        <button
          onClick={() => {
            console.log('View all clicked for:', title);
            onViewAll();
          }}
          className="flex items-center space-x-1 text-woso-purple hover:text-woso-orange transition-colors font-semibold text-sm"
        >
          <span>View All</span>
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}