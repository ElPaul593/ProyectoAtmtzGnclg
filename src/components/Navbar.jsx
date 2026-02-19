"use client";
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NAVIGATION, LINKS } from '../constants/links';
import Logo from '../assets/logo.svg';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex-shrink-0 flex items-center">
                    <a href="#" className="flex items-center gap-3 group">
                        <img src={Logo.src || Logo} alt="Logo" className="h-12 w-12 transition-transform duration-300 group-hover:rotate-12" />
                        <span className="font-bold text-2xl text-[#6A4C93] tracking-tighter">
                            Dr. Álex Criollo R.
                        </span>
                    </a>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {NAVIGATION.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-gray-600 hover:text-[#6A4C93] font-medium transition-colors duration-200"
                        >
                            {item.name}
                        </a>
                    ))}
                    <a
                        href={LINKS.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#2A9D8F] text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Agendar Cita
                    </a>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-600 hover:text-[#6A4C93] focus:outline-none"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col space-y-4 animate-fade-in-down">
                    {NAVIGATION.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="text-gray-600 hover:text-[#6A4C93] font-medium block text-lg"
                        >
                            {item.name}
                        </a>
                    ))}
                    <a
                        href={LINKS.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                        className="bg-[#2A9D8F] text-white text-center px-6 py-3 rounded-xl font-semibold shadow-md active:scale-95 transition-all"
                    >
                        Agendar Cita
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
