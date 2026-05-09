import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { GameSection } from './components/home/GameSection';
import { sampleGames } from './data/Samples';
import { Flame, Clock, Zap, Trophy } from 'lucide-react';

export default function Home() {
  const liveGamesList = sampleGames.filter(g => 
    g.status === '1st' || g.status === '2nd' || g.status === '3rd' || 
    g.status === '4th' || g.status === 'halftime' || g.status === 'live'
  );
  
  const mustWatchGames = [...sampleGames]
    .sort((a, b) => b.watchability - a.watchability)
    .slice(0, 6);
  
  const recentFinishedGames = sampleGames
    .filter(g => g.status === 'final')
    .slice(0, 6);
  
  const upcomingGames = sampleGames
    .filter(g => g.status === 'upcoming')
    .slice(0, 6);



  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pb-16">
        <HeroSection />
        
        <div className="container-custom mt-12">
          {liveGamesList.length > 0 && (
            <GameSection 
              title="Happening Now" 
              games={liveGamesList}
              icon={<Zap className="w-5 h-5 text-red-500" />}
            />
          )}
          
          <GameSection 
            title="Must Watch" 
            games={mustWatchGames}
            icon={<Flame className="w-5 h-5 text-bronze" />}
          />
          
          {recentFinishedGames.length > 0 && (
            <GameSection 
              title="Most Exciting (Past 7 Days)" 
              games={recentFinishedGames}
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