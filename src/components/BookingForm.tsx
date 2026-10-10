import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Phone, CheckCircle2, Plus, Trash2, UserPlus, Scissors } from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '../lib/utils';

export default function BookingForm() {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: ''
  });

  const [appointments, setAppointments] = React.useState([
    { id: 1, label: 'Tú', serviceId: '' }
  ]);

  const addCompanion = () => {
    if (appointments.length < 8) {
      setAppointments([...appointments, { id: Date.now(), label: `Acompañante ${appointments.length}`, serviceId: '' }]);
    }
  };

  const removeCompanion = (id: number) => {
    if (appointments.length > 1) {
      setAppointments(appointments.filter(a => a.id !== id));
    }
  };

  const updateService = (id: number, serviceId: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, serviceId } : a));
  };

  const services = [
    { id: '1', label: 'Corte Premium', price: 35000, duration: 45 },
    { id: '2', label: 'Corte y Barba', price: 55000, duration: 60 },
    { id: '3', label: 'Aminoácidos', price: 120000, duration: 120 },
    { id: '4', label: 'Barba', price: 25000, duration: 30 },
    { id: '5', label: 'Corte Rapado', price: 20000, duration: 30 }
  ];

  const addMinutesToTime = (time: string, minutes: number) => {
    const [timeStr, period] = time.split(' ');
    let [hours, mins] = timeStr.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const totalMinutes = hours * 60 + mins + minutes;
    const newHours24 = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    
    const newPeriod = newHours24 >= 12 ? 'PM' : 'AM';
    const newHours12 = newHours24 % 12 || 12;
    
    return `${newHours12}:${newMins.toString().padStart(2, '0')} ${newPeriod}`;
  };

  const calculateTimeline = React.useCallback(() => {
    if (!formData.time) return [];
    
    let currentStartTime = formData.time;
    return appointments.map(apt => {
      const service = services.find(s => s.id === apt.serviceId);
      const duration = service?.duration || 0;
      const startTime = currentStartTime;
      const endTime = addMinutesToTime(startTime, duration);
      currentStartTime = endTime;
      return { ...apt, startTime, endTime, serviceLabel: service?.label, duration };
    });
  }, [formData.time, appointments]);

  const timeline = calculateTimeline();

  const generateTimeSlots = () => {
    const slots = [];
    const morningStart = 8 * 60 + 30; // 08:30 in minutes
    const morningEnd = 12 * 60; // 12:00 in minutes
    const afternoonStart = 14 * 60; // 14:00 in minutes
    const afternoonEnd = 19 * 60 + 15; // 19:15 in minutes

    const addSlotsInRange = (start: number, end: number) => {
      for (let i = start; i < end; i += 15) {
        const hours24 = Math.floor(i / 60);
        const minutes = i % 60;
        const period = hours24 >= 12 ? 'PM' : 'AM';
        const hours12 = hours24 % 12 || 12;
        slots.push(`${hours12}:${minutes.toString().padStart(2, '0')} ${period}`);
      }
    };

    addSlotsInRange(morningStart, morningEnd);
    addSlotsInRange(afternoonStart, afternoonEnd);
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const next14Days = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <section id="book" className="py-32 bg-prestige-bg border-t border-gold/5 overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-serif text-white mb-4">Agendar <span className="italic text-gold">Cita</span></h2>
          <p className="text-prestige-muted uppercase tracking-[0.4em] text-[10px] font-bold">Valledupar, Cesar</p>
        </div>

        <div className="bg-prestige-surface p-12 border border-gold/10 relative">
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-12 h-[1px] bg-gold" />
          <div className="absolute top-0 right-0 w-[1px] h-12 bg-gold" />

          {step === 3 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 border border-gold rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10 text-gold" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-4 italic">Solicitud Recibida</h3>
              <p className="text-prestige-muted mb-10 font-light text-sm tracking-wide">
                Estamos procesando tu reserva. Recibirás una confirmación en breve.
              </p>
              <button 
                onClick={() => setStep(1)}
                className="px-12 py-4 bg-gold text-black font-bold uppercase tracking-[0.3em] text-[10px]"
              >
                Volver al Inicio
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Nombre Completo</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-gold transition-colors font-light"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Teléfono de Contacto</label>
                    <input 
                      required
                      type="tel"
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-gold transition-colors font-light"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={nextStep}
                    className="w-full py-5 bg-gold text-black font-bold uppercase tracking-[0.3em] text-[10px] mt-8"
                  >
                    Siguiente Paso
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  {/* Appointments Matrix */}
                  <div className="space-y-8">
                    {appointments.map((apt, index) => (
                      <div key={apt.id} className="space-y-6 pb-8 border-b border-white/5 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                              <User className="w-4 h-4 text-gold" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-white">{apt.label}</span>
                          </div>
                          {index > 0 && (
                            <button 
                              type="button"
                              onClick={() => removeCompanion(apt.id)}
                              className="text-white/40 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-prestige-muted font-bold block">Seleccione Servicio</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {services.map((service) => (
                              <button
                                key={service.id}
                                type="button"
                                onClick={() => updateService(apt.id, service.id)}
                                className={cn(
                                  "py-3 px-2 text-[9px] font-bold uppercase tracking-wider border transition-all text-center flex flex-col items-center justify-center min-h-[60px] gap-1",
                                  apt.serviceId === service.id 
                                    ? "bg-gold text-black border-gold" 
                                    : "bg-transparent text-prestige-muted border-white/10 hover:border-gold/30"
                                )}
                              >
                                <span className="block">{service.label}</span>
                                <span className={cn(
                                  "text-[8px] font-medium",
                                  apt.serviceId === service.id ? "text-black/60" : "text-gold/80"
                                )}>
                                  ${service.price.toLocaleString('es-CO')}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {appointments.length < 8 && (
                      <button
                        type="button"
                        onClick={addCompanion}
                        className="w-full py-4 border border-gold/20 border-dashed text-gold text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-gold/5 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        Añadir Acompañante / Hijo
                      </button>
                    )}
                  </div>

                  {/* Horizontal Date Selector */}
                  <div className="space-y-6 pt-4 border-t border-white/5">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold block">Seleccione Fecha</label>
                    <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide snap-x">
                      {next14Days.map((date) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const isSelected = formData.date === dateStr;
                        return (
                          <button
                            key={dateStr}
                            type="button"
                            onClick={() => setFormData({ ...formData, date: dateStr })}
                            className={cn(
                              "flex-shrink-0 w-20 py-4 flex flex-col items-center justify-center border transition-all snap-start",
                              isSelected 
                                ? "bg-gold text-black border-gold" 
                                : "bg-transparent text-prestige-muted border-white/10 hover:border-gold/30"
                            )}
                          >
                            <span className="text-[10px] uppercase font-bold tracking-tighter mb-1">
                              {format(date, 'EEE', { locale: es })}
                            </span>
                            <span className="text-lg font-serif">
                              {format(date, 'd')}
                            </span>
                            <span className="text-[8px] uppercase tracking-widest mt-1">
                              {format(date, 'MMM', { locale: es })}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold block">Seleccione Horario de Inicio</label>
                    <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setFormData({...formData, time})}
                          className={cn(
                            "py-3 text-[10px] font-bold tracking-widest border transition-all",
                            formData.time === time 
                              ? "bg-gold text-black border-gold" 
                              : "bg-transparent text-prestige-muted border-white/10 hover:border-gold/50"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sequential Timeline Summary */}
                  {formData.time && appointments.every(a => a.serviceId) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-black/20 p-6 border-l-2 border-gold/30 space-y-4"
                    >
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Itinerario Sugerido para tu Grupo
                      </h4>
                      <div className="space-y-4">
                        {timeline.map((item, idx) => (
                          <div key={item.id} className="flex items-start gap-4 text-xs">
                            <div className="flex flex-col items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                              {idx < timeline.length - 1 && <div className="w-[1px] h-8 bg-gold/20 my-1" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-white flex justify-between">
                                <span className="font-bold">{item.label}</span>
                                <span className="text-prestige-muted">{item.startTime} - {item.endTime}</span>
                              </p>
                              <p className="text-[10px] text-prestige-muted uppercase tracking-wider">{item.serviceLabel} ({item.duration} min)</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-5 border border-white/10 text-prestige-muted font-bold uppercase tracking-[0.3em] text-[10px] hover:text-white transition-all"
                    >
                      Atrás
                    </button>
                    <button 
                      type="submit"
                      disabled={!formData.time || appointments.some(a => !a.serviceId)}
                      className="flex-[2] py-5 bg-gold text-black font-bold uppercase tracking-[0.3em] text-[10px] disabled:opacity-50"
                    >
                      Confirmar Reserva ({appointments.length} Persona{appointments.length > 1 ? 's' : ''})
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
