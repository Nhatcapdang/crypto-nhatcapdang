import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { LocaleSwitcher } from '../locale-switcher';
import { AnimatedThemeToggler } from '../ui';
import { NavMenu } from './nav-menu';
import { Sidebar } from './sidebar/Index';

const Navbar = () => {
  return (
    <nav className="fixed z-40 top-6  w-full h-16  ">
      <div className="h-full flex items-center justify-between mx-auto px-4 container bg-background border dark:border-slate-700/70 rounded-full ">
        <Image
          src="/svgs/nhat-cap-dang-text.svg"
          alt="Nhat Cap Dang"
          width={124}
          height={36}
        />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>
          <AnimatedThemeToggler />

          <Button className="rounded-full" asChild>
            <Link href="/dashboard/create-token">Get Started</Link>
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden scale-[1.1] mt-2">
            <Sidebar />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
