import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import inforToken from '@/data/infor-token.json';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { DiscordLogo, TelegramLogo, XLogo } from '../../public/svgs';

const footerLinks = [
  {
    title: 'overview',
    href: '/dashboard',
  },
  {
    title: 'create_token',
    href: '/dashboard/create-token',
  },
  {
    title: 'update_metadata',
    href: '/dashboard/update-metadata',
  },
  {
    title: 'burn_token',
    href: '/dashboard/burn-token',
  },
  {
    title: 'close_token_account',
    href: '/dashboard/close-token-account',
  },
  {
    title: 'liquidity_pool',
    href: '/dashboard/liquidity-pool',
  },
];

const Footer = () => {
  const t = useTranslations();
  return (
    <div className=" flex flex-col">
      <div className="grow bg-muted" />
      <footer className="border-t">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          <div className="py-12 flex flex-col sm:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 xl:px-0">
            <div>
              <Image
                src="/svgs/nhat-cap-dang-text.svg"
                alt="Nhat Cap Dang"
                width={124}
                height={36}
                loading="lazy"
                unoptimized
                fetchPriority="high"
              />

              <ul className="mt-6 flex items-center gap-4 flex-wrap">
                {footerLinks.map(({ title, href }) => (
                  <li key={title}>
                    <Link
                      href={href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {t(title)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe Newsletter */}
            <div className="max-w-xs w-full">
              <h6 className="font-medium">Stay up to date</h6>
              <form className="my-6 flex items-center gap-2">
                <Input type="email" placeholder="Enter your email" />
                <Button>Subscribe</Button>
              </form>
              <div className="flex items-center gap-4 text-muted-foreground">
                <Link
                  href={inforToken.x}
                  target="_blank"
                  className="hover:text-foreground"
                >
                  <XLogo className="h-5 w-5" />
                </Link>
                <Link
                  href={inforToken.discord}
                  target="_blank"
                  className="hover:text-foreground"
                >
                  <DiscordLogo className="h-8 w-h-8 [&>path]:fill-current" />
                </Link>
                <Link
                  href={inforToken.telegram}
                  target="_blank"
                  className="hover:text-foreground"
                >
                  <TelegramLogo className="h-6 w-6 [&>path]:fill-current" />
                </Link>
              </div>
            </div>
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()} nhatcapdang.com.{' '}
              {t('footer.allRightsReserved')}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
