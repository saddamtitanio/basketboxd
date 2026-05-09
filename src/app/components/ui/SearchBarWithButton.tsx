'use client';

import { Search, Plus } from 'lucide-react';
import { Button } from './Button';

interface SearchBarWithButtonProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onButtonClick: () => void;
  buttonText: string;
  placeholder?: string;
}

export const SearchBarWithButton: React.FC<SearchBarWithButtonProps> = ({
  searchQuery,
  onSearchChange,
  onButtonClick,
  buttonText,
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
      
      <Button variant="primary" className="flex items-center gap-2 whitespace-nowrap" onClick={onButtonClick}>
        <Plus className="w-5 h-5" />
        {buttonText}
      </Button>
    </div>
  );
};