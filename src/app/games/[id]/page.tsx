'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/src/app/components/layout/Navbar';
import { Footer } from '@/src/app/components/layout/Footer';
import { Player } from '@/src/app/components/game/PlayerStats';
import PlayerStats from '@/src/app/components/game/PlayerStats';
import { createClient } from '@/src/app/lib/supabase/client';
import {
  Star, Flame, Clock, ArrowLeft, BookmarkPlus,
  CheckCircle, MessageSquare, Calendar, MapPin,
  Trophy, Send, User, Loader2, Heart, X
} from 'lucide-react';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';
import { Button } from '@/src/app/components/ui/Button';

const BasketballIcon = createLucideIcon('Basketball', basketball);
const supabase = createClient();

type Team = {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  logo_url?: string;
  players?: Player[];
};

type Game = {
  id: string;
  home_team: Team;
  away_team: Team;
  home_score?: number;
  away_score?: number;
  game_date: string;
  season: string;
  arena: string;
  status: string;
  rating?: number | null;
  review_count?: number | null;
};

type Review = {
  id: string;
  user_id: string;
  user: {
    id: string;
    display_name: string;
    avatar_url?: string;
    username?: string;
  };
  rating: number;
  review_text: string;
  likes_count: number;
  created_at: string;
  liked_by_me?: boolean;
};

type Profile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
};

