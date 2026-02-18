import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutTimeline from '../components/AboutTimeline';
import Services from '../components/Services';
import AppointmentCTA from '../components/AppointmentCTA';
import Location from '../components/Location';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="font-sans text-gray-900 bg-white">
      <Navbar />
      <Hero />
      <AboutTimeline />
      <Services />
      <AppointmentCTA />
      <Location />
      <Footer />
    </div>
  );
}
