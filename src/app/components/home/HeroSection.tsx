'use client';

import React from 'react';
import { Button } from '../ui/Button';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { User } from 'lucide-react';

const BasketballIcon = createLucideIcon('Basketball', basketball);

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-amethyst via-plum to-magenta py-24">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-bronze rounded-full blur-[120px]" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
              <BasketballIcon className="w-12 h-12 text-bronze" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-white via-bronze to-white bg-clip-text text-transparent">
            Track your basketball life.
          </h1>

          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rate players, review games, and keep a diary of the beautiful game.
          </p>

          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/auth/register')}
              >
                Get Started
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={() => router.push('/auth/login')}
              >
                Sign In
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => router.push('/profile')}
                className="bg-white/10 p-4 rounded-full hover:scale-110 transition"
              >
                <User className="w-8 h-8 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};