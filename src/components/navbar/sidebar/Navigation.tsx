import * as React from 'react';
import { motion } from 'framer-motion';
import MenuItem from './MenuItem';

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    background: 'hsl(var(--background))',
    height: '100vh',
    y: 0,
    opacity: 1,
    display: 'block',
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
    background: 'hsl(var(--background))',
    height: '20vh',
    y: 50,
    opacity: 0,
    display: 'none',
  },
};

export const Navigation = ({ toggle }: { toggle: () => void }) => (
  <motion.div
    variants={variants}
    className="absolute top-[40px] right-0 max-xs:w-[100vw] w-[430vw] max-w-[430px] -z-10 flex justify-center items-center rounded-md border border-border shadow-lg liquid-glass"
  >
    <motion.ul className="w-full overflow-hidden">
      {[
        { title: 'Home', href: '#hero-section' },
        { title: 'Integration', href: '#integration-section' },
        { title: 'Testimonials', href: '#testimonials-section' },
        { title: 'FAQ', href: '#faq-section' },
      ].map((item, idx) => (
        <MenuItem {...item} key={idx} toggle={toggle} />
      ))}
    </motion.ul>
  </motion.div>
);
