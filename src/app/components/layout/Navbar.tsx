'use client';

import React, { useState, useEffect } from 'react';
import { SearchBar } from '../ui/SearchBar';
import { Button } from '../ui/Button';
import { Menu, X, Gamepad2, List, User } from 'lucide-react';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../lib/supabase/client';

const BasketballIcon = createLucideIcon('Basketball', basketball);
const supabase = createClient();

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData);
      }
    };
    
    getUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 text-gray-200">
              <Link href="/games" className="hover:text-bronze transition-colors flex items-center gap-1">
                <Gamepad2 className="w-4 h-4" /> Games
              </Link>
              <a href="/list" className="hover:text-bronze transition-colors flex items-center gap-1">
                <List className="w-4 h-4" /> List
              </a>
            </div>
            <SearchBar />
            <div className="flex items-center gap-3">
              {!user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/auth/login')}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push('/auth/register')}
                  >
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
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <Link href="/games" className="text-gray-200 hover:text-bronze py-2">
                  Games
                </Link>
                <a href="/list" className="text-gray-200 hover:text-bronze py-2">
                  List
                </a>
              </div>
              <SearchBar />
              <div className="flex gap-3">
                {!user ? (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push('/auth/login')}
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push('/auth/register')}
                    >
                      Get Started
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push('/profile')}
                    >
                      Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
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