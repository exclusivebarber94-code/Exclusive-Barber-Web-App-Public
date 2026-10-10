import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, Users, Calendar as CalendarIcon, DollarSign,
  Search, Filter, MoreVertical, Scissors, Download
} from 'lucide-react';
import { DailyReport } from '../types';
import { cn } from '../lib/utils';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
};

const mockData: DailyReport[] = [
  { date: '14 Abr', revenue: 250000, appointments: 8 },
  { date: '15 Abr', revenue: 380000, appointments: 12 },
  { date: '16 Abr', revenue: 420000, appointments: 15 },
  { date: '17 Abr', revenue: 310000, appointments: 10 },
  { date: '18 Abr', revenue: 550000, appointments: 18 },
  { date: '19 Abr', revenue: 480000, appointments: 16 },
  { date: '20 Abr', revenue: 620000, appointments: 21 },
];

const barberRevenueData = {
  diario: [
    { name: 'Carlos', revenue: 150000 },
    { name: 'Andrés', revenue: 120000 },
    { name: 'Mateo', revenue: 180000 },
    { name: 'Luis', revenue: 90000 },
    { name: 'Juan', revenue: 80000 },
  ],
  semanal: [
    { name: 'Carlos', revenue: 1250000 },
    { name: 'Andrés', revenue: 980000 },
    { name: 'Mateo', revenue: 1120000 },
    { name: 'Luis', revenue: 890000 },
    { name: 'Juan', revenue: 750000 },
  ],
  quincenal: [
    { name: 'Carlos', revenue: 2600000 },
    { name: 'Andrés', revenue: 2100000 },
    { name: 'Mateo', revenue: 2450000 },
    { name: 'Luis', revenue: 1950000 },
    { name: 'Juan', revenue: 1680000 },
  ],
  mensual: [
    { name: 'Carlos', revenue: 5200000 },
    { name: 'Andrés', revenue: 4300000 },
    { name: 'Mateo', revenue: 4900000 },
    { name: 'Luis', revenue: 3800000 },
    { name: 'Juan', revenue: 3400000 },
  ]
};

const mockAppointments = [
  { id: '1', name: 'Carlos Mendoza', service: 'Corte Fade', time: '10:00', price: 35000, status: 'Completado' },
  { id: '2', name: 'Andrés López', service: 'Barba Esculpida', time: '11:15', price: 25000, status: 'En Proceso' },
  { id: '3', name: 'Mateo Sánchez', service: 'Ritual Exclusive', time: '12:30', price: 55000, status: 'Pendiente' },
  { id: '4', name: 'Luis García', service: 'Corte Fade', time: '14:00', price: 35000, status: 'Pendiente' },
];

