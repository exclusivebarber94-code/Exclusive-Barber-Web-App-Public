import React from 'react';
import { motion } from 'motion/react';
import { Scissors, Zap, ShieldCheck } from 'lucide-react';
import { Service } from '../types';

const defaultServices: Service[] = [
  {
    id: '1',
    name: 'Corte Premium',
    description: 'Corte magistral con técnicas de visagismo y lavado premium.',
    price: 35000,
    duration: 45
  },
  {
    id: '2',
    name: 'Corte y Barba',
    description: 'La experiencia completa: corte premium y ritual de barba con toalla caliente.',
    price: 55000,
    duration: 60
  },
  {
    id: '3',
    name: 'Aminoácidos',
    description: 'Tratamiento capilar profundo para nutrición y alisado progresivo.',
    price: 120000,
    duration: 120
  },
  {
    id: '4',
    name: 'Barba',
    description: 'Perfilado impecable con productos de alta gama y toalla caliente.',
    price: 25000,
    duration: 30
  },
  {
    id: '5',
    name: 'Corte Rapado',
    description: 'Corte uniforme y preciso con terminaciones limpias al detalle.',
    price: 20000,
    duration: 30
  }
];

export default function Services() {
  return (
    <section id="services" className="py-32 bg-prestige-bg border-t border-gold/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-gold/10">
          {defaultServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-12 bg-prestige-bg hover:bg-zinc-900 transition-all duration-500 flex flex-col justify-between"
            >
              <div className="mb-10">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">
                    {service.name}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-medium">
                    {service.duration >= 60 
                      ? `${Math.floor(service.duration / 60)}h ${service.duration % 60 > 0 ? `${service.duration % 60}m` : ''}`
                      : `${service.duration} min`}
                  </span>
                </div>
                <p className="text-prestige-muted text-sm font-light leading-relaxed mb-8">
                  {service.description}
                </p>
              </div>
              <div className="mt-auto">
                <span className="text-2xl font-light text-white font-serif">
                  ${service.price.toLocaleString('es-CO')}
                </span>
              </div>
              
              {/* Subtle hover indicator */}
              <div className="absolute top-0 left-0 w-[2px] h-0 bg-gold transition-all duration-500 group-hover:h-full" />
            </motion.div>
          ))}
        </div>

        {/* Feature section - refined */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { title: 'Tradición', desc: 'Sillas de diseño y ambiente privado.' },
            { title: 'Técnica', desc: 'Maestría en visagismo y barbería clásica.' },
            { title: 'Exclusividad', desc: 'Atención personalizada para caballeros.' }
          ].map((item, i) => (
            <div key={i} className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold">{item.title}</h4>
              <p className="text-xs text-prestige-muted italic serif leading-loose">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
