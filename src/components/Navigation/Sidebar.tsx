'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const navItems = [
  { name: 'Home', href: '/', id: 'home' },
  { name: 'About', href: '/#about', id: 'about' },
  { name: 'Experience', href: '/#experience', id: 'experience' },
  { name: 'Projects', href: '/#projects', id: 'projects' },
  { name: 'Blog', href: '/blog', id: 'blog', isExternal: true },
];

export const Sidebar = ({ isMobile = false }: { isMobile?: boolean }) => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('home'); // Default to 'home'
  const isHome = pathname === '/';

  useEffect(() => {
    if (!isHome) return;

    const sections = ['about', 'experience', 'projects'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isAnchor: boolean) => {
    if (isAnchor && isHome) {
      e.preventDefault();
      const id = href.replace('/#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <nav className={`${isMobile ? 'flex flex-col' : 'w-64 border-r border-zinc-800 h-screen sticky top-0 p-8 hidden md:block'} bg-black`}>
      <div className="mb-12">
        <Link href="/">
          <h1 className="text-xl font-bold text-white tracking-tight hover:text-blue-500 transition-colors">
            brayanibp<span className="text-blue-600">.dev</span>
          </h1>
        </Link>
        {!isMobile && (
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-medium">
            Software Engineer
          </p>
        )}
      </div>

      <ul className="space-y-4">
        {navItems.map((item) => {
          const isActive = item.isExternal 
            ? pathname === '/blog' 
            : isHome && (activeSection === item.id || (item.id === 'home' && activeSection === 'home'));
          
          return (
            <li key={item.name}>
              <Link 
                href={item.href} 
                onClick={(e) => handleClick(e, item.href, !item.isExternal)}
                className="relative group flex items-center"
              >
                <span 
                  className={`${item.isExternal ? 'text-base' : 'text-sm'} transition-colors duration-200 ${
                    isActive ? 'text-blue-500 font-semibold' : 'text-zinc-400 group-hover:text-white'
                  }`}
                >
                  {item.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
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
