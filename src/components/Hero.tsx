import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface HeroProps {
  onBookClick: () => void;
}

export default function Hero({ onBookClick }: HeroProps) {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-prestige-bg">
      {/* Background Decorative Text */}
      <div className="hero-bg-text font-serif italic -top-10 -left-20">
        1924
      </div>
      
      {/* Decorative vertical line */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 accent-line-vertical hidden lg:block" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-3xl md:text-6xl font-serif font-light mb-8 tracking-tighter leading-[1.1] text-white uppercase">
            Más que un corte <br /> es una <span className="italic text-gold">identidad</span>
          </h1>
          
          <p className="font-serif italic text-xl md:text-2xl text-prestige-muted mb-12 max-w-xl mx-auto">
            La mejor experiencia de barbería tradicional en Valledupar.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBookClick}
            className="px-12 py-5 bg-gold text-black font-bold uppercase tracking-[0.3em] text-[10px] transition-all hover:opacity-90"
          >
            Agendar Cita Ahora
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator - refined */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-prestige-muted"
      >
        <span className="text-[10px] uppercase tracking-[0.5em] font-medium">Prestige</span>
        <div className="w-[1px] h-10 bg-gold/20" />
      </motion.div>
    </div>
  );
}
