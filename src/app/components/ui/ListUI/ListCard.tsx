'use client';

import { useRouter } from 'next/navigation';
import { Playlist } from '@/src/app/data/Samples';
import { User, Calendar } from 'lucide-react';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';

const BasketballIcon = createLucideIcon('Basketball', basketball);

interface ListCardProps {
  playlist: Playlist;
  formatDate: (dateString: string) => string;
}

export const ListCard: React.FC<ListCardProps> = ({ playlist, formatDate }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/list/${playlist.id}`)}
      className="group bg-gradient-to-br from-amethyst/20 to-plum/20 rounded-2xl overflow-hidden hover:from-amethyst/30 hover:to-plum/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-magenta/20 cursor-pointer border border-white/10"
    >
      {/* Preview Games */}
      <div className="grid grid-cols-3 gap-0.5 h-32 overflow-hidden">
        {playlist.games.slice(0, 6).map((game, idx) => (
          <div key={idx} className="relative aspect-square bg-gradient-to-br from-bronze/20 to-magenta/20 overflow-hidden">
            <img
              src={game.image_url}
              alt={game.home_team.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
        {playlist.games.length < 6 && [...Array(6 - playlist.games.length)].map((_, idx) => (
          <div key={`empty-${idx}`} className="aspect-square bg-white/5 flex items-center justify-center">
            <BasketballIcon className="w-6 h-6 text-gray-600" />
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-white group-hover:text-bronze transition-colors line-clamp-1 mb-2">
          {playlist.title}
        </h3>
        
        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
          {playlist.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {playlist.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(playlist.createdAt)}
          </span>
          <span>{playlist.games.length} games</span>
        </div>
        
        <div className="mt-3 pt-3 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-full text-sm py-1.5 rounded-lg bg-magenta/20 text-magenta hover:bg-magenta hover:text-white transition-all duration-300 font-medium">
            View List →
          </button>
        </div>
      </div>
    </div>
  );
};