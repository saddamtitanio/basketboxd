'use client';

import React, { useState } from 'react';
import { SearchBar } from '../ui/SearchBar';
import { Button } from '../ui/Button';
import { Menu, X, Gamepad2, List, Star } from 'lucide-react';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { User } from 'lucide-react'; 
import Link from 'next/link';

const BasketballIcon = createLucideIcon('Basketball', basketball);

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const router = useRouter();
   const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-amethyst/95 backdrop-blur-md border-b border-white/10">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <BasketballIcon className="w-7 h-7 text-bronze group-hover:scale-110 transition-transform duration-300" />
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-bronze to-magenta bg-clip-text text-transparent">
              BasketBoxd
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 text-gray-200">
              <Link href="/games" className="hover:text-bronze transition-colors flex items-center gap-1"><Gamepad2 className="w-4 h-4" /> Games</Link>
              <a href="/reviews" className="hover:text-bronze transition-colors flex items-center gap-1"><Star className="w-4 h-4" /> Reviews</a>
              <a href="/list" className="hover:text-bronze transition-colors flex items-center gap-1"><List className="w-4 h-4" /> List</a>
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
        className="bg-white/10 p-2 rounded-full"
      >
        <User className="w-5 h-5 text-white" />
      </button>

      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
      >
        Logout
      </Button>
    </>
  )}
</div>
          </div>
          
          {/* Mobile menu button */}
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
                <a href="/reviews" className="text-gray-200 hover:text-bronze py-2">Reviews</a>
                <a href="/list" className="text-gray-200 hover:text-bronze py-2">List</a>
              </div>
              <SearchBar />
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" className="flex-1">Sign In</Button>
                <Button variant="primary" size="sm" className="flex-1">Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};