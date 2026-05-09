'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/src/app/components/layout/Navbar';
import { Footer } from '@/src/app/components/layout/Footer';
import { GameCard } from '@/src/app/components/ui/GameCard';
import { Button } from '@/src/app/components/ui/Button';
import { samplePlaylists, Playlist } from '@/src/app/data/Samples';
import { ArrowLeft, User, Calendar, Share2 } from 'lucide-react';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';

const BasketballIcon = createLucideIcon('Basketball', basketball);

export default function ListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listId = params.id as string;
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    const found = samplePlaylists.find(p => p.id === listId);
    setPlaylist(found || null);
  }, [listId]);

  if (!playlist) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">List not found</h1>
          <Button onClick={() => router.push('/list')}>Back to Lists</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pb-16">
        {/* Back button */}
        <div className="container-custom mt-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-bronze transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lists
          </button>
        </div>

        {/* List Header */}
        <div className="relative overflow-hidden bg-linear-to-r from-amethyst via-plum to-magenta py-12">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-bronze rounded-full blur-[120px]" />
          </div>
          
          <div className="container-custom relative z-10">
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <BasketballIcon className="w-8 h-8 text-bronze" />
                  <span className="text-sm text-white/60">Community List</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{playlist.title}</h1>
                <p className="text-white/80 text-lg mb-6">{playlist.description}</p>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-bronze" />
                    Created by {playlist.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-bronze" />
                    {new Date(playlist.createdAt).toLocaleDateString()}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs">
                    {playlist.games.length} games
                  </span>
                </div>
              </div>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="container-custom mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Games in this list</h2>
          
          {playlist.games.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {playlist.games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <BasketballIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No games yet</h3>
              <p className="text-gray-400">This list doesn't have any games added yet.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}