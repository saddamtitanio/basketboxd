'use client';
import { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { GameCard } from '../components/ui/GameCard';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchBarWithFilter } from '../components/ui/SearchBarWithFilter';
import { FilterPanel } from '../components/ui/FilterPanel';
import { EmptyState } from '../components/ui/EmptyState';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';

const BasketballIcon = createLucideIcon('Basketball', basketball);

type Team = { id: string; name: string; city: string; abbreviation: string; logo_url?: string; };
type Game = {
  id: string; home_team: Team; away_team: Team;
  home_score?: number; away_score?: number;
  game_date: string; season: string; arena: string; status: string;
};

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedArena, setSelectedArena] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch all games on mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/games');
        if (!res.ok) throw new Error('Failed to fetch games');
        const data = await res.json();
        setGames(data);
        setFilteredGames(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  // Derive filter options from fetched data
  const seasons = [...new Set(games.map(g => g.season))];
  const arenas = [...new Set(games.map(g => g.arena))];
  const statuses = ['upcoming', 'live', 'halftime', 'final', 'closed', '1st', '2nd', '3rd', '4th'];

  // Client-side filtering
  useEffect(() => {
    let filtered = [...games];

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
    if (selectedSeason) filtered = filtered.filter(game => game.season === selectedSeason);
    if (selectedArena) filtered = filtered.filter(game => game.arena === selectedArena);
    if (selectedStatus) filtered = filtered.filter(game => game.status === selectedStatus);
    if (startDate) filtered = filtered.filter(game => new Date(game.game_date) >= new Date(startDate));
    if (endDate) filtered = filtered.filter(game => new Date(game.game_date) <= new Date(endDate));

    setFilteredGames(filtered);
  }, [searchQuery, selectedTeam, selectedSeason, selectedArena, selectedStatus, startDate, endDate, games]);

  const clearAllFilters = () => {
    setSelectedTeam('');
    setSelectedSeason('');
    setSelectedArena('');
    setSelectedStatus('');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
  };

  const hasActiveFilters = Boolean(selectedTeam || selectedSeason || selectedArena || selectedStatus || startDate || endDate);
  const activeFilterCount = [selectedTeam, selectedSeason, selectedArena, selectedStatus, startDate, endDate].filter(Boolean).length;

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

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-20 text-center">
          <div className="text-red-400 text-xl">{error}</div>
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
          title="All Games"
          description="Browse and discover basketball games"
          icon={<BasketballIcon className="w-12 h-12 text-bronze" />}
        />
        <div className="container-custom mt-8">
          <SearchBarWithFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterClick={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
            activeFilterCount={activeFilterCount}
            placeholder="Search by team, city, or arena..."
          />
          {showFilters && (
            <FilterPanel
              selectedTeam={selectedTeam}
              setSelectedTeam={setSelectedTeam}
              selectedSeason={selectedSeason}
              setSelectedSeason={setSelectedSeason}
              selectedArena={selectedArena}
              setSelectedArena={setSelectedArena}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              seasons={seasons}
              arenas={arenas}
              statuses={statuses}
              hasActiveFilters={hasActiveFilters}
              onClearAll={clearAllFilters}
            />
          )}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-400">
              Found <span className="text-bronze font-semibold">{filteredGames.length}</span> games
            </p>
            {filteredGames.length === 0 && hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-sm text-bronze hover:text-magenta transition">
                Clear all filters
              </button>
            )}
          </div>
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No games found"
              message="Try adjusting your search or filters"
              buttonText="Clear all filters"
              onButtonClick={clearAllFilters}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}