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

const CreateTokenComponent = dynamic(() => import('./create-token'), {
  loading: () => <Loading />,
});

const UpdateMetadataComponent = dynamic(() => import('./update-metadata'), {
  loading: () => <Loading />,
});

const BurnTokenComponent = dynamic(() => import('./burn-token'), {
  loading: () => <Loading />,
});

const CloseTokenAccountComponent = dynamic(
  () => import('./close-token-account'),
  {
    loading: () => <Loading />,
  },
);

const Overview = dynamic(() => import('./overview'), {
  loading: () => <Loading />,
});

const ClosePositionComponent = dynamic(() => import('./close-position'), {
  loading: () => <Loading />,
});

export {
  AppSidebar,
  BurnTokenComponent,
  ClosePositionComponent,
  CloseTokenAccountComponent,
  CreateTokenComponent,
  Overview,
  SiteFooter,
  SiteHeader,
  UpdateMetadataComponent,
};
