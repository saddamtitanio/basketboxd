'use client';
import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SearchBarWithButton } from '../components/ui/SearchBarWithButton';
import { PageHeader } from '../components/ui/PageHeader';
import { ListCard } from '../components/ui/ListUI/ListCard';
import { Button } from '../components/ui/Button';
import { CreateListPopup } from '../components/ui/ListUI/CreateListPopup';
import { createLucideIcon, Plus } from 'lucide-react';
import { basketball } from '@lucide/lab';

const BasketballIcon = createLucideIcon('Basketball', basketball);

type ApiList = {
  id: string;
  title: string;
  description?: string;
  is_public: boolean;
  type: string;
  user_id: string;
  created_at: string;
  games: any[];

  profiles?: {
    id: string;
    username: string;
    display_name: string;
  };
};

type Playlist = {
  id: string;
  title: string;
  description: string;
  author: string;
  authorUsername: string;
  games: any[];
  createdAt: string;
  isPublic: boolean;
};

function toPlaylist(apiList: ApiList): Playlist {
  return {
    id: apiList.id,
    title: apiList.title,
    description: apiList.description ?? '',

    author:
      apiList.profiles?.display_name ||
      apiList.profiles?.username ||
      'Community',

    authorUsername: apiList.profiles?.username ?? '',

    games: (apiList.games ?? []).map((g: any) => g.game),
    createdAt: apiList.created_at,
    isPublic: apiList.is_public,
  };
}

export default function ListsPage() {
  const [mounted, setMounted] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [newPlaylist, setNewPlaylist] = useState({
    title: '',
    description: '',
    isPublic: true,
  });
  const [selectedGames, setSelectedGames] = useState<string[]>([]);

  // Fetch public lists from the backend (no auth required)
  const fetchLists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/lists/public');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to fetch lists');
      }
      const data: ApiList[] = await res.json();
      const mapped = data.map(toPlaylist);
      setPlaylists(mapped);
      setFilteredPlaylists(mapped);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchLists();
  }, [fetchLists]);

  // Client-side filtering
  useEffect(() => {
    if (!mounted) return;
    if (!searchQuery) {
      setFilteredPlaylists(playlists);
      return;
    }
    const query = searchQuery.toLowerCase();
    setFilteredPlaylists(
      playlists.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.author.toLowerCase().includes(query),
      ),
    );
  }, [searchQuery, playlists, mounted]);

  const formatDate = (dateString: string) => {
    if (!mounted) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylist.title.trim()) return;
    try {
      setCreating(true);
      setError(null);

      const res = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPlaylist.title,
          description: newPlaylist.description,
          is_public: newPlaylist.isPublic,
          type: 'list',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create list');
      }

      const created: ApiList = await res.json();

      if (selectedGames.length > 0) {
        await Promise.all(
          selectedGames.map((gameId) =>
            fetch(`/api/lists/${created.id}/games`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ game_id: gameId }),
            }),
          ),
        );
      }

      const newMapped = toPlaylist(created);
      setPlaylists((prev) => [newMapped, ...prev]);
      setShowCreatePopup(false);
      setNewPlaylist({ title: '', description: '', isPublic: true });
      setSelectedGames([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
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

          {/* Error banner */}
          {error && !loading && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm">
              {error}
              <button
                className="ml-3 underline opacity-70 hover:opacity-100"
                onClick={fetchLists}
              >
                Retry
              </button>
            </div>
          )}

          {/* Results count */}
          <div className="mb-6">
            {loading ? (
              <p className="text-gray-400">Loading lists…</p>
            ) : (
              <p className="text-gray-400">
                Found{' '}
                <span className="text-bronze font-semibold">
                  {filteredPlaylists.length}
                </span>{' '}
                lists
              </p>
            )}
          </div>

          {/* Lists grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : filteredPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaylists.map((playlist) => (
                <ListCard
                  key={playlist.id}
                  playlist={playlist}
                  formatDate={formatDate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <BasketballIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No lists found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search or create a new list
              </p>
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
        onClose={() => {
          setShowCreatePopup(false);
          setError(null);
        }}
        newPlaylist={newPlaylist}
        setNewPlaylist={setNewPlaylist}
        selectedGames={selectedGames}
        setSelectedGames={setSelectedGames}
        onCreate={handleCreatePlaylist}
        isCreating={creating}
        createError={error}
      />

      <Footer />
    </div>
  );
}