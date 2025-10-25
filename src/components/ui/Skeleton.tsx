import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
  animate?: boolean;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = 'text',
      width,
      height,
      count = 1,
      animate = true,
      style,
      ...props
    },
    ref
  ) => {
    const variants = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-lg',
    };

    const defaultHeights = {
      text: '1rem',
      circular: '3rem',
      rectangular: '8rem',
    };

    const skeletonStyle = {
      width: width || (variant === 'circular' ? '3rem' : undefined),
      height: height || defaultHeights[variant],
      ...style,
    };

    const skeletonElement = (
      <div
        ref={ref}
        className={cn(
          'bg-gray-200',
          animate && 'animate-pulse',
          variants[variant],
          className
        )}
        style={skeletonStyle}
        {...props}
      />
    );

    if (count <= 1) {
      return skeletonElement;
    }

    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'bg-gray-200',
              animate && 'animate-pulse',
              variants[variant],
              className
            )}
            style={skeletonStyle}
          />
        ))}
      </div>
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Preset skeleton components for common use cases
export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn('p-6 bg-white border border-gray-200 rounded-lg', className)}>
    <div className="space-y-4">
      <Skeleton variant="rectangular" height="12rem" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" count={2} />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="rectangular" width="5rem" height="2rem" />
        <Skeleton variant="rectangular" width="5rem" height="2rem" />
      </div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="flex gap-4 pb-3 border-b border-gray-200">
      <Skeleton width="30%" height="1.25rem" />
      <Skeleton width="25%" height="1.25rem" />
      <Skeleton width="20%" height="1.25rem" />
      <Skeleton width="25%" height="1.25rem" />
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="flex gap-4">
        <Skeleton width="30%" height="1rem" />
        <Skeleton width="25%" height="1rem" />
        <Skeleton width="20%" height="1rem" />
        <Skeleton width="25%" height="1rem" />
      </div>
    ))}
  </div>
);

export const SkeletonAvatar = ({
  size = 'md',
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  const sizes = {
    sm: { width: '2rem', height: '2rem' },
    md: { width: '3rem', height: '3rem' },
    lg: { width: '4rem', height: '4rem' },
    xl: { width: '6rem', height: '6rem' },
  };

  return <Skeleton variant="circular" {...sizes[size]} />;
};

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={index === lines - 1 ? '80%' : '100%'}
      />
    ))}
  </div>
);

export default Skeleton;
