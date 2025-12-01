'use client';

import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { cn } from '@/lib/utils';
import { Flame, Pencil, Plus, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
  BurnTokenComponent,
  CloseTokenAccountComponent,
  CreateTokenComponent,
  UpdateMetadataComponent,
} from '.';
import { TextAnimate } from '../ui';

const Overview = React.memo(() => {
  const t = useTranslations();

  const features = [
    {
      name: t('create_token'),
      description: t('create_token_description'),
      href: '/dashboard/create-token',
      icon: Plus,
      className: 'col-span-12 lg:col-span-6',
      background: <CreateTokenComponent />,
    },
    {
      name: t('update_metadata'),
      description: t('update_token_description'),
      href: '/dashboard/update-metadata',
      icon: Pencil,
      className: 'col-span-12 lg:col-span-6',
      background: <UpdateMetadataComponent />,
    },
    {
      name: t('burn_token'),
      description: t('burn_token_description'),
      href: '/dashboard/burn-token',
      icon: Flame,
      className: 'col-span-12  lg:col-span-4',
      background: <BurnTokenComponent />,
    },
    {
      name: t('close_token_account'),
      description: t('close_account_description'),
      href: '/dashboard/close-token-account',
      icon: XCircle,
      className: 'col-span-12  lg:col-span-8',
      background: <CloseTokenAccountComponent />,
    },
  ];

  return (
    <section className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <TextAnimate
          className="text-3xl font-bold sm:text-4xl lg:text-5xl"
          animation="slideRight"
        >
          {t('enterprise_grade_token_management_platform')}
        </TextAnimate>
        <TextAnimate
          animation="fadeIn"
          className="mt-4 text-muted-foreground text-sm sm:text-base"
        >
          Manage your Solana tokens with powerful tools and intuitive interface
        </TextAnimate>
      </div>

      <BentoGrid className=" grid-cols-12 gap-4 auto-rows-[22rem] lg:auto-rows-[22rem]">
        {features.map(feature => (
          <BentoCard
            key={feature.href}
            name={feature.name}
            description={feature.description}
            href={feature.href}
            Icon={feature.icon}
            cta="Get Started"
            className={cn('relative', feature.className)}
            background={
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                {feature.background}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.4]" />
              </div>
            }
          />
        ))}
      </BentoGrid>
    </section>
  );
});

Overview.displayName = 'Overview';

export default Overview;
