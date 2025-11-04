'use client';

import React from 'react';
import { MagicCard } from '@/components/ui/magic-card';
import { ShineBorder } from '@/components/ui/shine-border';
import { BorderBeam } from '@/components/ui/border-beam';
import { Particles } from '@/components/ui/particles';
import { cn } from '@/lib/utils';

interface PreviewWrapperProps {
  children: React.ReactNode;
  variant?: 'create' | 'update' | 'burn' | 'close';
  className?: string;
}

/**
 * Optimized preview wrapper component with Magic UI effects
 * Reduces re-renders and enhances visual presentation
 */
export const PreviewWrapper = React.memo(
  ({ children, variant = 'create', className }: PreviewWrapperProps) => {
    const colorConfig = {
      create: {
        borderBeam: { colorFrom: '#a786ff', colorTo: '#fd8bbc' },
        shineBorder: '#a786ff',
        particles: '#a786ff',
      },
      update: {
        borderBeam: { colorFrom: '#10b981', colorTo: '#3b82f6' },
        shineBorder: '#10b981',
        particles: '#10b981',
      },
      burn: {
        borderBeam: { colorFrom: '#f59e0b', colorTo: '#ef4444' },
        shineBorder: '#f59e0b',
        particles: '#f59e0b',
      },
      close: {
        borderBeam: { colorFrom: '#8b5cf6', colorTo: '#ec4899' },
        shineBorder: '#8b5cf6',
        particles: '#8b5cf6',
      },
    };

    const config = colorConfig[variant];

    return (
      <div className={cn('relative h-full w-full overflow-hidden', className)}>
        {/* Background particles effect */}
        <Particles
          className="absolute inset-0"
          quantity={50}
          staticity={30}
          ease={50}
          size={0.4}
          color={config.particles}
        />

        {/* Magic Card with spotlight effect */}
        <MagicCard
          className="h-full w-full"
          gradientSize={300}
          gradientOpacity={0.3}
          gradientFrom={config.borderBeam.colorFrom}
          gradientTo={config.borderBeam.colorTo}
        >
          <div className="relative h-full w-full">
            {/* Shine border effect */}
            <ShineBorder
              borderWidth={2}
              duration={14}
              shineColor={[
                config.borderBeam.colorFrom,
                config.borderBeam.colorTo,
              ]}
              className="absolute inset-0 rounded-xl"
            />

            {/* Content wrapper */}
            <div className="relative z-10 h-full w-full overflow-hidden rounded-xl">
              {children}
            </div>

            {/* Border beam effects */}
            <BorderBeam
              duration={10}
              size={400}
              delay={0}
              colorFrom={config.borderBeam.colorFrom}
              colorTo={config.borderBeam.colorTo}
              className="absolute inset-0 rounded-xl"
            />
            <BorderBeam
              duration={10}
              size={400}
              delay={5}
              reverse
              colorFrom={config.borderBeam.colorTo}
              colorTo={config.borderBeam.colorFrom}
              className="absolute inset-0 rounded-xl"
            />
          </div>
        </MagicCard>
      </div>
    );
  },
);

PreviewWrapper.displayName = 'PreviewWrapper';

// Simplified wrapper for better performance
export const SimplePreviewWrapper = React.memo(
  ({
    children,
    variant: _variant = 'create',
    className,
  }: PreviewWrapperProps) => {
    return (
      <div
        className={cn(
          'relative h-full w-full overflow-hidden rounded-xl',
          className,
        )}
      >
        <div className="absolute inset-0 opacity-50">{children}</div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4]" />
      </div>
    );
  },
);

SimplePreviewWrapper.displayName = 'SimplePreviewWrapper';
