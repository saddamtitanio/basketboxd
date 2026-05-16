'use client';
import { useState, useEffect, useCallback } from 'react';
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

const STATUSES = ['upcoming', 'live', 'halftime', 'final', 'closed', '1st', '2nd', '3rd', '4th'];
const SEARCH_DEBOUNCE_MS = 400;

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [seasons, setSeasons] = useState<string[]>([]);
  const [arenas, setArenas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedArena, setSelectedArena] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Debounce search — only fire fetch after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (debouncedQuery) params.set('query', debouncedQuery);
      if (selectedTeam) params.set('teamId', selectedTeam);
      if (selectedSeason) params.set('season', selectedSeason);
      if (selectedArena) params.set('arena', selectedArena);
      if (selectedStatus) params.set('status', selectedStatus);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      const res = await fetch(`/api/games?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch games');
      const data: Game[] = await res.json();
      setGames(data);

      const isUnfiltered = !selectedTeam && !selectedSeason && !selectedArena
        && !selectedStatus && !startDate && !endDate && !debouncedQuery;

      if (isUnfiltered) {
        setSeasons([...new Set(data.map((g) => g.season))].filter(Boolean));
        setArenas([...new Set(data.map((g) => g.arena))].filter(Boolean));

        const teamMap = new Map<string, Team>();
        data.forEach((g) => {
          if (g.home_team?.id) teamMap.set(g.home_team.id, g.home_team);
          if (g.away_team?.id) teamMap.set(g.away_team.id, g.away_team);
        });
        setTeams([...teamMap.values()].sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, selectedTeam, selectedSeason, selectedArena, selectedStatus, startDate, endDate]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const clearAllFilters = () => {
    setSelectedTeam('');
    setSelectedSeason('');
    setSelectedArena('');
    setSelectedStatus('');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    setDebouncedQuery('');
  };

  const hasActiveFilters = Boolean(selectedTeam || selectedSeason || selectedArena || selectedStatus || startDate || endDate);
  const activeFilterCount = [selectedTeam, selectedSeason, selectedArena, selectedStatus, startDate, endDate].filter(Boolean).length;

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
              teams={teams}
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
              statuses={STATUSES}
              hasActiveFilters={hasActiveFilters}
              onClearAll={clearAllFilters}
            />
          )}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-400">
              {loading
                ? 'Searching…'
                : <> Found <span className="text-bronze font-semibold">{games.length}</span> games</>
              }
            </p>
            {!loading && games.length === 0 && hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-sm text-bronze hover:text-magenta transition">
                Clear all filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-4/3 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-400">{error}</div>
          ) : games.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {games.map((game) => (
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