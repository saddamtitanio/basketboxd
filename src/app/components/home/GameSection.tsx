'use client';

import React from 'react';
import { GameCard } from '../ui/GameCard';
import { Game } from '../../data/Samples';
import { ChevronRight, createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';

const BasketballIcon = createLucideIcon('Basketball', basketball);

interface GameSectionProps {
  title: string;
  games: Game[];
  icon?: React.ReactNode;
  viewAll?: boolean;
}

export const GameSection: React.FC<GameSectionProps> = ({ 
  title, 
  games, 
  icon, 
  viewAll = true 
}) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {icon ? (
            <div className="text-magenta">{icon}</div>
          ) : (
            <BasketballIcon className="w-5 h-5 text-bronze" />
          )}
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h2>
        </div>
        {viewAll && (
          <button className="text-sm text-gray-400 hover:text-magenta transition-colors flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
};