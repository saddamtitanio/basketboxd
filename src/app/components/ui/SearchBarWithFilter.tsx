'use client';

import { Search, Filter } from 'lucide-react';

interface SearchBarWithFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
  showFilters: boolean;
  activeFilterCount: number;
  placeholder?: string;
}

export const SearchBarWithFilter: React.FC<SearchBarWithFilterProps> = ({
  searchQuery,
  onSearchChange,
  onFilterClick,
  showFilters,
  activeFilterCount,
  placeholder = "Search...",
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-bronze transition"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
      
      <button
        onClick={onFilterClick}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all ${
          showFilters || activeFilterCount > 0
            ? 'bg-bronze text-white'
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        <Filter className="w-5 h-5" />
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-1 w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
};