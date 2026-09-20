import React from 'react';
import { cn } from '../../utils/cn';

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageClassName?: string;
}

export function ProductImage({ className, imageClassName, alt = '', ...props }: ProductImageProps) {
  return (
    <span className={cn('block h-full w-full bg-secondary', className)}>
      <img
        loading="lazy"
        {...props}
        alt={alt}
        className={cn('h-full w-full object-contain p-2', imageClassName)} />
    </span>
  );
}
