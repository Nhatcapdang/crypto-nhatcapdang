import dynamic from 'next/dynamic';
import Loading from '../loading';

const AppSidebar = dynamic(() => import('./app-sidebar'), {
  loading: () => <Loading />,
});

const SiteFooter = dynamic(() => import('./app-sidebar/site-footer'), {
  loading: () => <Loading />,
});

const SiteHeader = dynamic(() => import('./app-sidebar/site-header'), {
  loading: () => <Loading />,
});

export { AppSidebar, SiteFooter, SiteHeader };
