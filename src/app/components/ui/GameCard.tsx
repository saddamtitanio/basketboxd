'use client';
import React from 'react';
import Link from 'next/link';
import { Star, Clock } from 'lucide-react';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';
import { Game, Team } from '@/src/app/types/index'

const BasketballIcon = createLucideIcon('Basketball', basketball);

interface GameCardProps {
  game: Game;
  variant?: 'default' | 'compact' | 'featured';
}

export const GameCard: React.FC<GameCardProps> = ({ game, variant = 'default' }) => {
  const getStatusBadge = () => {
    switch (game.status) {
      case 'live':
      case '1st':
      case '2nd':
      case '3rd':
      case '4th':
        return (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            LIVE
          </span>
        );
      case 'halftime':
        return <span className="absolute top-3 left-3 bg-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full">HALFTIME</span>;
      case 'final':
      case 'closed':
        return <span className="absolute top-3 left-3 bg-amethyst text-white text-xs font-bold px-2 py-1 rounded-full">FINAL</span>;
      default:
        const timeString = new Date(game.game_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return (
          <span className="absolute top-3 left-3 bg-plum text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />{timeString}
          </span>
        );
    }
  };

  const fallbackImage = 'https://cdn.nba.com/manage/2021/08/NBA-court.jpg';

  return (
    <Link href={`/games/${game.id}`}>
      <div className="group bg-linear-to-br from-amethyst/20 to-plum/20 rounded-xl overflow-hidden hover:from-amethyst/30 hover:to-plum/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-magenta/20 cursor-pointer border border-white/10">
        <div className="relative aspect-4/3 overflow-hidden">
          <img
            src={game.image_url || fallbackImage}
            alt={`${game.home_team.name} vs ${game.away_team.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-amethyst/80 via-plum/20 to-transparent" />
          {getStatusBadge()}

          {game.rating != null && typeof game.rating === 'number' && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-bronze fill-bronze" />
              <span className="text-xs font-bold text-white">{game.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <BasketballIcon className="w-3 h-3 text-bronze" />
              <span className="text-xs text-gray-300 font-medium">{game.season}</span>
            </div>
            {game.review_count != null && game.review_count > 0 && (
              <span className="text-[10px] text-gray-400">{game.review_count} review{game.review_count !== 1 ? 's' : ''}</span>
            )}
          </div>

          <div className="space-y-1 mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {game.home_team.logo_url && (
                  <img src={game.home_team.logo_url} alt={game.home_team.name} className="w-6 h-6 object-contain" />
                )}
                <span className="font-bold text-sm text-white">{game.home_team.abbreviation}</span>
                <span className="text-xs text-gray-400 hidden sm:inline">{game.home_team.city}</span>
              </div>
              {game.home_score !== undefined && (
                <span className="font-bold text-lg text-magenta">{game.home_score}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {game.away_team.logo_url && (
                  <img src={game.away_team.logo_url} alt={game.away_team.name} className="w-6 h-6 object-contain" />
                )}
                <span className="font-bold text-sm text-white">{game.away_team.abbreviation}</span>
                <span className="text-xs text-gray-400 hidden sm:inline">{game.away_team.city}</span>
              </div>
              {game.away_score !== undefined && (
                <span className="font-bold text-lg text-magenta">{game.away_score}</span>
              )}
            </div>
          </div>

          <div className="text-[10px] text-gray-400 mb-2">{game.arena}</div>
        </div>
      </div>
    </Link>
  );
};