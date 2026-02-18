"use client";
import { useState } from 'react';
import ServiceCard from './ServiceCard';
import { SERVICES, SERVICE_FILTERS } from '../constants/services';
import { LINKS } from '../constants/links';

const Services = () => {
    const [activeFilter, setActiveFilter] = useState("Todos");

    const filteredServices = activeFilter === "Todos"
        ? SERVICES
        : SERVICES.filter(s => s.category === activeFilter);

    return (
        <section id="servicios" className="py-24 bg-gray-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16 space-y-4">
                    <span className="text-[#F48FB1] font-bold tracking-widest uppercase text-sm">Nuestros Servicios</span>
                    <h2 className="text-4xl font-bold text-gray-900">Cuidado Integral Especializado</h2>
                    <div className="flex justify-center flex-wrap gap-4 mt-8">
                        {SERVICE_FILTERS.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeFilter === filter
                                    ? 'bg-[#6A4C93] text-white shadow-lg shadow-[#6A4C93]/30 scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
                    {filteredServices.map((service, index) => (
                        <ServiceCard key={index} {...service} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        ¿No encuentras lo que buscas? Contáctanos para una consulta personalizada.
                    </p>
                    <a
                        href={LINKS.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[#2A9D8F] font-bold hover:text-[#218175] transition-colors border-b-2 border-[#2A9D8F] hover:border-[#218175] pb-0.5"
                    >
                        Consultar otros servicios
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Services;
