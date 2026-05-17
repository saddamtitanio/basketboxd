'use client';
import React, { useState, useEffect, useRef } from 'react';
import { SearchBar } from '../ui/SearchBar';
import { Button } from '../ui/Button';
import { Menu, X, Gamepad2, List, User } from 'lucide-react';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../lib/supabase/client';

const BasketballIcon = createLucideIcon('Basketball', basketball);

// Single client instance outside the component — never recreated
const supabase = createClient();

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser]       = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const fetchingRef = useRef(false); // prevent duplicate profile fetches

  const fetchProfile = async (userId: string) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .eq('id', userId)
        .maybeSingle();
      setProfile(data ?? null);
    } finally {
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    // 1. Resolve current session synchronously from cache first
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) fetchProfile(u.id);
      setAuthLoading(false);
    });

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) {
          fetchProfile(u.id);
        } else {
          setProfile(null);
        }
        setAuthLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []); // empty deps — supabase client is stable (module-level singleton)

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-amethyst/95 backdrop-blur-md border-b border-white/10">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => router.push('/')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <BasketballIcon className="w-7 h-7 text-bronze group-hover:scale-110 transition-transform duration-300" />
            <span className="font-bold text-xl tracking-tight bg-linear-to-r from-bronze to-magenta bg-clip-text text-transparent">
              BasketBoxd
            </span>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 text-gray-200">
              <Link href="/games" className="hover:text-bronze transition-colors flex items-center gap-1">
                <Gamepad2 className="w-4 h-4" /> Games
              </Link>
              <Link href="/list" className="hover:text-bronze transition-colors flex items-center gap-1">
                <List className="w-4 h-4" /> List
              </Link>
            </div>

            <SearchBar />

            <div className="flex items-center gap-3">
              {authLoading ? (
                // Placeholder so layout doesn't shift
                <div className="w-20 h-8 rounded-lg bg-white/10 animate-pulse" />
              ) : !user ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => router.push('/auth/login')}>
                    Sign In
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => router.push('/auth/register')}>
                    Get Started
                  </Button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/profile')}
                    className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition flex items-center justify-center"
                  >
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <Link href="/games" className="text-gray-200 hover:text-bronze py-2">Games</Link>
                <Link href="/list"  className="text-gray-200 hover:text-bronze py-2">List</Link>
              </div>
              <SearchBar />
              <div className="flex gap-3">
                {authLoading ? (
                  <div className="flex-1 h-9 rounded-lg bg-white/10 animate-pulse" />
                ) : !user ? (
                  <>
                    <Button variant="ghost"   size="sm" className="flex-1" onClick={() => router.push('/auth/login')}>Sign In</Button>
                    <Button variant="primary" size="sm" className="flex-1" onClick={() => router.push('/auth/register')}>Get Started</Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => router.push('/profile')}>Profile</Button>
                    <Button variant="ghost" size="sm" className="flex-1" onClick={handleLogout}>Logout</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};