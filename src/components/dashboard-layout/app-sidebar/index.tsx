'use client';

import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChartArea,
  Coins,
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
  Wallet,
  XCircle,
} from 'lucide-react';
import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
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
      title: 'overview',
      url: '/dashboard',
      icon: Home,
    },
    {
      title: 'create_token',
      url: '/dashboard/create-token',
      icon: Plus,
    },
    {
      title: 'update_metadata',
      url: '/dashboard/update-metadata',
      icon: Pencil,
    },
    {
      title: 'burn_token',
      url: '/dashboard/burn-token',
      icon: Flame,
    },
    {
      title: 'close_token_account',
      url: '/dashboard/close-token-account',
      icon: XCircle,
    },
    {
      title: 'close_position',
      url: '/dashboard/close-position',
      icon: Wallet,
    },
    {
      title: 'create_liquidity',
      url: '/dashboard/create-liquidity',
      icon: Coins,
    },
    {
      title: 'pool',
      url: '/dashboard/pool',
      icon: ChartArea,
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

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} variant="floating">
      <SidebarHeader className="liquid-glass rounded-tl-lg rounded-tr-lg">
        <Link href="/" className="relative w-full h-auto">
          <Image
            className="mx-auto group-data-[state=collapsed]:block hidden w-[36px] h-[36px] "
            src="/svgs/nhat-cap-dang.svg"
            alt="Nhat Cap Dang"
            loading="lazy"
            width="0"
            height="0"
            sizes="(max-width: 768px) 36px, 124px"
          />
          <Image
            className="mx-auto group-data-[state=collapsed]:hidden block w-auto h-auto brightness-0 dark:brightness-100"
            src="/svgs/nhat-cap-dang-text.svg"
            alt="Nhat Cap Dang"
            width="0"
            height="0"
            sizes="(max-width: 768px) 36px, 124px"
            loading="lazy"
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
export default AppSidebar;
