'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/src/app/components/layout/Navbar';
import { Footer } from '@/src/app/components/layout/Footer';
import { createClient } from '@/src/app/lib/supabase/client';
import { ArrowLeft, MessageSquare, Star, Heart } from 'lucide-react';

const supabase = createClient();

type Review = {
  id: string;
  user_id: string;
  user: {
    display_name: string;
    username?: string;
  };
  rating: number;
  review_text: string;
  likes_count: number;
  created_at: string;
  liked_by_me?: boolean;
};

export default function GameReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const { data: auth } = await supabase.auth.getUser();
      setUser(auth.user);

      const res = await fetch(`/api/games/${gameId}/reviews`);
      const data = await res.json();
      setReviews(data);

      setLoading(false);
    };

    init();
  }, [gameId]);

  const handleLike = async (reviewId: string) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    const action = review.liked_by_me ? 'unlike' : 'like';

    setReviews(prev =>
      prev.map(r =>
        r.id === reviewId
          ? {
              ...r,
              liked_by_me: !r.liked_by_me,
              likes_count: r.liked_by_me
                ? r.likes_count - 1
                : r.likes_count + 1,
            }
          : r
      )
    );

    await fetch(`/api/games/${gameId}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container-custom py-10">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-bronze mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-6 h-6 text-bronze" />
          <h1 className="text-2xl font-bold text-white">
            All Community Reviews
          </h1>

          <span className="bg-bronze/30 text-bronze text-sm px-2.5 py-0.5 rounded-full">
            {reviews.length}
          </span>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center text-white/60 py-20">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            No reviews yet.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                {/* top row */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {review.user.display_name}
                    </p>
                    <p className="text-white/40 text-xs">
                      @{review.user.username}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= review.rating
                            ? 'text-bronze fill-bronze'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* text */}
                <p className="text-white/80 text-sm mb-3">
                  {review.review_text}
                </p>

                {/* bottom row */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleLike(review.id)}
                    className={`flex items-center gap-1 text-sm ${
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
                    {review.likes_count}
                  </button>

                  <span className="text-white/30 text-xs">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}