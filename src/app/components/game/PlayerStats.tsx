'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';

export type PlayerGameStats = {
  game_id: string;
  pts?: number; reb?: number; ast?: number; stl?: number; blk?: number;
  min?: number; fgm?: number; fga?: number;
  three_fgm?: number; three_fga?: number;
  ftm?: number; fta?: number; fg_pct?: number;
};

export type Player = {
  id: string; full_name: string; image_url?: string;
  jersey_number?: number; position?: string;
  stats?: PlayerGameStats[];
  avg_rating?: number; total_ratings?: number;
};

type Props = {
  title: string;
  players: Player[];
  gameId: string;
  userId: string;
  refreshLeaderboard: () => Promise<void>;
};

const getRatingColor = (r: number) => {
  if (r <= 2) return { bg: 'bg-red-700',     text: 'text-white', slider: '#b91c1c' };
  if (r <= 4) return { bg: 'bg-red-400',     text: 'text-white', slider: '#f87171' };
  if (r <= 5) return { bg: 'bg-orange-400',  text: 'text-white', slider: '#fb923c' };
  if (r <= 6) return { bg: 'bg-yellow-400',  text: 'text-black', slider: '#facc15' };
  if (r <= 7) return { bg: 'bg-lime-500',    text: 'text-white', slider: '#84cc16' };
  if (r <= 8) return { bg: 'bg-green-500',   text: 'text-white', slider: '#22c55e' };
  if (r <= 9) return { bg: 'bg-emerald-500', text: 'text-white', slider: '#10b981' };
  return       { bg: 'bg-emerald-400',       text: 'text-white', slider: '#34d399' };
};

const getRatingLabel = (r: number) => {
  if (r <= 2) return 'Terrible';
  if (r <= 4) return 'Poor';
  if (r <= 5) return 'Average';
  if (r <= 6) return 'Decent';
  if (r <= 7) return 'Good';
  if (r <= 8) return 'Great';
  if (r <= 9) return 'Excellent';
  return 'Elite';
};

