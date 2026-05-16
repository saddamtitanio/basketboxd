'use client';
import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '../Button';

type Team = {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  logo_url?: string;
};

type Game = {
  id: string;
  home_team: Team;
  away_team: Team;
  arena: string;
  game_date: string;
  season: string;
  status: string;
};

type Mode = 'create' | 'update';

interface CreateListPopupProps {
  isOpen: boolean;
  
  onClose: () => void;

  mode?: Mode; 
  newPlaylist: {
    title: string;
    description: string;
    isPublic: boolean;
  };
  setNewPlaylist: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      isPublic: boolean;
    }>
  >;
  selectedGames: string[];
  setSelectedGames: React.Dispatch<React.SetStateAction<string[]>>;
  onCreate: () => void;
  isCreating: boolean;
  createError: string | null;
}

export const CreateListPopup: React.FC<CreateListPopupProps> = ({
  isOpen,
  onClose,
  mode = 'create',
  newPlaylist,
  setNewPlaylist,
  selectedGames,
  setSelectedGames,
  onCreate,
  isCreating,
  createError,
}) => {
  const [games, setGames] = useState<Game[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch real games from the API when the popup opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchGames = async () => {
      try {
        setGamesLoading(true);
        setGamesError(null);
        const res = await fetch('/api/games');
        if (!res.ok) throw new Error('Failed to load games');
        const data: Game[] = await res.json();
        setGames(data);
      } catch (err: any) {
        setGamesError(err.message);
      } finally {
        setGamesLoading(false);
      }
    };

    fetchGames();
  }, [isOpen]);

  if (!isOpen) return null;
  const filteredGames = games.filter((game) => {
    const query = searchQuery.toLowerCase();

    return (
      game.home_team.name.toLowerCase().includes(query) ||
      game.away_team.name.toLowerCase().includes(query) ||
      game.arena.toLowerCase().includes(query) ||
      game.season.toLowerCase().includes(query)
    );
  });
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-linear-to-br from-amethyst to-plum rounded-2xl border border-white/20 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-4">
          {mode === 'create' ? 'Create New List' : 'Update List'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={newPlaylist.title}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, title: e.target.value })}
              placeholder="e.g., Best Games of 2025"
              className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-bronze"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={newPlaylist.description}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
              placeholder="What makes this list special?"
              rows={3}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-bronze resize-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newPlaylist.isPublic}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, isPublic: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-bronze focus:ring-bronze"
              />
              <span className="text-gray-300">Make this list public</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Games
              {selectedGames.length > 0 && (
                <span className="ml-2 text-bronze">({selectedGames.length} selected)</span>
              )}
            </label>
          <div className="space-y-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games, teams, arena..."
              className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-bronze"
            />
            <div className="max-h-60 overflow-y-auto space-y-2 bg-white/5 rounded-lg p-3 border border-white/10">
              {gamesLoading ? (
                <div className="flex items-center justify-center gap-2 py-6 text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading games…</span>
                </div>
              ) : gamesError ? (
                <p className="text-red-400 text-sm text-center py-4">{gamesError}</p>
              ) : filteredGames.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No games available</p>
              ) : (
                filteredGames.map((game) => (
                  <label
                    key={game.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGames.includes(game.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedGames([...selectedGames, game.id]);
                        } else {
                          setSelectedGames(selectedGames.filter((id) => id !== game.id));
                        }
                      }}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-bronze"
                    />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {game.home_team.logo_url && (
                        <img
                          src={game.home_team.logo_url}
                          alt={game.home_team.abbreviation}
                          className="w-5 h-5 object-contain shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="text-white text-sm font-medium truncate">
                          {game.home_team.name} vs {game.away_team.name}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {game.arena} · {new Date(game.game_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {game.away_team.logo_url && (
                      <img
                        src={game.away_team.logo_url}
                        alt={game.away_team.abbreviation}
                        className="w-5 h-5 object-contain shrink-0"
                      />
                    )}
                  </label>
                ))
              )}
            </div>
          </div>

          {createError && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {createError}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={onCreate}
              disabled={isCreating || !newPlaylist.title.trim()}
            >
              {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
              {isCreating
                ? mode === 'create'
                  ? 'Creating…'
                  : 'Updating…'
                : mode === 'create'
                  ? 'Create List'
                  : 'Update List'}
            </Button>
            <Button variant="ghost" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    
  </div>
</div>
    
  );
};