import { LINKS } from '../constants/links';
import { ShieldCheck, HeartPulse } from 'lucide-react';
import FlyerCarousel from './FlyerCarousel';

const Hero = () => {
    return (
        <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white to-[#F3E5F5] pt-32 lg:pt-32">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#F48FB1] rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#6A4C93] rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Text Content */}
                <div className="space-y-8 animate-fade-in-up order-2 lg:order-1 text-center lg:text-left">
                    <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-[#6A4C93]/10 shadow-sm mx-auto lg:mx-0">
                        <span className="w-2 h-2 rounded-full bg-[#2A9D8F] animate-ping"></span>
                        <span className="text-sm font-medium text-[#6A4C93]">Ginecología y Obstetricia de Vanguardia</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-gray-900">
                        Cuidando tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A4C93] to-[#F48FB1]">salud</span> en cada etapa de tu vida.
                    </h1>

                    <p className="text-xl text-gray-600 max-w-lg leading-relaxed mx-auto lg:mx-0">
                        Prevención, diagnóstico oportuno y tratamiento especializado. Tu bienestar es nuestra prioridad, con un enfoque humano y profesional.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <a
                            href={LINKS.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#2A9D8F] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#2A9D8F]/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center"
                        >
                            Agendar Cita
                        </a>
                        <a
                            href="#servicios"
                            className="px-8 py-4 rounded-2xl font-bold text-lg border-2 border-[#6A4C93] text-[#6A4C93] hover:bg-[#6A4C93] hover:text-white transition-all duration-300 text-center"
                        >
                            Ver Servicios
                        </a>
                    </div>

                    <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"></div>
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-300"></div>
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-400"></div>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">+500 Pacientes Satisfechas</p>
                    </div>
                </div>

                {/* Visual Content - Flyer Carousel */}
                <div className="relative animate-fade-in-left order-1 lg:order-2 flex justify-center lg:block w-full">
                    <div className="relative z-10 w-full flex justify-center lg:block">
                        <FlyerCarousel />

                        {/* Floating Badges - Positioned outside carousel for depth */}
                        <div className="absolute -top-6 -right-2 lg:-left-20 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border-l-4 border-[#F48FB1] animate-float hidden sm:block">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-[#F48FB1]/10 rounded-full text-[#F48FB1]">
                                    <HeartPulse size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">Atención</p>
                                    <p className="text-xs text-gray-500">Personalizada</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-6 -left-4 lg:-left-12 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border-l-4 border-[#2A9D8F] animate-float-delayed hidden sm:block">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-[#2A9D8F]/10 rounded-full text-[#2A9D8F]">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">Diagnóstico</p>
                                    <p className="text-xs text-gray-500">Oportuno</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;
