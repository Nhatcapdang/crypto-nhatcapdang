import inforToken from '@/data/infor-token.json';
import { Link } from '@/i18n/navigation';
import { DiscordLogo, TelegramLogo, XLogo } from '../../../public/svgs';

function SiteFooter() {
  return (
    <footer className="text-muted-foreground flex items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6 md:max-lg:flex-col liquid-glass rounded-lg">
      <div className="flex items-center gap-4 text-muted-foreground ">
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
      <p className="text-center text-sm text-balance">
        {`©${new Date().getFullYear()}`}{' '}
        <a href="#" className="text-primary">
          Nhat Cap Dang
        </a>
        , All rights reserved
      </p>
    </footer>
  );
}
export default SiteFooter;
