import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import BookingForm from './components/BookingForm';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

export default function App() {
  const [currentPage, setCurrentPage] = React.useState('home');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    // If it's a section on the main page, scroll to it
    if (page === 'home' || page === 'services' || page === 'gallery' || page === 'book') {
      if (currentPage === 'admin') {
        setCurrentPage('home');
        setTimeout(() => scrollToSection(page === 'home' ? 'root' : page), 100);
      } else {
        scrollToSection(page === 'home' ? 'root' : page);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      
      {currentPage === 'admin' ? (
        <AdminDashboard />
      ) : (
        <main>
          <Hero onBookClick={() => handleNavigate('book')} />
          <Services />
          <Gallery />
          <BookingForm />
        </main>
      )}

      <Footer />
    </div>
  );
}
