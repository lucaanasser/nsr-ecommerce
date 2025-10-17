'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Card Component
 * 
 * Card padronizado com animações e variantes de estilo
 */
interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'product' | 'stat' | 'admin';
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ 
  children, 
  variant = 'default',
  className = '',
  hover = false,
  onClick
}: CardProps) {
  const baseStyles = 'bg-dark-card rounded-sm overflow-hidden border transition-all duration-500';
  
  const variants = {
    default: 'border-dark-border',
    product: 'border-dark-border hover:border-primary-gold/30 hover:shadow-soft-lg',
    stat: 'border-dark-border p-6',
    admin: 'border-dark-border p-6',
  };

  const hoverEffect = hover || variant === 'product';

  const cardContent = (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );

  if (hoverEffect || onClick) {
    return (
      <motion.div
        whileHover={hoverEffect ? { y: -4, scale: 1.01 } : undefined}
        transition={{ duration: 0.3 }}
        onClick={onClick}
        className={onClick ? 'cursor-pointer' : ''}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}
