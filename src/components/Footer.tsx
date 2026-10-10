import React from 'react';
import { Scissors, Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-prestige-bg border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">
          Exclusive Barber Shop
        </div>
        
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-prestige-muted">
          <a href="#" className="hover:text-white transition-colors">Servicios</a>
          <a href="#" className="hover:text-white transition-colors">Galería</a>
          <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors">WhatsApp</a>
          <a href="#" className="hover:text-white transition-colors">Ubicación</a>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 text-[10px] uppercase tracking-[0.1em] text-prestige-muted">
          <div className="flex gap-4">
            <span className="font-bold text-gold">M-S</span>
            <span>08:30 - 12:00 | 14:00 - 19:00</span>
          </div>
          <div>Valledupar, Cesar &bull; 2026</div>
        </div>
      </div>
    </footer>
  );
}
