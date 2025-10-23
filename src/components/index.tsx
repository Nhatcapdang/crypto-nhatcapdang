import dynamic from 'next/dynamic';
import Loading from './loading';

const SwitchDark = dynamic(() => import('./switch-dark'), {
  loading: () => <Loading />,
});

const Explore = dynamic(() => import('./explore'), {
  loading: () => <Loading />,
});

const Footer = dynamic(() => import('./footer'), {
  loading: () => <Loading />,
});

const Navbar = dynamic(() => import('./navbar'), {
  loading: () => <Loading />,
});

const Hero = dynamic(() => import('./hero'), {
  loading: () => <Loading />,
});

const Testimonial = dynamic(() => import('./testimonial'), {
  loading: () => <Loading />,
});

const Integration = dynamic(() => import('./integration'), {
  loading: () => <Loading />,
});

const Faq = dynamic(() => import('./faq'), {
  loading: () => <Loading />,
});

const Banner = dynamic(() => import('./banner'), {
  loading: () => <Loading />,
});

export {
  SwitchDark,
  Explore,
  Footer,
  Navbar,
  Hero,
  Testimonial,
  Integration,
  Faq,
  Banner,
};