export default function AdminDashboard() {
  const [period, setPeriod] = React.useState<keyof typeof barberRevenueData>('semanal');

  const processedBarberData = React.useMemo(() => {
    return barberRevenueData[period].map(item => ({
      ...item,
      barberShare: item.revenue * 0.6,
      shopShare: item.revenue * 0.4
    }));
  }, [period]);

  const totals = React.useMemo(() => {
    const total = processedBarberData.reduce((acc, b) => acc + b.revenue, 0);
    const shop = total * 0.4;
    return { total, shop };
  }, [processedBarberData]);

  const stats = React.useMemo(() => {
    const todayRevenue = 620000;
    const todayShopShare = todayRevenue * 0.4;

    return [
      { label: 'Ingresos Hoy', value: formatCurrency(todayRevenue), icon: DollarSign },
      { label: 'Ganancia Local Hoy', value: formatCurrency(todayShopShare), icon: TrendingUp, highlight: true },
      { label: 'Citas Hoy', value: '21', icon: CalendarIcon },
      { label: 'Nuevos Clientes', value: '8', icon: Users },
      { label: 'Servicio Top', value: 'Fade', icon: Scissors },
    ];
  }, []);

  return (
    <section id="admin" className="py-24 bg-prestige-bg pt-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20">
          <div>
            <h2 className="text-5xl font-serif text-white mb-4">Control <span className="italic text-gold">Prestige</span></h2>
            <p className="text-prestige-muted uppercase tracking-[0.5em] text-[10px] font-bold">Métricas y Rendimiento</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-prestige-muted hover:text-gold transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Reporte
            </button>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="px-4 py-2 border border-gold/20 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Online</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[1px] bg-white/5 mb-20 border border-white/5">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-10 bg-prestige-bg group hover:bg-zinc-900 transition-all duration-500",
                stat.highlight && "bg-zinc-900/50 border-x border-gold/20"
              )}
            >
              <div className="flex items-center justify-between mb-8">
                <stat.icon className={cn("w-5 h-5 transition-colors", stat.highlight ? "text-gold" : "text-gold/40 group-hover:text-gold")} />
              </div>
              <p className="text-prestige-muted text-[10px] uppercase tracking-[0.4em] font-bold mb-2">{stat.label}</p>
              <p className={cn("text-3xl font-serif", stat.highlight ? "text-gold" : "text-white")}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5 border border-white/5 mb-20">
          <div className="p-12 bg-prestige-bg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
              <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-white">Rendimiento por Barbero</h3>
              <div className="flex bg-white/5 p-1 rounded-sm">
                {(['diario', 'semanal', 'quincenal', 'mensual'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={cn(
                      "px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all",
                      period === p ? "bg-gold text-black" : "text-prestige-muted hover:text-white"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Local Earnings Summary Box - Highlighted */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="p-8 border border-white/5 bg-zinc-900/30 flex flex-col justify-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-prestige-muted mb-2 font-bold">Facturación Total {period}</p>
                <p className="text-3xl font-serif text-white">{formatCurrency(totals.total)}</p>
              </div>
              <div className="p-8 border border-gold/30 bg-gold/5 flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold/10 -mr-8 -mt-8 rotate-45 group-hover:bg-gold/20 transition-colors" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2 font-bold leading-tight">Ganancia Local (40%)</p>
                <p className="text-3xl font-serif text-gold">{formatCurrency(totals.shop)}</p>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedBarberData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#444" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#444" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(v) => `$${(v/1000).toLocaleString('es-CO')}k`}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '0' }}
                    itemStyle={{ fontSize: '10px', textTransform: 'uppercase' }}
                    labelStyle={{ color: '#fff', marginBottom: '8px', borderBottom: '1px solid #1a1a1a', paddingBottom: '4px' }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value), 
                      name === 'barberShare' ? 'Barbero (60%)' : 'Barbería (40%)'
                    ]}
                  />
                  <Bar dataKey="barberShare" name="Barbero (60%)" stackId="revenue" fill="#D4AF37" radius={0} barSize={40} />
                  <Bar dataKey="shopShare" name="Barbería (40%)" stackId="revenue" fill="#3f3f46" radius={0} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#D4AF37]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-prestige-muted">Comisión Barbero</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#3f3f46]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-prestige-muted">Ganancia Local</span>
              </div>
            </div>
          </div>

          <div className="p-12 bg-prestige-bg">
            <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-white mb-12">Resumen Semanal</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#444" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#444" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '0' }}
                  />
                  <Bar dataKey="appointments" fill="#D4AF37" radius={0} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Appointments Table */}
        <div className="bg-prestige-bg border border-white/5">
          <div className="p-10 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-white">Historial Reciente</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="text" 
                  placeholder="BUSCAR CLIENTE" 
                  className="bg-zinc-900 border border-white/5 py-2 pl-10 pr-4 text-[10px] font-bold tracking-widest text-white focus:border-gold/50 outline-none w-64"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-10 py-6 text-[10px] font-bold text-prestige-muted uppercase tracking-[0.3em]">Cliente</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-prestige-muted uppercase tracking-[0.3em]">Servicio</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-prestige-muted uppercase tracking-[0.3em]">Hora</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-prestige-muted uppercase tracking-[0.3em]">Monto</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-prestige-muted uppercase tracking-[0.3em]">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-10 py-6">
                      <span className="text-xs uppercase tracking-widest text-white font-medium">{apt.name}</span>
                    </td>
                    <td className="px-10 py-6 text-xs text-prestige-muted italic serif">{apt.service}</td>
                    <td className="px-10 py-6 text-xs font-mono text-prestige-muted">{apt.time}</td>
                    <td className="px-10 py-6 text-xs text-gold font-bold">{formatCurrency(apt.price)}</td>
                    <td className="px-10 py-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gold/60">
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
