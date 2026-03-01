'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'About', href: '/' },
  { name: 'Experience', href: '/experience' },
  { name: 'Articles', href: '/blog' },
  { name: 'Projects', href: '/projects' },
];

export const Sidebar = ({ isMobile = false }: { isMobile?: boolean }) => {
  const pathname = usePathname();

  return (
    <nav className={`${isMobile ? 'flex flex-col' : 'w-64 border-r border-zinc-800 h-screen sticky top-0 p-8 hidden md:block'} bg-black`}>
      <div className="mb-12">
        <h1 className="text-xl font-bold text-white tracking-tight">
          brayanibp<span className="text-blue-600">.dev</span>
        </h1>
        {!isMobile && (
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-medium">
            Software Engineer
          </p>
        )}
      </div>

      <ul className="space-y-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.name}>
              <Link href={item.href} className="relative group flex items-center">
                <span 
                  className={`text-sm transition-colors duration-200 ${
                    isActive ? 'text-blue-500 font-semibold' : 'text-zinc-400 group-hover:text-white'
                  }`}
                >
                  {item.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId={isMobile ? "activeNavMobile" : "activeNav"}
                    className="absolute -left-8 w-1 h-4 bg-blue-600 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
