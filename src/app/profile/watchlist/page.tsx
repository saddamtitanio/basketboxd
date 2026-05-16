'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/src/app/lib/supabase/client';

import { Navbar } from '@/src/app/components/layout/Navbar';
import { Footer } from '@/src/app/components/layout/Footer';

import {
  BookmarkPlus,
  Loader2,
  ArrowLeft,
  Calendar,
  MapPin,
  Trash2,
} from 'lucide-react';

const supabase = createClient();

type Team = {
  id: string;
  name: string;
  abbreviation: string;
  logo_url?: string;
};

type Game = {
  id: string;
  arena: string;
  game_date: string;
  status: string;

  home_team: Team;
  away_team: Team;
};

type WatchlistGame = {
  id: string;
  game: Game;
};

export default function WatchlistPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<WatchlistGame[]>([]);
  const [watchlistId, setWatchlistId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push('/auth/login');
          return;
        }

        const userId = session.user.id;

        // find watchlist
        const { data: watchlist, error: watchlistError } = await supabase
          .from('lists')
          .select('id')
          .eq('user_id', userId)
          .eq('type', 'watchlist')
          .single();

        if (watchlistError || !watchlist) {
          setLoading(false);
          return;
        }

        setWatchlistId(watchlist.id);

        const { data, error } = await supabase
          .from('list_games')
          .select(`
            list_id,
            game:games (
              id,
              arena,
              game_date,
              status,
              home_team:teams!games_home_team_id_fkey (
                id,
                name,
                abbreviation,
                logo_url
              ),
              away_team:teams!games_away_team_id_fkey (
                id,
                name,
                abbreviation,
                logo_url
              )
            )
          `)
          .eq('list_id', watchlist.id)
          .order('added_at', { ascending: false });

        if (error) throw error;

        const formatted: WatchlistGame[] = (data || []).map((item: any) => ({
            id: item.game.id,

            game: {
                id: item.game?.id,
                arena: item.game?.arena,
                game_date: item.game?.game_date,
                status: item.game?.status,

                home_team: Array.isArray(item.game?.home_team)
                ? item.game.home_team[0]
                : item.game?.home_team,

                away_team: Array.isArray(item.game?.away_team)
                ? item.game.away_team[0]
                : item.game?.away_team,
            },
        }));

        setGames(formatted);
    } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    fetchWatchlist();
  }, [router]);

  const removeFromWatchlist = async (listGameId: string) => {
    const previous = games;

    setGames((prev) => prev.filter((g) => g.id !== listGameId));

    const { error } = await supabase
      .from('list_games')
      .delete()
        .eq('list_id', watchlistId)
        .eq('game_id', listGameId);

    if (error) {
      console.error(error);
      setGames(previous);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pb-16">
        <div className="container-custom py-12">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="cursor-pointer flex items-center gap-2 text-gray-400 hover:text-bronze transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white">
                My Watchlist
              </h1>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-20">
              <Loader2 className="w-6 h-6 animate-spin text-bronze" />

              <span className="text-white text-lg">
                Loading watchlist...
              </span>
            </div>
          ) : games.length === 0 ? (
            /* Empty */
            <div className="bg-linear-to-br from-amethyst/20 mt-10 to-plum/20 border border-white/10 rounded-2xl p-12 text-center">
              <BookmarkPlus className="w-14 h-14 text-gray-500 mx-auto mb-4 mt-5" />

              <h2 className="text-2xl font-bold text-white mb-2">
                Your watchlist is empty
              </h2>

              <p className="text-gray-400 mb-6">
                Save games to watch them later.
              </p>

              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 rounded-xl bg-bronze hover:bg-orange-400 text-white font-semibold transition"
              >
                Browse Games
              </button>
            </div>
          ) : (
            /* Games */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            {games.map((item) => (
                <div
                key={item.id}
                className="relative overflow-hidden bg-linear-to-br from-amethyst/20 to-plum/20 border border-white/10 rounded-2xl p-6 hover:border-bronze/30 transition"
                >
                {/* Remove button */}
                <button
                    onClick={() => removeFromWatchlist(item.id)}
                    className="absolute top-4 right-4 cursor-pointer text-red-400 hover:text-red-300 transition"
                >
                    <Trash2 className="w-5 h-5" />
                </button>

                <button
                    onClick={() => router.push(`/games/${item.game.id}`)}
                    className="w-full text-left cursor-pointer"
                >
                    {/* Teams */}
                    <div className="flex items-center justify-between gap-4 mb-6">

                    {/* Home Team */}
                    <div className="flex flex-col items-center flex-1">
                        {item.game.home_team.logo_url && (
                        <img
                            src={item.game.home_team.logo_url}
                            alt={item.game.home_team.name}
                            className="w-16 h-16 object-contain mb-2"
                        />
                        )}

                        <p className="text-white font-bold text-lg text-center">
                        {item.game.home_team.abbreviation}
                        </p>

                        <p className="text-xs text-gray-400 text-center line-clamp-1">
                        {item.game.home_team.name}
                        </p>
                    </div>

                    {/* VS */}
                    <div className="flex flex-col items-center shrink-0 px-2">
                        <span className="text-gray-500 font-bold text-xl">
                        VS
                        </span>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center flex-1">
                        {item.game.away_team.logo_url && (
                        <img
                            src={item.game.away_team.logo_url}
                            alt={item.game.away_team.name}
                            className="w-16 h-16 object-contain mb-2"
                        />
                        )}

                        <p className="text-white font-bold text-lg text-center">
                        {item.game.away_team.abbreviation}
                        </p>

                        <p className="text-xs text-gray-400 text-center line-clamp-1">
                        {item.game.away_team.name}
                        </p>
                    </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-3 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="w-4 h-4 text-bronze shrink-0" />

                        {new Date(item.game.game_date).toLocaleDateString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        })}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="w-4 h-4 text-bronze shrink-0" />

                        <span className="line-clamp-1">
                        {item.game.arena}
                        </span>
                    </div>
                    </div>
                </button>
                </div>
            ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}