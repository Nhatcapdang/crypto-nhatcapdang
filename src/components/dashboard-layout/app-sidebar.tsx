'use client';

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Flame,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  Pencil,
  PieChart,
  Plus,
  Settings2,
  SquareTerminal,
  XCircle,
} from 'lucide-react';
import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { NavTokens } from './nav-tokens';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Nhatcapdang',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  tokens: [
    {
      title: 'Overview',
      url: '#',
      icon: Home,
    },
    {
      title: 'Create Token',
      url: '/dashboard/create-token',
      icon: Plus,
    },
    {
      title: 'Update Metadata',
      url: '/dashboard/update-metadata',
      icon: Pencil,
    },
    {
      title: 'Burn Token',
      url: '/dashboard/burn-token',
      icon: Flame,
    },
    {
      title: 'Close Account',
      url: '/dashboard/close-token-account',
      icon: XCircle,
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} variant="floating">
      <SidebarHeader className="liquid-glass rounded-tl-lg rounded-tr-lg">
        <Link href="/" className="relative w-full h-8">
          <Image
            className="mx-auto group-data-[state=collapsed]:block hidden"
            src="/svgs/nhat-cap-dang.svg"
            alt="Nhat Cap Dang"
            loading="lazy"
            fill
          />
          <Image
            className="mx-auto group-data-[state=collapsed]:hidden block"
            src="/svgs/nhat-cap-dang-text.svg"
            alt="Nhat Cap Dang"
            loading="lazy"
            fill
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="liquid-glass">
        {/* <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} /> */}
        <NavTokens items={data.tokens} />
      </SidebarContent>
      {/* <SidebarFooter className="liquid-glass rounded-bl-lg rounded-br-lg">
        <NavUser user={data.user} />
      </SidebarFooter> */}
      {/* <SidebarRail className="liquid-glass" /> */}
    </Sidebar>
  );
}
