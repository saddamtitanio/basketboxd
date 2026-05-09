'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/src/app/components/layout/Navbar';
import { Footer } from '@/src/app/components/layout/Footer';
import { sampleGames } from '@/src/app/data/Samples';
import { 
  Star, 
  Flame, 
  Clock, 
  ArrowLeft,
  BookmarkPlus,
  CheckCircle,
  MessageSquare,
  Calendar,
  MapPin,
  Trophy
} from 'lucide-react';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';
import { Button } from '@/src/app/components/ui/Button';

const BasketballIcon = createLucideIcon('Basketball', basketball);

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;
  const game = sampleGames.find(g => g.id === gameId);
  
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!game) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Game not found</h1>
          <Button onClick={() => router.push('/')}>Go Back Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (game.status) {
      case 'final':
        return <span className="bg-amethyst px-3 py-1 rounded-full text-xs font-bold">FINAL</span>;
      case 'halftime':
        return <span className="bg-yellow-600 px-3 py-1 rounded-full text-xs font-bold">HALFTIME</span>;
      case '1st': case '2nd': case '3rd': case '4th':
        return <span className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">LIVE {game.period}</span>;
      default:
        return <span className="bg-plum px-3 py-1 rounded-full text-xs font-bold">UPCOMING</span>;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pb-16">
        <div className="container-custom mt-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-bronze transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>

        <div className="container-custom">
          <div className="bg-gradient-to-br from-amethyst/20 to-plum/20 rounded-2xl p-8 border border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                {getStatusBadge()}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-bronze fill-bronze" />
                  <span className="text-sm">{game.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">{game.watchability}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsWatchlisted(!isWatchlisted)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                    isWatchlisted 
                      ? 'bg-bronze text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <BookmarkPlus className="w-4 h-4" />
                  {isWatchlisted ? 'Watchlisted' : 'Watchlist'}
                </button>
                <button 
                  onClick={() => setIsWatched(!isWatched)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                    isWatched 
                      ? 'bg-bronze text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {isWatched ? 'Watched' : 'Mark Watched'}
                </button>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-12">
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{game.home_team.name}</div>
                  <div className="text-sm text-gray-400">{game.home_team.city}</div>
                </div>
                <div className="text-6xl font-bold text-bronze">
                  {game.home_score ?? '?'}
                </div>
                <div className="text-2xl font-bold text-gray-500">VS</div>
                <div className="text-6xl font-bold text-magenta">
                  {game.away_score ?? '?'}
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-white">{game.away_team.name}</div>
                  <div className="text-sm text-gray-400">{game.away_team.city}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Calendar className="w-4 h-4 text-bronze" />
                {mounted ? new Date(game.game_date).toLocaleDateString() : 'Loading...'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="w-4 h-4 text-bronze" />
                {mounted ? new Date(game.game_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-bronze" />
                {game.arena}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <BasketballIcon className="w-4 h-4 text-bronze" />
                {game.season}
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom mt-8">
          <Link href={`/games/${game.id}/review`}>
            <Button variant="primary" className="w-full py-4 text-lg">
              <MessageSquare className="w-5 h-5 mr-2" />
              Write a Review
            </Button>
          </Link>
        </div>

        <div className="container-custom mt-12">
          <div className="bg-gradient-to-br from-amethyst/20 to-plum/20 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-6 h-6 text-bronze" />
              <h2 className="text-2xl font-bold text-white">Community Reviews</h2>
            </div>
            
            <div className="text-center py-12 text-gray-400">
              <p>No reviews yet. Be the first to review this game!</p>
              <Link href={`/games/${game.id}/review`}>
              </Link>
            </div>
          </div>
        </div>

        {game.top_scorer && (
          <div className="container-custom mt-8">
            <div className="bg-gradient-to-br from-magenta/20 to-plum/20 rounded-2xl p-6 border border-magenta/30">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-bronze" />
                <h3 className="text-lg font-bold text-white">Top Performer</h3>
              </div>
              <p className="text-bronze font-semibold">{game.top_scorer}</p>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}