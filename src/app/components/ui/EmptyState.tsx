'use client';

import { ReactNode } from 'react';
import { Button } from './Button';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';

const BasketballIcon = createLucideIcon('Basketball', basketball);

interface EmptyStateProps {
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
  icon?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  buttonText,
  onButtonClick,
  icon,
}) => {
  return (
    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
      {icon || <BasketballIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{message}</p>
      {buttonText && onButtonClick && (
        <Button variant="primary" className="mt-4 mx-auto" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};