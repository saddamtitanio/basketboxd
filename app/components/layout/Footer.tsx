import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black/50 border-t border-white/10 mt-20">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏀</span>
            <span className="text-sm text-gray-400">© 2026 BasketBoxd. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-pink-lobster fill-pink-lobster" />
            <span>for basketball fans</span>
          </div>
        </div>
      </div>
    </footer>
  );
};