'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const navItems = [
  { name: 'Home', href: '/', id: 'home', isParent: true, subSections: ['home', 'about', 'experience', 'projects'] },
  { name: 'About', href: '/#about', id: 'about' },
  { name: 'Experience', href: '/#experience', id: 'experience' },
  { name: 'Projects', href: '/#projects', id: 'projects' },
  { name: 'Blog', href: '/blog', id: 'blog' },
];

export const Sidebar = ({ isMobile = false }: { isMobile?: boolean }) => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('home');
  const isHome = pathname === '/';

  useEffect(() => {
    if (!isHome) return;

    const sections = ['home', 'about', 'experience', 'projects'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Find which section is currently visible
        const visibleSections = entries.filter(e => e.isIntersecting);
        if (visibleSections.length > 0) {
          // Get the first visible section (topmost)
          const topSection = visibleSections.reduce((prev, curr) => 
            curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev
          );
          setActiveSection(topSection.target.id);
        }
      },
      { rootMargin: '-30% 0px -50% 0px' }
    );

    // Also observe if NO section is in view (meaning we're at the very top)
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
    <nav className={`${isMobile ? 'flex flex-col' : 'w-64 border-r h-screen sticky top-0 p-8 hidden md:block'}`} style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border-color)' }}>
      <div className="mb-12">
        <Link href="/">
          <h1 className="text-xl font-bold tracking-tight hover:text-blue-500 transition-colors" style={{ color: 'var(--text-color)' }}>
            brayanibp<span style={{ color: 'var(--accent-fg)' }}>.dev</span>
          </h1>
        </Link>
        {!isMobile && (
          <p className="text-xs mt-1 uppercase tracking-widest font-medium" style={{ color: 'var(--text-muted)' }}>
            Software Engineer
          </p>
        )}
      </div>

      <ul className="space-y-4">
        {navItems.map((item) => {
          // Home is active when any of its subsections is active
          const isActive = item.isParent 
            ? isHome && item.subSections.includes(activeSection)
            : item.id === 'blog' 
              ? pathname === '/blog'
              : isHome && activeSection === item.id;
          
          return (
            <li key={item.name}>
              <Link 
                href={item.href} 
                onClick={(e) => handleClick(e, item.href, !item.isParent && item.id !== 'blog')}
                className="relative group flex items-center"
              >
                <span 
                  className={`${item.isParent || item.id === 'blog' ? 'text-base' : 'text-sm'} transition-colors duration-200 ${
                    isActive ? 'font-semibold' : ''
                  }`}
                  style={{ 
                    color: isActive ? 'var(--accent-fg)' : 'var(--text-muted)'
                  }}
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

      <div className="mt-8 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
        <ThemeSwitcher />
      </div>
    </nav>
  );
};
