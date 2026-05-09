'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Player } from '@/app/data/Samples';

type Props = {
  title: string;
  players: Player[];
};

export default function PlayerStats({
  title,
  players,
}: Props) {
  const [openPlayer, setOpenPlayer] =
    useState<string | null>(null);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        {title}
      </h2>

      <div className="space-y-3">
        {players.map((player) => {
          const isOpen =
            openPlayer === player.id;

          return (
            <div
              key={player.id}
              className="bg-white/5 rounded-xl overflow-hidden border border-white/10"
            >
              <button
                onClick={() =>
                  setOpenPlayer(
                    isOpen
                      ? null
                      : player.id
                  )
                }
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      player.image_url ||
                      'https://placehold.co/200x200/png'
                    }
                    alt={player.full_name}
                    className="w-14 h-14 rounded-full object-cover border border-white/20"
                  />

                  <div className="text-left">
                    <h3 className="text-white font-semibold">
                      {player.full_name}
                    </h3>

                    <p className="text-white/60 text-sm">
                      #{player.jersey_number} •{' '}
                      {player.position}
                    </p>

                    <p className="text-white/80 text-sm mt-1">
                      {player.pts} PTS •{' '}
                      {player.reb} REB •{' '}
                      {player.ast} AST
                    </p>
                  </div>
                </div>

                <ChevronDown
                  className={`text-white transition duration-300 ${
                    isOpen
                      ? 'rotate-180'
                      : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-white/10 p-4 bg-black/20">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Stat
                      label="MIN"
                      value={player.minutes}
                    />

                    <Stat
                      label="PTS"
                      value={player.pts}
                    />

                    <Stat
                      label="REB"
                      value={player.reb}
                    />

                    <Stat
                      label="AST"
                      value={player.ast}
                    />

                    <Stat
                      label="STL"
                      value={player.stl}
                    />

                    <Stat
                      label="BLK"
                      value={player.blk}
                    />

                    <Stat
                      label="FG"
                      value={`${player.fgm}/${player.fga}`}
                    />

                    <Stat
                      label="3PT"
                      value={`${player.three_fgm}/${player.three_fga}`}
                    />

                    <Stat
                      label="FT"
                      value={`${player.ftm}/${player.fta}`}
                    />

                    <Stat
                      label="FG%"
                      value={`${player.fg_percent}%`}
                    />
                  </div>

                  <div className="mt-6">
                    <p className="text-white font-semibold mb-3">
                      Community Grade
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      {[
                        'A+',
                        'A',
                        'B+',
                        'B',
                        'C',
                        'D',
                        'F',
                      ].map((grade) => (
                        <button
                          key={grade}
                          className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-bronze transition"
                        >
                          {grade}
                        </button>
                      ))}
                    </div>
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

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-3 text-center">
      <p className="text-white/50 text-sm">
        {label}
      </p>

      <p className="text-white font-bold text-lg">
        {value ?? '-'}
      </p>
    </div>
  );
}