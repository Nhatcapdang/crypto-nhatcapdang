import Spline from '@splinetool/react-spline/next';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui';
import Link from 'next/link';

const Banner = () => {
  return (
    <section className="container mx-auto">
      <div className="rounded-xl overflow-hidden relative h-[400px]  w-full bg-gradient-to-br from-primary/10 via-primary/50 to-secondary/50 lg:flex lg:flex-row lg:items-center lg:justify-center">
        {/* Spline Section - Background on mobile, side-by-side on desktop */}
        <div className="absolute inset-0 lg:relative lg:w-1/2 h-[130%]">
          <Spline scene="https://prod.spline.design/gPdcU3Ax7vIrg-yM/scene.splinecode" />
        </div>

        {/* Content Section - Overlay on mobile, side-by-side on desktop */}
        <div className="absolute bottom-0 left-0 right-0 z-10 w-full h-full flex items-end lg:items-center justify-start lg:w-1/2 lg:relative lg:z-auto">
          <div className="liquid-glass rounded-2xl w-full p-6 sm:p-8 lg:p-8 mx-6 sm:mx-8 lg:mx-0">
            <div className="flex flex-col items-start justify-center space-y-4 sm:space-y-6 md:space-y-8">
              <Button
                variant="outline"
                className="rounded-full liquid-glass"
                size="sm"
              >
                <Sparkles
                  className="size-3 sm:size-4 animate-pulse"
                  aria-hidden="true"
                />
                <span>Are you ready?</span>
              </Button>
              {/* Main Heading */}
              <h1
                id="banner-heading"
                className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-foreground"
              >
                Your life&apos;s journey begins here
              </h1>

              {/* CTA Button */}
              <Link href="/dashboard">
                <Button
                  size="default"
                  className="group text-sm sm:text-base md:text-lg w-full sm:w-auto"
                >
                  Get Started
                  <ArrowRight className="ml-2 size-4 sm:size-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Banner;
