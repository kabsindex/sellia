import React from 'react';
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
}
export function Card({
  children,
  className = '',
  noPadding = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-soft border border-sellia-border overflow-hidden ${noPadding ? '' : 'p-5'} ${className}`}
      {...props}>
      
      {children}
    </div>);

}