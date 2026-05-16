// src/app/profile/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase/client';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import {
  User,
  Mail,
  FileText,
  LogOut,
  AtSign,
  Users,
  Star,
  ExternalLink,
  Loader2,
  BookmarkPlus,
  Eye
} from 'lucide-react';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';

const BasketballIcon = createLucideIcon('Basketball', basketball);
const supabase = createClient();

type Profile = { id: string; username: string; display_name: string; bio: string; avatar_url: string; created_at: string; };
type Stats   = { followers: number; following: number; reviews: number };
type Review  = {
    id: string; review_text: string; rating: number; created_at: string;
    game: { id: string; home_team: { name: string; abbreviation: string; logo_url?: string }; away_team: { name: string; abbreviation: string; logo_url?: string } };
};

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [stats, setStats] = useState<Stats>({ followers: 0, following: 0, reviews: 0 });
    const [recentReviews, setRecentReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ username: '', display_name: '', bio: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess]   = useState('');

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/auth/login');
                return;
            }

            setUser(session.user);

            try {
                const res = await fetch(`/api/profile/${session.user.id}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error);

                setProfile(data.profile);
                setStats(data.stats);
                setRecentReviews(data.recentReviews);

                setFormData({
                    username: data.profile.username || '',
                    display_name: data.profile.display_name || '',
                    bio: data.profile.bio || ''
                });

            } catch (err) {
                console.error(err);
            }

            setLoading(false);
        };

        init();
    }, [router]);

    const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

    const handleSave = async () => {
        setError(''); setSuccess(''); setSaving(true);
        if (!user) return;
        const { error: e } = await supabase.from('profiles')
            .update({ username: formData.username, display_name: formData.display_name, bio: formData.bio })
            .eq('id', user.id);
        if (e) { setError(e.message); }
        else {
            setSuccess('Profile updated!');
            setIsEditing(false);
            setProfile({ ...profile!, ...formData });
        }
        setSaving(false);
    };

    if (loading) return (
        <div className="min-h-screen"><Navbar />
            <div className="container-custom py-20 flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-bronze animate-spin" />
                <span className="text-white text-xl">Loading…</span>
            </div>
        <Footer /></div>
    );
    if (!user) return null;

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pb-16">
                <div className="container-custom py-12">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
                        <p className="text-gray-400">Manage your account settings</p>
                    </div>

                    {error   && <div className="max-w-2xl mx-auto mb-4 bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-300 text-sm text-center">{error}</div>}
                    {success && <div className="max-w-2xl mx-auto mb-4 bg-green-500/20 border border-green-500 rounded-lg p-3 text-green-300 text-sm text-center">{success}</div>}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Left */}
                        <div className="lg:col-span-1">
                            <div className="bg-linear-to-br from-amethyst/20 to-plum/20 rounded-2xl p-6 border border-white/10 text-center sticky top-24">
                                <div className="w-32 h-32 mx-auto bg-linear-to-br from-bronze to-magenta rounded-full flex items-center justify-center overflow-hidden">
                                    {profile?.avatar_url
                                        ? <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
                                        : <User className="w-16 h-16 text-white" />
                                    }
                                </div>
                                <h2 className="text-xl font-bold text-white mt-4">{profile?.display_name || 'User'}</h2>
                                <p className="text-gray-400 text-sm">@{profile?.username || 'username'}</p>

                                {profile?.username && (
                                    <button
                                        onClick={() => router.push(`/profile/${profile.id}`)}
                                        className="mt-2 cursor-pointer flex items-center gap-1 text-xs text-bronze hover:text-magenta transition mx-auto"
                                    >
                                        <ExternalLink className="w-3 h-3" /> View public profile
                                    </button>
                                )}

                                {/* Stats */}
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className="flex justify-around">
                                        <button onClick={() => router.push(`/profile/${profile?.username}`)} className="text-center hover:opacity-80 transition">
                                            <div className="text-2xl font-bold text-bronze">{stats.reviews}</div>
                                            <div className="text-xs text-gray-400">Reviews</div>
                                        </button>
                                        <button onClick={() => router.push(`/profile/${profile?.username}`)} className="text-center hover:opacity-80 transition">
                                            <div className="text-2xl font-bold text-bronze">{stats.followers}</div>
                                            <div className="text-xs text-gray-400">Followers</div>
                                        </button>
                                        <button onClick={() => router.push(`/profile/${profile?.username}`)} className="text-center hover:opacity-80 transition">
                                            <div className="text-2xl font-bold text-bronze">{stats.following}</div>
                                            <div className="text-xs text-gray-400">Following</div>
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    {!isEditing && (
                                        <Button variant="primary" className="w-full" onClick={() => setIsEditing(true)}>
                                            Edit Profile
                                        </Button>
                                    )}
                                    <Button variant="ghost" className="w-full flex items-center justify-center gap-2" onClick={handleLogout}>
                                        <LogOut className="w-4 h-4" /> Logout
                                    </Button>
                                </div>
                               <div className="mt-6 pt-6 border-t border-white/10">
                                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-3 text-left">
                                    Quick Access
                                  </p>

                                  <div className="space-y-2">
                                    <button
                                      onClick={() => router.push('/profile/watchlist')}
                                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-left"
                                    >
                                    <div className="bg-bronze/20 p-2 rounded-lg">
                                      <BookmarkPlus className="w-4 h-4 text-bronze" />
                                    </div>

                                    <div>
                                      <p className="text-sm font-medium text-white">My Watchlist</p>
                                      <p className="text-xs text-gray-400">
                                        Games you want to watch
                                      </p>
                                    </div>
                                  </button>
                                </div>
                              </div> 
                            </div>
                        </div>

                        {/* Right */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Profile info / edit form */}
                            <div className="bg-linear-to-br from-amethyst/20 to-plum/20 rounded-2xl p-6 border border-white/10">
                                <div className="flex items-center gap-2 mb-6">
                                    <BasketballIcon className="w-6 h-6 text-bronze" />
                                    <h2 className="text-2xl font-bold text-white">{isEditing ? 'Edit Profile' : 'Profile Information'}</h2>
                                </div>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2"><AtSign className="w-4 h-4 inline mr-1" />Username</label>
                                        {isEditing
                                            ? <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') })} className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-bronze transition" />
                                            : <p className="text-white p-3 bg-white/5 rounded-lg">@{profile?.username}</p>
                                        }
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2"><User className="w-4 h-4 inline mr-1" />Display Name</label>
                                        {isEditing
                                            ? <input type="text" value={formData.display_name} onChange={(e) => setFormData({ ...formData, display_name: e.target.value })} className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-bronze transition" />
                                            : <p className="text-white p-3 bg-white/5 rounded-lg">{profile?.display_name}</p>
                                        }
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2"><Mail className="w-4 h-4 inline mr-1" />Email</label>
                                        <p className="text-white p-3 bg-white/5 rounded-lg">{user?.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2"><FileText className="w-4 h-4 inline mr-1" />Bio</label>
                                        {isEditing
                                            ? <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={4} placeholder="Tell other basketball fans about yourself..." className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-bronze transition resize-none" />
                                            : <p className="text-gray-300 p-3 bg-white/5 rounded-lg min-h-25">{profile?.bio || "No bio yet. Click 'Edit Profile' to add one."}</p>
                                        }
                                    </div>
                                    {isEditing && (
                                        <div className="flex gap-3 pt-4">
                                            <Button variant="primary" className="flex items-center gap-2" onClick={handleSave} disabled={saving}>
                                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                                {saving ? 'Saving…' : 'Save Changes'}
                                            </Button>
                                            <Button variant="ghost" onClick={() => { setIsEditing(false); setFormData({ username: profile?.username || '', display_name: profile?.display_name || '', bio: profile?.bio || '' }); }}>
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent reviews */}
                            <div className="bg-linear-to-br from-amethyst/20 to-plum/20 rounded-2xl p-6 border border-white/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Star className="w-5 h-5 text-bronze" />
                                    <h2 className="text-xl font-bold text-white">Recent Reviews</h2>
                                </div>
                                {recentReviews.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <BasketballIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                        <p>No reviews yet.</p>
                                        <p className="text-sm mt-1">Start reviewing games to see your activity here!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {recentReviews.map((review) => (
                                            <button key={review.id} onClick={() => router.push(`/games/${review.game.id}`)} className="w-full text-left bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 transition">
                                                <div className="flex items-start justify-between gap-3 mb-1">
                                                    <div className="flex items-center gap-2">
                                                        {review.game.home_team.logo_url && <img src={review.game.home_team.logo_url} className="w-5 h-5 object-contain" alt="" />}
                                                        <span className="text-white font-semibold text-sm">{review.game.home_team.abbreviation} vs {review.game.away_team.abbreviation}</span>
                                                        {review.game.away_team.logo_url && <img src={review.game.away_team.logo_url} className="w-5 h-5 object-contain" alt="" />}
                                                    </div>
                                                    <div className="flex items-center gap-0.5 shrink-0">
                                                        {[1,2,3,4,5].map((s) => <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-bronze fill-bronze' : 'text-white/20'}`} />)}
                                                    </div>
                                                </div>
                                                <p className="text-gray-300 text-sm line-clamp-2">{review.review_text}</p>
                                                <p className="text-gray-500 text-xs mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}