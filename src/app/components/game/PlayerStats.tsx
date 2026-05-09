'use client';

import { useState } from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';
import type { Player } from '@/src/app/data/Samples';

type Props = {
  title: string;
  players: Player[];
};

const getRatingColor = (rating: number) => {
  if (rating <= 2) return { bg: 'bg-red-700', text: 'text-white', slider: '#b91c1c' };
  if (rating <= 4) return { bg: 'bg-red-400', text: 'text-white', slider: '#f87171' };
  if (rating <= 5) return { bg: 'bg-orange-400', text: 'text-white', slider: '#fb923c' };
  if (rating <= 6) return { bg: 'bg-yellow-400', text: 'text-black', slider: '#facc15' };
  if (rating <= 7) return { bg: 'bg-lime-500', text: 'text-white', slider: '#84cc16' };
  if (rating <= 8) return { bg: 'bg-green-500', text: 'text-white', slider: '#22c55e' };
  if (rating <= 9) return { bg: 'bg-emerald-500', text: 'text-white', slider: '#10b981' };
  return { bg: 'bg-emerald-400', text: 'text-white', slider: '#34d399' };
};

const getRatingLabel = (rating: number) => {
  if (rating <= 2) return 'Terrible';
  if (rating <= 4) return 'Poor';
  if (rating <= 5) return 'Average';
  if (rating <= 6) return 'Decent';
  if (rating <= 7) return 'Good';
  if (rating <= 8) return 'Great';
  if (rating <= 9) return 'Excellent';
  return 'Elite';
};

export default function PlayerStats({ title, players }: Props) {
  const [openPlayer, setOpenPlayer] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [justRated, setJustRated] = useState<string | null>(null);

  const handleSliderChange = (playerId: string, value: number) => {
    setSliderValues((prev) => ({ ...prev, [playerId]: value }));
  };

  const handleSubmitRating = (playerId: string) => {
    const value = sliderValues[playerId] ?? 5;
    setRatings((prev) => ({ ...prev, [playerId]: value }));
    setJustRated(playerId);
    setTimeout(() => setJustRated(null), 1800);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>

      <div className="space-y-3">
        {players.map((player) => {
          const isOpen = openPlayer === player.id;
          const submittedRating = ratings[player.id];
          const sliderVal = sliderValues[player.id] ?? 5;
          const showConfirm = justRated === player.id;
          const colors = getRatingColor(sliderVal);
          const submittedColors = submittedRating ? getRatingColor(submittedRating) : null;

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
                    <p className="text-white/60 text-sm">#{player.jersey_number} • {player.position}</p>
                    <p className="text-white/80 text-sm mt-1">
                      {player.pts} PTS • {player.reb} REB • {player.ast} AST
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* "Rate the Player?" hint */}
                  {!submittedRating && (
                    <span className="text-white/20 text-xs hidden sm:inline">Rate the Player?</span>
                  )}
                  {submittedRating && submittedColors && (
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${submittedColors.bg} ${submittedColors.text}`}>
                      {submittedRating}/10
                    </span>
                  )}
                  <ChevronDown
                    className={`text-white transition duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-white/10 p-4 bg-black/20">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Stat label="MIN" value={player.minutes} />
                    <Stat label="PTS" value={player.pts} />
                    <Stat label="REB" value={player.reb} />
                    <Stat label="AST" value={player.ast} />
                    <Stat label="STL" value={player.stl} />
                    <Stat label="BLK" value={player.blk} />
                    <Stat label="FG" value={`${player.fgm}/${player.fga}`} />
                    <Stat label="3PT" value={`${player.three_fgm}/${player.three_fga}`} />
                    <Stat label="FT" value={`${player.ftm}/${player.fta}`} />
                    <Stat label="FG%" value={`${player.fg_percent}%`} />
                  </div>

                  <div className="mt-6">
                    <p className="text-white font-semibold mb-4">Community Rating</p>

                    {showConfirm ? (
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                        <CheckCircle className="w-5 h-5" />
                        Rating <span className={`px-2 py-0.5 rounded-full text-sm font-bold ml-1 ${getRatingColor(ratings[player.id]).bg} ${getRatingColor(ratings[player.id]).text}`}>{ratings[player.id]}/10</span> submitted!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Score display */}
                        <div className="flex items-center gap-4">
                          <span
                            className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-200 ${colors.bg} ${colors.text}`}
                          >
                            {sliderVal}
                          </span>
                          <div>
                            <p className={`font-semibold text-sm transition-colors duration-200`} style={{ color: colors.slider }}>
                              {getRatingLabel(sliderVal)}
                            </p>
                            <p className="text-white/40 text-xs">out of 10</p>
                          </div>
                        </div>

                        {/* Slider */}
                        <div className="relative">
                          <input
                            type="range"
                            min={1}
                            max={10}
                            step={1}
                            value={sliderVal}
                            onChange={(e) => handleSliderChange(player.id, Number(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none"
                            style={{
                              background: `linear-gradient(to right, ${colors.slider} 0%, ${colors.slider} ${(sliderVal - 1) / 9 * 100}%, rgba(255,255,255,0.1) ${(sliderVal - 1) / 9 * 100}%, rgba(255,255,255,0.1) 100%)`,
                              accentColor: colors.slider,
                            }}
                          />
                          {/* Tick labels */}
                          <div className="flex justify-between mt-1 px-0.5">
                            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                              <span key={n} className={`text-[10px] transition-colors duration-200 ${n === sliderVal ? 'text-white font-bold' : 'text-white/30'}`}>
                                {n}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => handleSubmitRating(player.id)}
                          className={`px-6 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${colors.bg} ${colors.text} hover:opacity-90 hover:scale-105`}
                        >
                          Submit Rating
                        </button>

                        {submittedRating && !showConfirm && (
                          <p className="text-white/40 text-xs">
                            Your last rating: <span className="font-bold text-white">{submittedRating}/10</span> — adjust and resubmit to change
                          </p>
                        )}
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