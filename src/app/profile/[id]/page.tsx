// src/app/profile/[username]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/src/app/lib/supabase/client';
import { Navbar } from '@/src/app/components/layout/Navbar';
import { Footer } from '@/src/app/components/layout/Footer';
import { Button } from '@/src/app/components/ui/Button';
import {
    User, Star, FileText, Loader2, UserPlus, UserMinus,
    Users, X, ArrowLeft,
} from 'lucide-react';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';

const BasketballIcon = createLucideIcon('Basketball', basketball);
const supabase = createClient();

type Profile = {
    id: string; username: string; display_name: string;
    bio: string; avatar_url?: string; created_at: string;
};
type Stats = { followers: number; following: number; reviews: number };
type Review = {
    id: string; review_text: string; rating: number; created_at: string;
    game: {
        id: string;
        home_team: { name: string; abbreviation: string; logo_url?: string };
        away_team: { name: string; abbreviation: string; logo_url?: string };
    };
};
type FollowUser = { id: string; username: string; display_name: string; avatar_url?: string };

type Modal = 'followers' | 'following' | null;

export default function PublicProfilePage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [stats, setStats] = useState<Stats>({ followers: 0, following: 0, reviews: 0 });
    const [isFollowing, setIsFollowing] = useState(false);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [recentReviews, setRecentReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [modal, setModal] = useState<Modal>(null);
    const [modalList, setModalList] = useState<FollowUser[]>([]);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/profile/${id}`);
                if (!res.ok) throw new Error((await res.json()).error || 'Profile not found');
                const data = await res.json();
                setProfile(data.profile);
                setStats(data.stats);
                setIsFollowing(data.isFollowing);
                setIsOwnProfile(data.isOwnProfile);
                setRecentReviews(data.recentReviews);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const openModal = async (type: Modal) => {
        setModal(type);
        setModalLoading(true);
        try {
            const res = await fetch(`/api/profile/${id}/${type}`);
            const data = await res.json();
            setModalList(Array.isArray(data) ? data : []);
        } catch {
            setModalList([]);
        } finally {
            setModalLoading(false);
        }
    };

    const handleFollow = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/auth/login'); return; }

        setFollowLoading(true);
        try {
            const res = await fetch(`/api/profile/${id}/follow`, {
                method: isFollowing ? 'DELETE' : 'POST',
            });
            if (!res.ok) throw new Error();
            setIsFollowing(!isFollowing);
            setStats((s) => ({
                ...s,
                followers: isFollowing ? s.followers - 1 : s.followers + 1,
            }));
        } catch {

        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen">
            <Navbar />
            <div className="container-custom py-20 flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-bronze animate-spin" />
                <span className="text-white text-xl">Loading…</span>
            </div>
            <Footer />
        </div>
    );

    if (error || !profile) return (
        <div className="min-h-screen">
            <Navbar />
            <div className="container-custom py-20 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">{error || 'Profile not found'}</h1>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pb-16">
                {/* Header banner */}
                <div className="relative overflow-hidden bg-linear-to-r from-amethyst via-plum to-magenta py-16">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-20 w-72 h-72 bg-white rounded-full blur-[100px]" />
                        <div className="absolute bottom-10 right-20 w-96 h-96 bg-bronze rounded-full blur-[120px]" />
                    </div>
                    <div className="container-custom relative z-10">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                            {/* Avatar */}
                            <div className="w-28 h-28 rounded-full bg-linear-to-br from-bronze to-magenta flex items-center justify-center overflow-hidden border-4 border-white/20 shrink-0">
                                {profile.avatar_url
                                    ? <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
                                    : <User className="w-14 h-14 text-white" />
                                }
                            </div>
                            {/* Name + bio */}
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-3xl font-bold text-white">{profile.display_name}</h1>
                                <p className="text-white/60 mb-2">@{profile.username}</p>
                                {profile.bio && <p className="text-white/80 max-w-lg">{profile.bio}</p>}
                            </div>
                            {/* Follow button */}
                            {!isOwnProfile && (
                                <Button
                                    variant={isFollowing ? 'ghost' : 'primary'}
                                    className="flex items-center gap-2 shrink-0"
                                    onClick={handleFollow}
                                    disabled={followLoading}
                                >
                                    {followLoading
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : isFollowing
                                            ? <><UserMinus className="w-4 h-4" /> Unfollow</>
                                            : <><UserPlus className="w-4 h-4" /> Follow</>
                                    }
                                </Button>
                            )}
                            {isOwnProfile && (
                                <Button variant="ghost" onClick={() => router.push('/profile')}>
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-custom mt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: stats */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-linear-to-br from-amethyst/20 to-plum/20 rounded-2xl p-6 border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-4">Stats</h3>
                                <div className="space-y-3">
                                    {/* Followers — clickable */}
                                    <button
                                        onClick={() => openModal('followers')}
                                        className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
                                    >
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Users className="w-4 h-4 text-bronze" />
                                            <span className="text-sm">Followers</span>
                                        </div>
                                        <span className="text-bronze font-bold text-lg">{stats.followers}</span>
                                    </button>
                                    {/* Following — clickable */}
                                    <button
                                        onClick={() => openModal('following')}
                                        className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
                                    >
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Users className="w-4 h-4 text-magenta" />
                                            <span className="text-sm">Following</span>
                                        </div>
                                        <span className="text-bronze font-bold text-lg">{stats.following}</span>
                                    </button>
                                    {/* Reviews */}
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Star className="w-4 h-4 text-bronze" />
                                            <span className="text-sm">Reviews</span>
                                        </div>
                                        <span className="text-bronze font-bold text-lg">{stats.reviews}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Member since */}
                            <div className="bg-linear-to-br from-amethyst/20 to-plum/20 rounded-2xl p-6 border border-white/10">
                                <p className="text-gray-400 text-sm">
                                    Member since{' '}
                                    <span className="text-white font-medium">
                                        {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Right: recent reviews */}
                        <div className="lg:col-span-2">
                            <div className="bg-linear-to-br from-amethyst/20 to-plum/20 rounded-2xl p-6 border border-white/10">
                                <div className="flex items-center gap-2 mb-6">
                                    <FileText className="w-5 h-5 text-bronze" />
                                    <h2 className="text-xl font-bold text-white">Recent Reviews</h2>
                                </div>

                                {recentReviews.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <BasketballIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                        <p>No reviews yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {recentReviews.map((review) => (
                                            <button
                                                key={review.id}
                                                onClick={() => router.push(`/games/${review.game.id}`)}
                                                className="w-full text-left bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 transition"
                                            >
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {review.game.home_team.logo_url && (
                                                            <img src={review.game.home_team.logo_url} className="w-6 h-6 object-contain" alt="" />
                                                        )}
                                                        <span className="text-white font-semibold text-sm">
                                                            {review.game.home_team.abbreviation} vs {review.game.away_team.abbreviation}
                                                        </span>
                                                        {review.game.away_team.logo_url && (
                                                            <img src={review.game.away_team.logo_url} className="w-6 h-6 object-contain" alt="" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        {[1,2,3,4,5].map((s) => (
                                                            <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-bronze fill-bronze' : 'text-white/20'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-gray-300 text-sm line-clamp-2">{review.review_text}</p>
                                                <p className="text-gray-500 text-xs mt-2">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Followers / Following modal */}
            {modal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={() => setModal(null)}
                >
                    <div
                        className="relative w-full max-w-sm bg-[#1a1a2e] border border-white/10 rounded-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                            <h3 className="text-white font-bold capitalize">{modal}</h3>
                            <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {modalLoading ? (
                                <div className="flex items-center justify-center gap-2 py-10 text-gray-400">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </div>
                            ) : modalList.length === 0 ? (
                                <p className="text-center text-gray-400 py-10 text-sm">No {modal} yet.</p>
                            ) : (
                                modalList.map((u) => (
                                    <button
                                        key={u.id}
                                        onClick={() => { setModal(null); router.push(`/profile/${u.username}`); }}
                                        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition text-left"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-magenta to-plum flex items-center justify-center overflow-hidden shrink-0">
                                            {u.avatar_url
                                                ? <img src={u.avatar_url} alt={u.display_name} className="w-full h-full object-cover" />
                                                : <span className="text-white text-sm font-bold">{u.display_name?.charAt(0).toUpperCase()}</span>
                                            }
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">{u.display_name}</p>
                                            <p className="text-gray-400 text-xs">@{u.username}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}