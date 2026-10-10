export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
}

export interface Appointment {
  id: string;
  customerName: string;
  serviceId: string;
  date: string; // ISO string
  status: 'pending' | 'completed' | 'cancelled';
}

export interface DailyReport {
  date: string;
  revenue: number;
  appointments: number;
}
