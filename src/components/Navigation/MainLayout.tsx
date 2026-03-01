"use client";
import { BackgroundDots } from "../UI/BackgroundDots";

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Desktop Sidebar */}
      <Sidebar />
      <BackgroundDots />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-black/80 backdrop-blur-md border-b border-zinc-800 z-40 flex items-center justify-between px-6">
        <span className="font-bold text-lg">brayanibp<span className="text-blue-600">.dev</span></span>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-zinc-400">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-black border-r border-zinc-800 z-50 md:hidden p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-bold text-xl">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-500 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              {/* Reutilizamos la lógica de items aquí para el móvil */}
              <div onClick={() => setIsMobileMenuOpen(false)}>
                 <Sidebar />
      <BackgroundDots />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-16 md:pt-0 overflow-x-hidden">
        <div className="max-w-4xl mx-auto p-6 md:p-12 lg:p-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