type LeaderboardEntry = {
  player_id: string;
  full_name: string;
  image_url?: string;

  team_id: string;
  team_name: string;
  team_logo_url?: string;

  avg_rating: number;
  total_ratings: number;
};

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
  useEffect(() => {
    if (!user || reviews.length === 0) return;

    const myReview = reviews.find((r) => r.user_id === user.id);

    if (myReview) {
      setExistingReview(myReview);
      setReviewText(myReview.review_text);
      setReviewRating(myReview.rating);
    }
  }, [user, reviews]);
  const fetchReviews = async () => {
    const res = await fetch(`/api/games/${gameId}/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');

    const data = await res.json();
    setReviews(data);
  };
  const handleWatchlist = async () => {
    if (!user || !game) {
      router.push('/auth/login');
      return;
    }

    try {
      // find existing watchlist
      let { data: watchlist, error: watchlistError } = await supabase
        .from('lists')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'watchlist')
        .single();

      // create watchlist if not exists
      if (watchlistError || !watchlist) {
        const { data: newWatchlist, error: createError } = await supabase
          .from('lists')
          .insert({
            user_id: user.id,
            title: 'My Watchlist',
            description: 'Games I want to watch',
            type: 'watchlist',
            is_public: false,
          })
          .select('id')
          .single();

        if (createError) throw createError;

        watchlist = newWatchlist;
      }

      // already watchlisted -> remove
      if (isWatchlisted) {
        const { error } = await supabase
          .from('list_games')
          .delete()
          .eq('list_id', watchlist.id)
          .eq('game_id', game.id);

        if (error) throw error;

        setIsWatchlisted(false);
        return;
      }

      // add to watchlist
      const { error } = await supabase
        .from('list_games')
        .insert({
          list_id: watchlist.id,
          game_id: game.id,
        });

      if (error) throw error;

      setIsWatchlisted(true);

    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);

        // Fetch game
        const gameRes = await fetch(`/api/games/${gameId}`);
        if (!gameRes.ok) throw new Error('Game not found');
        const gameData = await gameRes.json();
        setGame(gameData);

        // Fetch reviews
        const reviewsRes = await fetch(`/api/games/${gameId}/reviews`);
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
        }

        // Fetch auth user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const profileRes = await fetch(`/api/users/${user.id}`);
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setProfile(profileData);
          }
        }
        
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [gameId]);

  // Fetch leaderboard separately 
  useEffect(() => {
    if (!gameId) return;

    const fetchLeaderboard = async () => {
      setLeaderboardLoading(true);
      setLeaderboardError(null);
      try {
        const res = await fetch(`/api/games/${gameId}/leaderboard?limit=5`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch leaderboard');
        setLeaderboard(data);
      } catch (err: any) {
        setLeaderboardError(err.message);
      } finally {
        setLeaderboardLoading(false);
      }
    };

    fetchLeaderboard();
  }, [gameId]);

  const handleDeleteReview = async (review: Review) => {
    if (!user) return;

    const reviewId = review.id;

    const prevReviews = reviews;
    setReviews(prev => prev.filter(r => r.id !== reviewId));

    try {
      const res = await fetch(`/api/games/${gameId}/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete review');

      if (existingReview?.id === reviewId) {
        setExistingReview(null);
        setReviewText('');
        setReviewRating(0);
      }
    } catch (err) {
      console.error(err);
      setReviews(prevReviews);
    } finally {
      setShowDeleteModal(false);
      setReviewToDelete(null);
    }
  };
  const handleLikeReview = async (reviewId: string) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    const nextAction = review.liked_by_me ? 'unlike' : 'like';

    // optimistic UI
    setReviews(prev =>
      prev.map(r =>
        r.id === reviewId
          ? {
              ...r,
              liked_by_me: !r.liked_by_me,
              likes_count: r.liked_by_me
                ? Math.max(0, r.likes_count - 1)
                : r.likes_count + 1,
            }
          : r
      )
    );

    try {
      const res = await fetch(`/api/games/${gameId}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: nextAction }),
      });

      if (!res.ok) throw new Error('Failed to update like');

      const data = await res.json();

      // sync backend truth (important)
      setReviews(prev =>
        prev.map(r =>
          r.id === reviewId
            ? {
                ...r,
                likes_count: data.likes_count ?? r.likes_count,
              }
            : r
        )
      );
    } catch (err) {
      // rollback
      setReviews(prev =>
        prev.map(r =>
          r.id === reviewId
            ? {
                ...r,
                liked_by_me: review.liked_by_me,
              }
            : r
        )
      );
    }
  };
  const handleSubmitReview = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!reviewText.trim()) return;

    try {
      setSubmitting(true);

      const method = isEditing ? 'PATCH' : 'POST';
      const url = isEditing
        ? `/api/games/${gameId}/reviews/${existingReview?.id}`
        : `/api/games/${gameId}/reviews`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewRating,
          review_text: reviewText.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit review');
      }

      const saved = await res.json();

      await fetchReviews();

      setIsEditing(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    const checkWatchlist = async () => {
      if (!user || !game) return;

      const { data: watchlist } = await supabase
        .from('lists')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'watchlist')
        .single();

      if (!watchlist) return;

      const { data } = await supabase
        .from('list_games')
        .select('*')
        .eq('list_id', watchlist.id)
        .eq('game_id', game.id)
        .maybeSingle();

      setIsWatchlisted(!!data);
    };

    checkWatchlist();
  }, [user, game]);
  const getStatusBadge = () => {
    if (!game) return null;
    switch (game.status) {
      case 'closed':
      case 'final':
        return <span className="bg-amethyst px-3 py-1 rounded-full text-xs font-bold">FINAL</span>;
      case 'halftime':
        return <span className="bg-yellow-600 px-3 py-1 rounded-full text-xs font-bold">HALFTIME</span>;
      case 'live':
      case '1st': case '2nd': case '3rd': case '4th':
        return <span className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">LIVE</span>;
      default:
        return <span className="bg-plum px-3 py-1 rounded-full text-xs font-bold">UPCOMING</span>;
    }
  };

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

  if (error || !game) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">{error || 'Game not found'}</h1>
          <Button onClick={() => router.push('/')}>Go Back Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const rankStyle = (index: number) => {
    if (index === 0) return 'bg-yellow-500 text-black';
    if (index === 1) return 'bg-gray-400 text-black';
    if (index === 2) return 'bg-amber-700 text-white';
    return 'bg-white/10 text-white/60';
  };
  const myReview = user ? reviews.find(r => r.user_id === user.id) : null;

  const communityReviews = user ? reviews.filter(r => r.user_id !== user.id) : reviews;
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pb-16">

        {/* Back button */}
        <div className="container-custom mt-6">
          <button onClick={() => router.back()} className="cursor-pointer flex items-center gap-2 text-gray-400 hover:text-bronze transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>

        {/* Score card */}
        <div className="container-custom">
          <div className="bg-linear-to-br from-amethyst/20 to-plum/20 rounded-2xl p-8 border border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                {getStatusBadge()}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleWatchlist}
                  className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-sm transition-all ${isWatchlisted ? 'bg-bronze text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                >
                  <BookmarkPlus className="w-4 h-4" />
                  {isWatchlisted ? 'Watchlisted' : 'Watchlist'}
                </button>
                <button
                  onClick={() => setIsWatched(!isWatched)}
                  className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-sm transition-all ${isWatched ? 'bg-bronze text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {isWatched ? 'Watched' : 'Mark Watched'}
                </button>
              </div>
            </div>

            {/* Scoreboard */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-8 md:gap-12">
                <div className="flex flex-col items-center gap-2">
                  {game.home_team.logo_url && (
                    <img src={game.home_team.logo_url} alt={game.home_team.name} className="w-16 h-16 object-contain" />
                  )}
                  <div className="text-xl md:text-3xl font-bold text-white">{game.home_team.name}</div>
                  <div className="text-sm text-gray-400">{game.home_team.city}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-5xl md:text-6xl font-bold text-bronze">{game.home_score ?? '?'}</div>
                  <div className="text-2xl font-bold text-gray-500">VS</div>
                  <div className="text-5xl md:text-6xl font-bold text-magenta">{game.away_score ?? '?'}</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  {game.away_team.logo_url && (
                    <img src={game.away_team.logo_url} alt={game.away_team.name} className="w-16 h-16 object-contain" />
                  )}
                  <div className="text-xl md:text-3xl font-bold text-white">{game.away_team.name}</div>
                  <div className="text-sm text-gray-400">{game.away_team.city}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Calendar className="w-4 h-4 text-bronze" />
                {new Date(game.game_date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="w-4 h-4 text-bronze" />
                {new Date(game.game_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-bronze" />
                {game.arena}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <BasketballIcon className="w-4 h-4 text-bronze" />
                {game.season}
              </div>
            </div>
          </div>
        </div>


        {myReview && (
          <div className="container-custom mt-8">
            <div className="bg-linear-to-br from-bronze/20 to-plum/20 rounded-2xl p-6 border border-bronze/30">
              
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-bronze" />
                <h2 className="text-lg font-bold text-white">Your Review</h2>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">

                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= myReview.rating
                            ? 'text-bronze fill-bronze'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-white/30 text-xs">
                    {new Date(myReview.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Text */}
                <p className="text-white/80 text-sm leading-relaxed">
                  {myReview.review_text}
                </p>

                <div className="flex items-center justify-between mt-4">

                  <button
                    onClick={() => handleLikeReview(myReview.id)}
                    className={`flex items-center gap-1.5 text-sm transition cursor-pointer ${
                      myReview.liked_by_me
                        ? 'text-red-400'
                        : 'text-white/40 hover:text-red-400'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        myReview.liked_by_me ? 'fill-red-400' : ''
                      }`}
                    />
                    <span>{myReview.likes_count}</span>
                  </button>

                  <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setExistingReview(myReview);
                          setIsEditing(true);
                          setReviewText(myReview.review_text);
                          setReviewRating(myReview.rating);
                          setShowReviewModal(true);
                        }}
                        className="text-sm text-bronze hover:text-orange-300 cursor-pointer"
                      >
                        Edit
                      </button>
                    {/* Delete */}
                    <button
                      onClick={() => {
                        setReviewToDelete(myReview);
                        setShowDeleteModal(true);
                      }}
                      className="text-sm text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!myReview && (
          <div className="container-custom mt-8">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-4">
              <div>
                <p className="text-white font-semibold">
                  Share your thoughts about this game
                </p>

                <p className="text-white/50 text-sm">
                  Rate the game and help the community
                </p>
              </div>
              
              <Button
                variant="primary"
                onClick={() => {
                  if (!user) {
                    router.push('/auth/login');
                    return;
                  }

                  setExistingReview(null);
                  setIsEditing(false);
                  setReviewText('');
                  setReviewRating(0);

                  setShowReviewModal(true);
                }}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Write Review
              </Button>
            </div>
          </div>
        )}
        {/* Community Reviews */}
        <div className="container-custom mt-8">
          <div className="bg-linear-to-br from-amethyst/20 to-plum/20 rounded-2xl p-6 border border-white/10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-bronze" />
                  <h2 className="text-2xl font-bold text-white">Community Reviews</h2>

                  {reviews.length > 0 && (
                    <span className="bg-bronze/30 text-bronze text-sm px-2.5 py-0.5 rounded-full font-semibold">
                      {reviews.length}
                    </span>
                  )}
                </div>

                {reviews.length > 1 && (
                  <button
                    onClick={() => router.push(`/games/${gameId}/reviews`)}
                    className="text-sm text-bronze hover:text-orange-300 cursor-pointer"
                  >
                    View all reviews
                  </button>
                )}
              </div>
            {submitted && (
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-4 bg-emerald-500/10 rounded-xl p-3">
                <CheckCircle className="w-5 h-5" /> Your review was posted!
              </div>
            )}
            {communityReviews.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No reviews yet. Be the first to review this game!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {communityReviews.map((review) => (
                  <div key={review.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-linear-to-br from-magenta to-plum w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {review.user.display_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{review.user.display_name}</p>
                          <p className="text-white/40 text-xs">@{review.user.username}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {review.rating > 0 && (
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-bronze fill-bronze' : 'text-white/20'}`} />
                            ))}
                          </div>
                        )}
                        <span className="text-white/30 text-xs">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">{review.review_text}</p>
                    <div className="flex items-center justify-between mt-4">
                      {/* Like button (left) */}
                      <button
                        onClick={() => handleLikeReview(review.id)}
                        className={`flex items-center gap-1.5 text-sm transition ${
                          review.liked_by_me
                            ? 'text-red-400'
                            : 'text-white/40 hover:text-red-400'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            review.liked_by_me ? 'fill-red-400' : ''
                          }`}
                        />
                        <span>{review.likes_count}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="container-custom mt-8">
          <div className="bg-linear-to-br from-magenta/20 to-plum/20 rounded-2xl p-6 border border-magenta/30">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-bronze" />
              <h3 className="text-lg font-bold text-white">Top Rated Players</h3>
              {!leaderboardLoading && leaderboard.length > 0 && (
                <span className="bg-bronze/30 text-bronze text-sm px-2.5 py-0.5 rounded-full font-semibold">
                  {leaderboard.length}
                </span>
              )}
            </div>

            {leaderboardLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-white/50">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading leaderboard…</span>
              </div>
            ) : leaderboardError ? (
              <div className="text-center py-8 text-red-400 text-sm">
                Failed to load leaderboard: {leaderboardError}
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
                No ratings yet for this game.
              </div>
            ) : (
            <ul className="space-y-2">
              {leaderboard.map((entry, index) => (
                <li
                  key={`${entry.player_id}-${index}`}
                  className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10"
                >
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${rankStyle(index)}`}>
                    {index + 1}
                  </span>
                  {entry.image_url && (
                    <img
                      src={entry.image_url}
                      alt={entry.full_name}
                      className="w-8 h-8 rounded-full object-cover bg-white/10"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{entry.full_name}</p>
                    <p className="text-white/40 text-xs truncate">{entry.team_name}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-3.5 h-3.5 text-bronze fill-bronze" />
                    <span className="text-bronze font-bold tabular-nums">{entry.avg_rating.toFixed(1)}</span>
                  </div>
                </li>
              ))}
            </ul>
            )}
          </div>
        </div>

        {/* Player Stats */}
        <div className="container-custom mt-10 space-y-8">
          {game.home_team.players && (
            <PlayerStats
              title={`${game.home_team.name} Players`}
              players={game.home_team.players}
              gameId={game.id}
              userId={user?.id || ''}
            />
          )}
          {game.away_team.players && (
            <PlayerStats
              title={`${game.away_team.name} Players`}
              players={game.away_team.players}
              gameId={game.id}
              userId={user?.id || ''}
            />
          )}
        </div>

      </main>
      {showReviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowReviewModal(false)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-linear-to-br from-amethyst to-plum rounded-2xl border border-white/20 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-4">
              {isEditing ? 'Update Your Review' : 'Write a Review'}
            </h2>

            <div className="space-y-5">

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Rating
                </label>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating
                            ? 'text-bronze fill-bronze'
                            : 'text-white/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {reviewRating > 0 && (
                  <p className="text-bronze text-sm mt-2">
                    {reviewRating}/5 selected
                  </p>
                )}
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Review
                </label>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this game..."
                  rows={4}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-bronze resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="primary"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={handleSubmitReview}
                  disabled={!reviewText.trim() || submitting}
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting
                    ? isEditing
                      ? 'Updating…'
                      : 'Posting…'
                    : isEditing
                      ? 'Update Review'
                      : 'Post Review'}
                </Button>

                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => {
                    setShowReviewModal(false);
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && reviewToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-linear-to-br from-amethyst to-plum rounded-2xl border border-white/20 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold text-white mb-2">
              Delete Review?
            </h2>

            <p className="text-white/60 text-sm mb-6">
              This action cannot be undone. Your review will be permanently removed.
            </p>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                className="flex-1 bg-red-500 hover:bg-red-600"
                onClick={() => handleDeleteReview(reviewToDelete)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}