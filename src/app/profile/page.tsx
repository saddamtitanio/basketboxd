'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase/client';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { User, Mail, FileText, LogOut, AtSign } from 'lucide-react';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';

const BasketballIcon = createLucideIcon('Basketball', basketball);
const supabase = createClient();

type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }
      
      setUser(session.user);
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
        setFormData({
          username: profileData.username || '',
          display_name: profileData.display_name || '',
          bio: profileData.bio || '',
        });
      }
      
      setLoading(false);
    };
    
    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    
    if (!user) return;
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        username: formData.username,
        display_name: formData.display_name,
        bio: formData.bio,
      })
      .eq('id', user.id);
    
    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setProfile({
        ...profile!,
        ...formData,
      });
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pb-16">
        <div className="container-custom py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-gray-400">Manage your account settings</p>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mb-6 bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-300 text-sm text-center">
              {error}
            </div>
          )}
          
          {success && (
            <div className="max-w-2xl mx-auto mb-6 bg-green-500/20 border border-green-500 rounded-lg p-3 text-green-300 text-sm text-center">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Left Column */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-amethyst/20 to-plum/20 rounded-2xl p-6 border border-white/10 text-center sticky top-24">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-bronze to-magenta rounded-full flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>

                <h2 className="text-xl font-bold text-white mt-4">{profile?.display_name || 'User'}</h2>
                <p className="text-gray-400 text-sm">@{profile?.username || 'username'}</p>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex justify-around">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-bronze">0</div>
                      <div className="text-xs text-gray-400">Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-bronze">0</div>
                      <div className="text-xs text-gray-400">Watchlist</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-bronze">0</div>
                      <div className="text-xs text-gray-400">Games</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {!isEditing && (
                    <Button variant="primary" className="w-full" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                  <Button variant="ghost" className="w-full flex items-center justify-center gap-2" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-amethyst/20 to-plum/20 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-6">
                  <BasketballIcon className="w-6 h-6 text-bronze" />
                  <h2 className="text-2xl font-bold text-white">
                    {isEditing ? 'Edit Profile' : 'Profile Information'}
                  </h2>
                </div>

                <div className="space-y-5">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <AtSign className="w-4 h-4 inline mr-1" />
                      Username
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                        className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-bronze transition"
                      />
                    ) : (
                      <p className="text-white p-3 bg-white/5 rounded-lg">@{profile?.username}</p>
                    )}
                  </div>

                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Display Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.display_name}
                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                        className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-bronze transition"
                      />
                    ) : (
                      <p className="text-white p-3 bg-white/5 rounded-lg">{profile?.display_name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <p className="text-white p-3 bg-white/5 rounded-lg">{user?.email}</p>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <FileText className="w-4 h-4 inline mr-1" />
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        placeholder="Tell other basketball fans about yourself..."
                        className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-bronze transition resize-none"
                      />
                    ) : (
                      <p className="text-gray-300 p-3 bg-white/5 rounded-lg min-h-[100px]">
                        {profile?.bio || "No bio yet. Click 'Edit Profile' to add one."}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <Button variant="primary" className="flex items-center gap-2" onClick={handleSave}>
                        Save Changes
                      </Button>
                      <Button variant="ghost" onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          username: profile?.username || '',
                          display_name: profile?.display_name || '',
                          bio: profile?.bio || '',
                        });
                      }}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gradient-to-br from-amethyst/20 to-plum/20 rounded-2xl p-6 border border-white/10 mt-6">
                <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                <div className="text-center py-8 text-gray-400">
                  <BasketballIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p>No activity yet.</p>
                  <p className="text-sm mt-1">Start reviewing games to see your activity here!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}