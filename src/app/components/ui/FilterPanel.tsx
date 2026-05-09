'use client';

import { X, Trophy, Clock, MapPin, Calendar } from 'lucide-react';
import { sampleTeams } from '@/src/app/data/Samples';

interface FilterPanelProps {
  selectedTeam: string;
  setSelectedTeam: (value: string) => void;
  selectedSeason: string;
  setSelectedSeason: (value: string) => void;
  selectedArena: string;
  setSelectedArena: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  seasons: string[];
  arenas: string[];
  statuses: string[];
  hasActiveFilters: boolean;
  onClearAll: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedTeam,
  setSelectedTeam,
  selectedSeason,
  setSelectedSeason,
  selectedArena,
  setSelectedArena,
  selectedStatus,
  setSelectedStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  seasons,
  arenas,
  statuses,
  hasActiveFilters,
  onClearAll,
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Filter Games</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-sm text-bronze hover:text-magenta transition flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Team Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Trophy className="w-4 h-4 inline mr-1" />
            Team
          </label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full p-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:border-bronze"
            style={{ colorScheme: 'dark' }}
          >
            <option value="" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>All Teams</option>
            {sampleTeams.map(team => (
              <option key={team.id} value={team.id} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                {team.name} ({team.city})
              </option>
            ))}
          </select>
        </div>

        {/* Season Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Season
          </label>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="w-full p-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:border-bronze"
            style={{ colorScheme: 'dark' }}
          >
            <option value="" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>All Seasons</option>
            {seasons.map(season => (
              <option key={season} value={season} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>{season}</option>
            ))}
          </select>
        </div>

        {/* Arena Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Arena
          </label>
          <select
            value={selectedArena}
            onChange={(e) => setSelectedArena(e.target.value)}
            className="w-full p-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:border-bronze"
            style={{ colorScheme: 'dark' }}
          >
            <option value="" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>All Arenas</option>
            {arenas.map(arena => (
              <option key={arena} value={arena} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>{arena}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:border-bronze"
            style={{ colorScheme: 'dark' }}
          >
            <option value="" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>All Status</option>
            {statuses.map(status => (
              <option key={status} value={status} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                {status.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-bronze"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-bronze"
          />
        </div>
      </div>
    </div>
  );
};