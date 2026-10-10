import React from 'react';
import { Scissors, Menu, X, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'Inicio', id: 'home' },
    { name: 'Servicios', id: 'services' },
    { name: 'Galería', id: 'gallery' },
    { name: 'Agendar', id: 'book' },
    { name: 'Admin', id: 'admin' },
  ];

  const socials = [
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { name: 'TikTok', icon: TikTokIcon, href: '#', color: 'hover:text-white' },
    { name: 'WhatsApp', icon: MessageCircle, href: 'https://wa.me/573001234567', color: 'hover:text-green-500' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-prestige-bg/80 backdrop-blur-md border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Hamburger on Left */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-gold"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Navigation on Left */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-10">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.2em] transition-all",
                    currentPage === item.id 
                      ? "text-gold" 
                      : "text-prestige-muted hover:text-gold"
                  )}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Social Icons in between */}
          <div className="hidden lg:flex items-center gap-6 px-10 border-x border-white/5 h-10">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-prestige-muted transition-all duration-300 transform hover:scale-110",
                  social.color
                )}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Logo on Right */}
          <div className="flex items-center gap-4 cursor-pointer shrink-0 group" onClick={() => onNavigate('home')}>
            <img 
              src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/refs/heads/main/exclusive-barber-logo.png" 
              alt="Exclusive Barber Logo" 
              className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden flex-col">
              <span className="text-xs font-bold tracking-[0.3em] text-white uppercase leading-none">
                Exclusive
              </span>
              <span className="text-[9px] font-bold tracking-[0.5em] text-gold uppercase leading-none mt-1">
                Barber
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950 border-b border-gold/20"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "block px-3 py-4 text-base font-medium w-full text-left uppercase tracking-widest",
                    currentPage === item.id ? "text-gold bg-gold/10" : "text-zinc-400"
                  )}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
