'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Button Component
 * 
 * Botão reutilizável com variantes e animações
 */
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseStyles = 'px-8 py-3 rounded-sm font-medium transition-all duration-300 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-gold text-primary-black hover:bg-primary-bronze hover:shadow-gold',
    secondary: 'border border-primary-gold text-primary-gold hover:bg-primary-bronze hover:text-primary-black hover:border-primary-bronze',
    ghost: 'text-primary-gold hover:bg-primary-gold/10',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
