'use client';

import { ReactNode } from 'react';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';

const BasketballIcon = createLucideIcon('Basketball', basketball);

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  icon 
}) => {
  return (
    <div className="relative overflow-hidden bg-linear-to-r from-amethyst via-plum to-magenta py-16">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-bronze rounded-full blur-[120px]" />
      </div>
      
      <div className="container-custom relative z-10 text-center">
        <div className="flex justify-center mb-4">
          {icon || <BasketballIcon className="w-12 h-12 text-bronze" />}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
        <p className="text-white/80 text-lg">{description}</p>
      </div>
    </div>
  );
};