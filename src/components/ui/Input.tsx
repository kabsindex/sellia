import React, { forwardRef } from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label &&
        <label className="block text-sm font-medium text-sellia-text mb-1.5">
            {label}
          </label>
        }
        <div className="relative">
          {icon &&
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sellia-muted">
              {icon}
            </div>
          }
          <input
            ref={ref}
            className={`block w-full rounded-xl border ${error ? 'border-sellia-error focus:ring-sellia-error' : 'border-sellia-border focus:ring-sellia-accent focus:border-sellia-accent'} bg-white px-4 py-3 text-sellia-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-shadow min-h-[48px] ${icon ? 'pl-10' : ''} ${className}`}
            {...props} />
          
        </div>
        {error && <p className="mt-1.5 text-sm text-sellia-error">{error}</p>}
        {helperText && !error &&
        <p className="mt-1.5 text-sm text-sellia-muted">{helperText}</p>
        }
      </div>);

  }
);
Input.displayName = 'Input';