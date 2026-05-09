'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SearchBarWithButton } from '../components/ui/SearchBarWithButton';
import { PageHeader } from '../components/ui/PageHeader';
import { ListCard } from '../components/ui/ListUI/ListCard';
import { Button } from '../components/ui/Button';
import { CreateListPopup } from '../components/ui/ListUI/CreateListPopup';
import { samplePlaylists, Playlist, sampleGames } from '../data/Samples';
import { createLucideIcon, Plus } from 'lucide-react';
import { basketball } from '@lucide/lab';

const BasketballIcon = createLucideIcon('Basketball', basketball);

export default function ListsPage() {
  const [mounted, setMounted] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  
  const [newPlaylist, setNewPlaylist] = useState({
    title: '',
    description: '',
    isPublic: true,
  });
  const [selectedGames, setSelectedGames] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    setPlaylists(samplePlaylists);
    setFilteredPlaylists(samplePlaylists);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let filtered = [...playlists];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(playlist =>
        playlist.title.toLowerCase().includes(query) ||
        playlist.description.toLowerCase().includes(query) ||
        playlist.author.toLowerCase().includes(query)
      );
    }
    setFilteredPlaylists(filtered);
  }, [searchQuery, playlists, mounted]);

  const formatDate = (dateString: string) => {
    if (!mounted) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylist.title.trim()) return;
    
    const newId = (playlists.length + 1).toString();
    const playlist: Playlist = {
      id: newId,
      title: newPlaylist.title,
      description: newPlaylist.description,
      author: 'Current User',
      authorUsername: 'current_user',
      games: sampleGames.filter(g => selectedGames.includes(g.id)),
      createdAt: new Date().toISOString(),
      isPublic: newPlaylist.isPublic,
    };

    setPlaylists([playlist, ...playlists]);
    setShowCreatePopup(false);
    setNewPlaylist({ title: '', description: '', isPublic: true });
    setSelectedGames([]);
  };

  if (!mounted) {
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
        <PageHeader 
          title="Community Lists"
          description="curated playlists of various basketball games by the community"
          icon={<BasketballIcon className="w-12 h-12 text-bronze" />}
        />

        <div className="container-custom mt-8">
          <SearchBarWithButton
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onButtonClick={() => setShowCreatePopup(true)}
            buttonText="Create List"
            placeholder="Search lists by title, description, or author..."
          />

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-400">
              Found <span className="text-bronze font-semibold">{filteredPlaylists.length}</span> lists
            </p>
          </div>

          {/* Lists Grid */}
          {filteredPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaylists.map((playlist) => (
                <ListCard key={playlist.id} playlist={playlist} formatDate={formatDate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <BasketballIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No lists found</h3>
              <p className="text-gray-400">Try adjusting your search or create a new list</p>
              <Button
                variant="primary"
                className="mt-4 flex items-center gap-2 mx-auto"
                onClick={() => setShowCreatePopup(true)}
              >
                <Plus className="w-4 h-4" />
                Create List
              </Button>
            </div>
          )}
        </div>
      </main>

      <CreateListPopup
        isOpen={showCreatePopup}
        onClose={() => setShowCreatePopup(false)}
        newPlaylist={newPlaylist}
        setNewPlaylist={setNewPlaylist}
        selectedGames={selectedGames}
        setSelectedGames={setSelectedGames}
        onCreate={handleCreatePlaylist}
      />
      
      <Footer />
    </div>
  );
}