export default function PlayerStats({ title, players, gameId, userId, refreshLeaderboard }: Props) {
  const [openPlayer, setOpenPlayer]     = useState<string | null>(null);
  const [ratings, setRatings]           = useState<Record<string, number>>({});
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [justRated, setJustRated]       = useState<string | null>(null);
  const [loadingPlayer, setLoadingPlayer] = useState<string | null>(null);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!userId || players.length === 0) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const load = async () => {
      setRatingsLoading(true);
      try {
        const ids = players.map(p => p.id).join(',');
        const res = await fetch(
          `/api/player-ratings/batch?user_id=${userId}&game_id=${gameId}&player_ids=${ids}`,
          { signal: controller.signal }
        );
        if (!res.ok || controller.signal.aborted) return;

        const data: Record<string, number | null> = await res.json();

        const ratingsMap: Record<string, number> = {};
        const slidersMap: Record<string, number> = {};
        Object.entries(data).forEach(([pid, rating]) => {
          if (rating != null) {
            ratingsMap[pid] = rating;
            slidersMap[pid] = rating;
          }
        });
        setRatings(ratingsMap);
        setSliderValues(slidersMap);
      } catch (err: any) {
        if (err.name !== 'AbortError') console.error(err);
      } finally {
        if (!controller.signal.aborted) setRatingsLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [players, userId, gameId]);

  const handleSliderChange = (playerId: string, value: number) =>
    setSliderValues(prev => ({ ...prev, [playerId]: value }));

  const handleSubmitRating = async (playerId: string) => {
    try {
      setLoadingPlayer(playerId);
      const rating = sliderValues[playerId] ?? 5;
      const res = await fetch('/api/player-ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, game_id: gameId, player_id: playerId, rating }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit rating');
      setRatings(prev => ({ ...prev, [playerId]: rating }));
      
      await refreshLeaderboard();
      setJustRated(playerId);
      setTimeout(() => setJustRated(null), 1800);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingPlayer(null);
    }
  };

  const handleRemoveRating = async (playerId: string) => {
    try {
      setLoadingPlayer(playerId);
      const res = await fetch(
        `/api/player-ratings?game_id=${gameId}&player_id=${playerId}&user_id=${userId}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove rating');
      setRatings(prev => { const u = { ...prev }; delete u[playerId]; return u; });
      setSliderValues(prev => ({ ...prev, [playerId]: 5 }));
      setJustRated(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingPlayer(null);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="space-y-3">
        {players.map(player => {
          const isOpen         = openPlayer === player.id;
          const submittedRating = ratings[player.id];
          const sliderVal      = sliderValues[player.id] ?? 5;
          const showConfirm    = justRated === player.id;
          const colors         = getRatingColor(sliderVal);
          const submittedColors = submittedRating ? getRatingColor(submittedRating) : null;
          const stats          = player.stats?.[0];
          const sliderId       = `slider-${player.id}`;   // unique id fixes form field warning

          return (
            <div key={player.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
              <button
                onClick={() => setOpenPlayer(isOpen ? null : player.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={player.image_url || 'https://placehold.co/200x200/png'}
                    alt={player.full_name}
                    className="w-14 h-14 rounded-full object-cover border border-white/20"
                  />
                  <div className="text-left">
                    <h3 className="text-white font-semibold">{player.full_name}</h3>
                    <p className="text-white/60 text-sm">#{player.jersey_number} · {player.position}</p>
                    <p className="text-white/80 text-sm mt-1">
                      {stats?.pts ?? '-'} PTS · {stats?.reb ?? '-'} REB · {stats?.ast ?? '-'} AST
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {ratingsLoading && !submittedRating && (
                    <span className="text-white/30 text-xs hidden sm:inline">Loading…</span>
                  )}
                  {!submittedRating && !ratingsLoading && (
                    <span className="text-white/40 text-xs hidden sm:inline">Rate the Player?</span>
                  )}
                  {submittedRating && submittedColors && (
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${submittedColors.bg} ${submittedColors.text}`}>
                      {submittedRating}/10
                    </span>
                  )}
                  <ChevronDown className={`text-white transition duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-white/10 p-4 bg-black/20">
                  {/* Stats grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Stat label="MIN" value={stats?.min} />
                    <Stat label="PTS" value={stats?.pts} />
                    <Stat label="REB" value={stats?.reb} />
                    <Stat label="AST" value={stats?.ast} />
                    <Stat label="STL" value={stats?.stl} />
                    <Stat label="BLK" value={stats?.blk} />
                    <Stat label="FG"  value={`${stats?.fgm ?? '-'}/${stats?.fga ?? '-'}`} />
                    <Stat label="3PT" value={`${stats?.three_fgm ?? '-'}/${stats?.three_fga ?? '-'}`} />
                    <Stat label="FT"  value={`${stats?.ftm ?? '-'}/${stats?.fta ?? '-'}`} />
                    <Stat label="FG%" value={stats?.fg_pct != null ? `${(stats.fg_pct * 100).toFixed(1)}%` : '-'} />
                  </div>

                  {/* Rating section */}
                  <div className="mt-6">
                    {userId ? (
                      <>
                        <p className="text-white font-semibold mb-4">Your Rating</p>
                        {showConfirm ? (
                          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                            <CheckCircle className="w-5 h-5" />
                            Rating{' '}
                            <span className={`px-2 py-0.5 rounded-full text-sm font-bold ml-1 ${getRatingColor(ratings[player.id]).bg} ${getRatingColor(ratings[player.id]).text}`}>
                              {ratings[player.id]}/10
                            </span>{' '}
                            submitted!
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* Score display */}
                            <div className="flex items-center gap-4">
                              <span className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-200 ${colors.bg} ${colors.text}`}>
                                {sliderVal}
                              </span>
                              <div>
                                <p className="font-semibold text-sm transition-colors duration-200" style={{ color: colors.slider }}>
                                  {getRatingLabel(sliderVal)}
                                </p>
                                <p className="text-white/40 text-xs">out of 10</p>
                              </div>
                            </div>

                            <div className="relative">
                              <label htmlFor={sliderId} className="sr-only">
                                Rate {player.full_name}
                              </label>
                              <input
                                id={sliderId}
                                name={sliderId}
                                type="range"
                                min={1} max={10} step={1}
                                value={sliderVal}
                                onChange={e => handleSliderChange(player.id, Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none"
                                style={{
                                  background: `linear-gradient(to right, ${colors.slider} 0%, ${colors.slider} ${((sliderVal - 1) / 9) * 100}%, rgba(255,255,255,0.1) ${((sliderVal - 1) / 9) * 100}%, rgba(255,255,255,0.1) 100%)`,
                                  accentColor: colors.slider,
                                }}
                              />
                              <div className="flex justify-between mt-1 px-0.5">
                                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                  <span key={n} className={`text-[10px] transition-colors duration-200 ${n === sliderVal ? 'text-white font-bold' : 'text-white/30'}`}>
                                    {n}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <button
                                onClick={() => handleSubmitRating(player.id)}
                                disabled={loadingPlayer === player.id}
                                className={`px-6 py-2 cursor-pointer rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 ${colors.bg} ${colors.text} hover:opacity-90 hover:scale-105`}
                              >
                                {loadingPlayer === player.id ? 'Submitting…' : 'Submit Rating'}
                              </button>
                              {submittedRating && (
                                <button
                                  onClick={() => handleRemoveRating(player.id)}
                                  disabled={loadingPlayer === player.id}
                                  className="px-6 py-2 cursor-pointer rounded-xl font-semibold text-sm bg-gray-500 text-white hover:opacity-90 hover:scale-105 transition disabled:opacity-50"
                                >
                                  Remove Rating
                                </button>
                              )}
                            </div>

                            {submittedRating && !showConfirm && (
                              <p className="text-white/40 text-xs">
                                Your last rating: <span className="font-bold text-white">{submittedRating}/10</span>. Adjust and resubmit to change.
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="mt-4">
                        <button
                          className="px-5 cursor-pointer py-2 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition"
                          onClick={() => window.location.href = '/auth/login'}
                        >
                          Sign in to rate
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="bg-white/5 rounded-xl p-3 text-center">
      <p className="text-white/50 text-sm">{label}</p>
      <p className="text-white font-bold text-lg">{value ?? '-'}</p>
    </div>
  );
}