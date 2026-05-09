'use client';

import React from 'react';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';

const BasketballIcon = createLucideIcon('Basketball', basketball);

export const HeroSection: React.FC = () => {
  const handleGetStarted = () => {
    console.log('Get started clicked');
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked');
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-amethyst via-plum to-magenta py-24">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-bronze rounded-full blur-[120px]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
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
            Rate players, review games, and keep a diary of the beautiful game. Join the BasketBoxd community today.
          </p>
        </div>
      </div>
    </section>
  );
};