'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { GameCard } from '../components/ui/GameCard';
import { sampleGames, Game, sampleTeams } from '../data/Samples';
import { Search, Filter, X, Calendar, MapPin, Trophy, Clock } from 'lucide-react';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';

const BasketballIcon = createLucideIcon('Basketball', basketball);

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredGames, setFilteredGames] = useState<Game[]>(sampleGames);
  
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedArena, setSelectedArena] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const seasons = [...new Set(sampleGames.map(g => g.season))];
  const arenas = [...new Set(sampleGames.map(g => g.arena))];
  const statuses = ['upcoming', 'live', 'halftime', 'final', '1st', '2nd', '3rd', '4th'];

  useEffect(() => {
    let filtered = [...sampleGames];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(game => 
        game.home_team.name.toLowerCase().includes(query) ||
        game.away_team.name.toLowerCase().includes(query) ||
        game.home_team.city.toLowerCase().includes(query) ||
        game.away_team.city.toLowerCase().includes(query) ||
        game.arena.toLowerCase().includes(query)
      );
    }

    if (selectedTeam) {
      filtered = filtered.filter(game =>
        game.home_team.id === selectedTeam || game.away_team.id === selectedTeam
      );
    }

    if (selectedSeason) {
      filtered = filtered.filter(game => game.season === selectedSeason);
    }

    if (selectedArena) {
      filtered = filtered.filter(game => game.arena === selectedArena);
    }

    if (selectedStatus) {
      filtered = filtered.filter(game => game.status === selectedStatus);
    }

    if (startDate) {
      filtered = filtered.filter(game => new Date(game.game_date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(game => new Date(game.game_date) <= new Date(endDate));
    }

    setFilteredGames(filtered);
  }, [searchQuery, selectedTeam, selectedSeason, selectedArena, selectedStatus, startDate, endDate]);

  const clearAllFilters = () => {
    setSelectedTeam('');
    setSelectedSeason('');
    setSelectedArena('');
    setSelectedStatus('');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedTeam || selectedSeason || selectedArena || selectedStatus || startDate || endDate;

  const activeFilterCount = [
    selectedTeam, selectedSeason, selectedArena, selectedStatus, startDate, endDate
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pb-16">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amethyst via-plum to-magenta py-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-bronze rounded-full blur-[120px]" />
          </div>
          
          <div className="container-custom relative z-10 text-center">
            <div className="flex justify-center mb-4">
              <BasketballIcon className="w-12 h-12 text-bronze" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">All Games</h1>
            <p className="text-white/80 text-lg">Browse and discover basketball games</p>
          </div>
        </div>

        <div className="container-custom mt-8">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by team, city, or arena..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-bronze transition"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all ${
                showFilters || hasActiveFilters
                  ? 'bg-bronze text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Filter Games</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                </label>
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
          )}

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-400">
              Found <span className="text-bronze font-semibold">{filteredGames.length}</span> games
            </p>
            {filteredGames.length === 0 && hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-bronze hover:text-magenta transition"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Games Grid */}
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <BasketballIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No games found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 text-bronze hover:text-magenta transition"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}