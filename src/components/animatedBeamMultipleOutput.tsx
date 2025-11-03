'use client';

import React, { forwardRef, memo, useRef } from 'react';

import { AnimatedBeam } from '@/components/ui/animated-beam';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { NhatCapDang } from '../../public/svgs';

const CircleBase = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex size-14 items-center justify-center rounded-full border border-primary/20 bg-accent/90 p-1.5 overflow-hidden shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] ring-1 ring-background/40 backdrop-blur-sm',
        'transition-transform will-change-transform',
        className,
      )}
    >
      {children}
    </div>
  );
});

CircleBase.displayName = 'CircleBase';

const Circle = memo(CircleBase);
Circle.displayName = 'Circle';

export function AnimatedBeamMultipleOutputDemo({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);
  const div8Ref = useRef<HTMLDivElement>(null);
  const div9Ref = useRef<HTMLDivElement>(null);
  const div10Ref = useRef<HTMLDivElement>(null);
  const div11Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        'relative flex h-[560px] w-full items-center justify-center overflow-hidden p-6 md:p-10',
        'rounded-2xl',
        className,
      )}
      ref={containerRef}
    >
      {/* premium soft glows */}
      {/* <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-accent/20 blur-3xl" /> */}

      {/* center hub */}

      <Circle ref={div6Ref} className="size-20 bg-background/80 ">
        <div className="scale-50 backdrop-blur-xl  border-border p-7 border rounded-full">
          <NhatCapDang />
        </div>
      </Circle>

      {/* satellites */}
      <Circle ref={div1Ref} className="absolute top-8 left-8 size-12">
        <Image
          src="/images/dexscreener.jpg"
          alt="Dexscreener"
          width={100}
          height={100}
          className="object-contain rounded-full w-full h-full"
        />
      </Circle>

      <Circle ref={div2Ref} className="absolute top-6 right-14 size-12">
        <Image
          src="/images/birdeye.png"
          alt="birdeye"
          width={100}
          height={100}
          className="object-contain rounded-full w-full h-full"
        />
      </Circle>

      <Circle ref={div3Ref} className="absolute left-10 bottom-10 size-12">
        <Image
          src="/images/dextools.png"
          alt="dextools"
          width={100}
          height={100}
          className="object-contain rounded-full w-full h-full"
        />
      </Circle>

      <Circle ref={div4Ref} className="absolute right-10 bottom-16 size-12">
        <Image
          src="/images/photon.png"
          alt="photon"
          width={100}
          height={100}
          className="object-contain rounded-full w-full h-full"
        />
      </Circle>

      <Circle
        ref={div5Ref}
        className="absolute right-16 translate-x-1/2 top-1/2 size-12"
      >
        <Image
          src="/images/bubblemaps.png"
          alt="bubblemaps"
          width={100}
          height={100}
          className="object-contain rounded-full w-full h-full"
        />
      </Circle>

      <Circle ref={div7Ref} className="absolute left-1/4 top-1/4 size-12">
        <Image
          src="/images/rugcheck.jpg"
          alt="rugcheck"
          width={100}
          height={100}
          className="object-contain rounded-full w-full h-full"
        />
      </Circle>

      <Circle ref={div8Ref} className="absolute right-1/4 top-1/4 size-12">
        <Image
          src="/images/okx.png"
          alt="okx"
          width={100}
          height={100}
          className="object-contain rounded-full w-full h-full"
        />
      </Circle>

      <Circle ref={div9Ref} className="absolute left-1/5 bottom-1/4 size-12">
        <Image
          src="/images/raydium.png"
          alt="raydium"
          width={100}
          height={100}
          className="object-contain rounded-full w-full h-full"
        />
      </Circle>

      <Circle ref={div10Ref} className="absolute right-1/5 bottom-6 size-12">
        <Image
          src="/images/orca.png"
          alt="orca"
          width={100}
          height={100}
          className="object-contain rounded-full w-full h-full"
        />
      </Circle>

      <Circle
        ref={div11Ref}
        className="absolute left-6 top-1/2 -translate-y-1/2 size-12"
      >
        <Image
          src="/images/jupiter.png"
          alt="jupiter"
          width={100}
          height={100}
          className="object-contain rounded-full w-full h-full"
        />
      </Circle>
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div1Ref}
        duration={3}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
        duration={3}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div6Ref}
        duration={3}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div8Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div9Ref}
        toRef={div6Ref}
        duration={3}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div10Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div11Ref}
        toRef={div6Ref}
        duration={3}
        reverse
      />
    </div>
  );
}
