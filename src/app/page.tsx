'use client';
import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { GameSection } from './components/home/GameSection';
import { Flame, Clock, Zap, Trophy } from 'lucide-react';
import { Game } from '@/src/app/types/index'

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('/api/games');

        if (!res.ok) {
          const text = await res.text();
          console.error('Failed to fetch games', res.status, text);
          return;
        }
        const data: Game[] = await res.json();
        setGames(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const liveStatuses = ['1st', '2nd', '3rd', '4th', 'halftime', 'live'];
  const liveGames = games.filter(g => liveStatuses.includes(g.status)).slice(0, 6);
  const finishedGames = games.filter(g => g.status === 'final' || g.status === 'closed').slice(0, 6);
  const upcomingGames = games.filter(g => g.status === 'upcoming').slice(0, 6);

  const mustWatchGames = [...games]
    .filter(g => g.rating !== undefined)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-20 text-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pb-16">
        <HeroSection />
        <div className="container-custom mt-12">
          {liveGames.length > 0 && (
            <GameSection
              title="Happening Now"
              games={liveGames}
              icon={<Zap className="w-5 h-5 text-red-500" />}
            />
          )}

          {mustWatchGames.length > 0 && (
            <GameSection
              title="Must Watch"
              games={mustWatchGames}
              icon={<Flame className="w-5 h-5 text-bronze" />}
            />
          )}

          {finishedGames.length > 0 && (
            <GameSection
              title="Most Exciting (Past 7 Days)"
              games={finishedGames}
              icon={<Trophy className="w-5 h-5 text-bronze" />}
            />
          )}

          {upcomingGames.length > 0 && (
            <GameSection
              title="Upcoming Games"
              games={upcomingGames}
              icon={<Clock className="w-5 h-5 text-magenta" />}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}