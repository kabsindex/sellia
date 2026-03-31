import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
}
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  fullWidth,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    primary:
    'bg-sellia-accent text-white hover:bg-sellia-accentHover focus:ring-sellia-accent shadow-sm',
    secondary:
    'bg-sellia-primary text-white hover:bg-slate-800 focus:ring-sellia-primary shadow-sm',
    outline:
    'border-2 border-sellia-border text-sellia-text hover:bg-slate-50 focus:ring-slate-200',
    ghost:
    'text-sellia-muted hover:text-sellia-text hover:bg-slate-100 focus:ring-slate-200',
    danger:
    'bg-sellia-error text-white hover:bg-red-600 focus:ring-sellia-error shadow-sm'
  };
  const sizes = {
    sm: 'text-sm px-3 py-1.5 min-h-[36px]',
    md: 'text-base px-4 py-2.5 min-h-[44px]',
    lg: 'text-lg px-6 py-3.5 min-h-[52px]'
  };
  return (
    <motion.button
      whileTap={{
        scale: disabled || isLoading ? 1 : 0.98
      }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}>
      
      {isLoading ?
      <svg
        className="animate-spin -ml-1 mr-2 h-5 w-5 text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24">
        
          <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4">
        </circle>
          <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
        </svg> :
      icon ?
      <span className="mr-2">{icon}</span> :
      null}
      {children}
    </motion.button>);

}
