'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/src/app/components/layout/Navbar';
import { Footer } from '@/src/app/components/layout/Footer';
import { sampleGames } from '@/src/app/data/Samples';
import PlayerStats from '@/app/components/game/PlayerStats';
import { useAuth } from '@/app/context/AuthContext';
import {
  Star, Flame, Clock, ArrowLeft, BookmarkPlus,
  CheckCircle, MessageSquare, Calendar, MapPin,
  Trophy, Send, User,
} from 'lucide-react';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';
import { Button } from '@/src/app/components/ui/Button';

const BasketballIcon = createLucideIcon('Basketball', basketball);

type Review = {
  id: string;
  username: string;
  name: string;
  rating: number;
  text: string;
  createdAt: string;
};

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const gameId = params.id as string;
  const game = sampleGames.find((g) => g.id === gameId);

  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!game) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Game not found</h1>
          <Button onClick={() => router.push('/')}>Go Back Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmitReview = () => {
    if (!user) { router.push('/auth/login'); return; }
    if (!reviewText.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      username: user.username,
      name: user.name,
      rating: reviewRating,
      text: reviewText.trim(),
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    setReviewText('');
    setReviewRating(0);
    setShowReviewForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const getStatusBadge = () => {
    switch (game.status) {
      case 'final':
        return <span className="bg-amethyst px-3 py-1 rounded-full text-xs font-bold">FINAL</span>;
      case 'halftime':
        return <span className="bg-yellow-600 px-3 py-1 rounded-full text-xs font-bold">HALFTIME</span>;
      case '1st': case '2nd': case '3rd': case '4th':
        return <span className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">LIVE {game.period}</span>;
      default:
        return <span className="bg-plum px-3 py-1 rounded-full text-xs font-bold">UPCOMING</span>;
    }
  };

  const alreadyReviewed = user && reviews.some((r) => r.username === user.username);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pb-16">

        {/* Back button */}
        <div className="container-custom mt-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-bronze transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>

        {/* Score card */}
        <div className="container-custom">
          <div className="bg-gradient-to-br from-amethyst/20 to-plum/20 rounded-2xl p-8 border border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                {getStatusBadge()}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-bronze fill-bronze" />
                  <span className="text-sm">{game.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">{game.watchability}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsWatchlisted(!isWatchlisted)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${isWatchlisted ? 'bg-bronze text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                >
                  <BookmarkPlus className="w-4 h-4" />
                  {isWatchlisted ? 'Watchlisted' : 'Watchlist'}
                </button>
                <button
                  onClick={() => setIsWatched(!isWatched)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${isWatched ? 'bg-bronze text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {isWatched ? 'Watched' : 'Mark Watched'}
                </button>
              </div>
            </div>

            {/* Scoreboard with logos */}
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

        {/* Write a Review */}
        <div className="container-custom mt-8">
          {!showReviewForm ? (
            <Button
              variant="primary"
              className="w-full py-4 text-lg"
              onClick={() => {
                if (!user) { router.push('/auth/login'); return; }
                setShowReviewForm(true);
              }}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              {alreadyReviewed ? 'Write Another Review' : 'Write a Review'}
            </Button>
          ) : (
            <div className="bg-gradient-to-br from-amethyst/20 to-plum/20 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/10 p-2 rounded-full">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{user?.name}</p>
                  <p className="text-white/50 text-xs">@{user?.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-4">
                <span className="text-white/60 text-sm mr-2">Your rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setReviewRating(star)}
                    className="transition-transform hover:scale-125"
                  >
                    <Star className={`w-6 h-6 transition-colors ${star <= (hoverRating || reviewRating) ? 'text-bronze fill-bronze' : 'text-white/30'}`} />
                  </button>
                ))}
                {reviewRating > 0 && <span className="text-bronze text-sm ml-1">{reviewRating}/5</span>}
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts on this game..."
                rows={4}
                className="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder:text-white/40 outline-none focus:border-bronze transition resize-none"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSubmitReview}
                  disabled={!reviewText.trim()}
                  className="flex items-center gap-2 bg-bronze hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-semibold transition"
                >
                  <Send className="w-4 h-4" /> Post Review
                </button>
                <button
                  onClick={() => { setShowReviewForm(false); setReviewText(''); setReviewRating(0); }}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Community Reviews */}
        <div className="container-custom mt-8">
          <div className="bg-gradient-to-br from-amethyst/20 to-plum/20 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-6 h-6 text-bronze" />
              <h2 className="text-2xl font-bold text-white">Community Reviews</h2>
              {reviews.length > 0 && (
                <span className="bg-bronze/30 text-bronze text-sm px-2.5 py-0.5 rounded-full font-semibold">{reviews.length}</span>
              )}
            </div>

            {submitted && (
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-4 bg-emerald-500/10 rounded-xl p-3">
                <CheckCircle className="w-5 h-5" /> Your review was posted!
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No reviews yet. Be the first to review this game!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-magenta to-plum w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{review.name}</p>
                          <p className="text-white/40 text-xs">@{review.username}</p>
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
                        <span className="text-white/30 text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Performer */}
        {game.top_scorer && (
          <div className="container-custom mt-8">
            <div className="bg-gradient-to-br from-magenta/20 to-plum/20 rounded-2xl p-6 border border-magenta/30">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-bronze" />
                <h3 className="text-lg font-bold text-white">Top Performer</h3>
              </div>
              <p className="text-bronze font-semibold">{game.top_scorer}</p>
            </div>
          </div>
        )}

        {/* Player Stats */}
        <div className="container-custom mt-10 space-y-8">
          {game.home_players && <PlayerStats title={`${game.home_team.name} Players`} players={game.home_players} />}
          {game.away_players && <PlayerStats title={`${game.away_team.name} Players`} players={game.away_players} />}
        </div>

      </main>
      <Footer />
    </div>
  );
}