'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center cursor-pointer';
  
  const variants = {
    primary: 'bg-gradient-to-r from-magenta to-plum hover:from-pink-lobster hover:to-magenta text-white shadow-lg shadow-magenta/30 hover:shadow-2xl hover:shadow-magenta/50 hover:-translate-y-0.5',
    secondary: 'bg-amethyst hover:bg-plum text-white hover:scale-105',
    outline: 'border-2 border-bronze text-bronze hover:bg-bronze hover:text-white hover:scale-105',
    ghost: 'text-gray-300 hover:text-bronze hover:bg-white/10 hover:scale-105',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};