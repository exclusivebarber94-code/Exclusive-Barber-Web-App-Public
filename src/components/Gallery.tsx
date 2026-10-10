import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'hombre', name: 'Hombre' },
  { id: 'barba', name: 'Barba' },
  { id: 'ninos', name: 'Niños' },
];

const galleryImages = [
  {
    id: 1,
    category: 'hombre',
    title: 'Fade Clásico',
    url: 'https://picsum.photos/seed/barber1/800/800',
  },
  {
    id: 2,
    category: 'barba',
    title: 'Perfilado de Barba',
    url: 'https://picsum.photos/seed/beard1/800/800',
  },
  {
    id: 3,
    category: 'ninos',
    title: 'Corte Infantil Moderno',
    url: 'https://picsum.photos/seed/kids1/800/800',
  },
  {
    id: 4,
    category: 'hombre',
    title: 'Buzz Cut',
    url: 'https://picsum.photos/seed/barber2/800/800',
  },
  {
    id: 5,
    category: 'barba',
    title: 'Barba Larga Estilizada',
    url: 'https://picsum.photos/seed/beard2/800/800',
  },
  {
    id: 6,
    category: 'ninos',
    title: 'Corte Clásico para Niños',
    url: 'https://picsum.photos/seed/kids2/800/800',
  },
  {
    id: 7,
    category: 'hombre',
    title: 'Pompadour',
    url: 'https://picsum.photos/seed/barber3/800/800',
  },
  {
    id: 8,
    category: 'barba',
    title: 'Goatee Perfecto',
    url: 'https://picsum.photos/seed/beard3/800/800',
  },
];

export default function Gallery() {
  const [filter, setFilter] = React.useState('all');

  const filteredImages = filter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  return (
    <section id="gallery" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-serif text-white mb-4">Nuestra <span className="italic text-gold">Galería</span></h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-8" />
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={cn(
                  "px-6 py-2 text-[10px] uppercase font-bold tracking-widest transition-all border",
                  filter === cat.id 
                    ? "bg-gold text-black border-gold" 
                    : "bg-transparent text-prestige-muted border-white/10 hover:border-gold/50"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative aspect-square overflow-hidden bg-zinc-900 border border-white/5"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                  <h4 className="text-gold font-serif italic text-xl mb-2">{image.title}</h4>
                  <p className="text-white/60 text-[10px] uppercase tracking-widest">{image.category === 'ninos' ? 'Niños' : image.category}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
