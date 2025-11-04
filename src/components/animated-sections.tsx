'use client';

import { TextAnimate } from '@/components/ui/text-animate';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { AuroraText } from '@/components/ui/aurora-text';

interface AnimatedSectionProps {
  variant?: 'building' | 'trusted' | 'ready';
}

export function AnimatedSections({
  variant = 'building',
}: AnimatedSectionProps) {
  switch (variant) {
    case 'building':
      return (
        <section className="container py-8 md:py-12 lg:py-16">
          <div className="text-center">
            <TextAnimate
              animation="blurInUp"
              by="word"
              className="text-2xl md:text-3xl lg:text-4xl font-bold"
              startOnView
              once
            >
              Building the Future of Token Creation
            </TextAnimate>
          </div>
        </section>
      );
    case 'trusted':
      return (
        <section className="container py-8 md:py-12 lg:py-16">
          <div className="text-center space-y-4">
            <AuroraText className="text-2xl md:text-3xl lg:text-4xl font-bold">
              Trusted by Creators Worldwide
            </AuroraText>
          </div>
        </section>
      );
    case 'ready':
      return (
        <section className="container py-8 md:py-12 lg:py-16">
          <div className="text-center">
            <AnimatedGradientText className="text-2xl md:text-3xl lg:text-4xl font-bold">
              Ready to Launch Your Token?
            </AnimatedGradientText>
          </div>
        </section>
      );
    default:
      return null;
  }
}
