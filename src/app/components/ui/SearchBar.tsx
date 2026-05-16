'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, User, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';
import { Game } from '@/src/app/types/index'

const BasketballIcon = createLucideIcon('Basketball', basketball);

const DEBOUNCE_MS = 300;

type Profile = {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
};

type Review = {
    id: string;
    review_text: string;
    rating: number;
    created_at: string;
    user: { id: string; username: string; display_name: string; avatar_url?: string };
    game: {
        id: string;
        home_team: { name: string; abbreviation: string };
        away_team: { name: string; abbreviation: string };
    };
};

type SearchResults = {
    games: Game[];
    profiles: Profile[];
    reviews: Review[];
};

interface SearchBarProps {
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Search games, players, reviews...",
}) => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
        return () => clearTimeout(t);
    }, [query]);

    useEffect(() => {
        if (debouncedQuery.length < 2) {
            setResults(null);
            setOpen(false);
            return;
        }

        let cancelled = false;
        const fetch_ = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
                if (!res.ok) throw new Error();
                const data: SearchResults = await res.json();
                if (!cancelled) {
                    setResults(data);
                    setOpen(true);
                }
            } catch {
                if (!cancelled) setResults(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetch_();
        return () => { cancelled = true; };
    }, [debouncedQuery]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const clear = () => {
        setQuery('');
        setResults(null);
        setOpen(false);
        inputRef.current?.focus();
    };

    const navigate = (path: string) => {
        setOpen(false);
        setQuery('');
        setResults(null);
        router.push(path);
    };

    const hasResults = results && (
        results.games.length > 0 ||
        results.profiles.length > 0 ||
        results.reviews.length > 0
    );

    return (
        <div ref={containerRef} className="relative">
            {/* Input */}
            <div className="relative group">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results && setOpen(true)}
                    placeholder={placeholder}
                    className="w-80 px-4 py-2 pl-11 pr-9 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-magenta focus:ring-1 focus:ring-magenta transition-all"
                />
                {loading
                    ? <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-magenta animate-spin" />
                    : <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-magenta transition-colors" />
                }
                {query && (
                    <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-full mt-2 w-[420px] right-0 bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                    {!hasResults ? (
                        <div className="px-4 py-8 text-center text-gray-400 text-sm">
                            No results for "{debouncedQuery}"
                        </div>
                    ) : (
                        <div className="max-h-[480px] overflow-y-auto divide-y divide-white/5">

                            {/* Games */}
                            {results.games.length > 0 && (
                                <section>
                                    <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                                        <BasketballIcon className="w-3.5 h-3.5 text-bronze" />
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Games</span>
                                    </div>
                                    {results.games.map((game) => (
                                        <button
                                            key={game.id}
                                            onClick={() => navigate(`/games/${game.id}`)}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition text-left"
                                        >
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                {game.home_team.logo_url && (
                                                    <img src={game.home_team.logo_url} alt={game.home_team.abbreviation} className="w-6 h-6 object-contain" />
                                                )}
                                                {game.away_team.logo_url && (
                                                    <img src={game.away_team.logo_url} alt={game.away_team.abbreviation} className="w-6 h-6 object-contain" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">
                                                    {game.home_team.name} vs {game.away_team.name}
                                                </p>
                                                <p className="text-gray-400 text-xs truncate">
                                                    {game.arena} · {new Date(game.game_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {(game.home_score != null && game.away_score != null) && (
                                                <span className="text-xs font-bold text-bronze shrink-0">
                                                    {game.home_score}–{game.away_score}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </section>
                            )}

                            {/* Profiles */}
                            {results.profiles.length > 0 && (
                                <section>
                                    <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                                        <User className="w-3.5 h-3.5 text-magenta" />
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">People</span>
                                    </div>
                                    {results.profiles.map((profile) => (
                                        <button
                                            key={profile.id}
                                            onClick={() => navigate(`/profile/${profile.id}`)}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition text-left"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-magenta to-plum flex items-center justify-center shrink-0 overflow-hidden">
                                                {profile.avatar_url
                                                    ? <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
                                                    : <span className="text-white text-xs font-bold">{profile.display_name?.charAt(0).toUpperCase()}</span>
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{profile.display_name}</p>
                                                <p className="text-gray-400 text-xs truncate">@{profile.username}</p>
                                            </div>
                                        </button>
                                    ))}
                                </section>
                            )}

                            {/* Reviews */}
                            {results.reviews.length > 0 && (
                                <section>
                                    <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                                        <Star className="w-3.5 h-3.5 text-bronze" />
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Reviews</span>
                                    </div>
                                    {results.reviews.map((review) => (
                                        <button
                                            key={review.id}
                                            onClick={() => navigate(`/games/${review.game.id}`)}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition text-left"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amethyst to-plum flex items-center justify-center shrink-0 overflow-hidden">
                                                {review.user.avatar_url
                                                    ? <img src={review.user.avatar_url} alt={review.user.display_name} className="w-full h-full object-cover" />
                                                    : <span className="text-white text-xs font-bold">{review.user.display_name?.charAt(0).toUpperCase()}</span>
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">
                                                    {review.game.home_team.abbreviation} vs {review.game.away_team.abbreviation}
                                                </p>
                                                <p className="text-gray-400 text-xs truncate">
                                                    @{review.user.username}: "{review.review_text}"
                                                </p>
                                            </div>
                                            {review.rating > 0 && (
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <Star className="w-3 h-3 text-bronze fill-bronze" />
                                                    <span className="text-xs text-bronze font-bold">{review.rating}</span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </section>
                            )}

                            {/* View all link */}
                            <div className="px-4 py-3">
                                <button
                                    onClick={() => navigate(`/search?q=${encodeURIComponent(debouncedQuery)}`)}
                                    className="w-full text-center text-sm text-bronze hover:text-magenta transition"
                                >
                                    View all results for "{debouncedQuery}"
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};