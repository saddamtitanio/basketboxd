'use client';

import { X } from 'lucide-react';
import { Button } from '../Button';
import { sampleGames } from '@/src/app/data/Samples';

interface CreateListPopupProps {
  isOpen: boolean;
  onClose: () => void;
  newPlaylist: {
    title: string;
    description: string;
    isPublic: boolean;
  };
  setNewPlaylist: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
    isPublic: boolean;
  }>>;
  selectedGames: string[];
  setSelectedGames: React.Dispatch<React.SetStateAction<string[]>>;
  onCreate: () => void;
}

export const CreateListPopup: React.FC<CreateListPopupProps> = ({
  isOpen,
  onClose,
  newPlaylist,
  setNewPlaylist,
  selectedGames,
  setSelectedGames,
  onCreate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-amethyst to-plum rounded-2xl border border-white/20 p-6" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-4">Create New List</h2>
        
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Games</label>
            <div className="max-h-60 overflow-y-auto space-y-2 bg-white/5 rounded-lg p-3 border border-white/10">
              {sampleGames.map((game) => (
                <label key={game.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedGames.includes(game.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGames([...selectedGames, game.id]);
                      } else {
                        setSelectedGames(selectedGames.filter(id => id !== game.id));
                      }
                    }}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-bronze"
                  />
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">
                      {game.home_team.name} vs {game.away_team.name}
                    </div>
                    <div className="text-gray-400 text-xs">{game.arena}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-bronze">{game.rating}</span>
                    <span className="text-xs text-gray-500">★</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button variant="primary" className="flex-1" onClick={onCreate}>
              Create List
            </Button>
            <Button variant="ghost" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};