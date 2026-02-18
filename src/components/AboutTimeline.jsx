import { TIMELINE_DATA, CREDENTIALS } from '../constants/timeline';
import { Award, CheckCircle2 } from 'lucide-react';
import DoctorProfile from '../styles/Fotos/QuienSoy.jpeg'; // Using QuienSoy image

const AboutTimeline = () => {
    return (
        <section id="sobre-mi" className="py-24 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#F3E5F5] rounded-full blur-3xl opacity-50 -translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Sobre Mí</h2>
                    <div className="w-24 h-1 bg-[#2A9D8F] mx-auto rounded-full"></div>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        "Mi enfoque: prevención, acompañamiento, empatía y evidencia clínica."
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Profile Card - Enhanced Size and Visuals */}
                    <div className="sticky top-24 lg:pr-8">
                        <div className="group relative">
                            {/* Decorative border offset */}
                            <div className="absolute inset-0 border-2 border-[#6A4C93]/10 rounded-3xl transform translate-x-4 translate-y-4 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>

                            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_25px_60px_-15px_rgba(106,76,147,0.15)]">
                                {/* Large Hero Image Container */}
                                <div className="relative h-[520px] sm:h-[600px] lg:h-[720px] overflow-hidden">
                                    <img
                                        src={DoctorProfile.src || DoctorProfile}
                                        alt="Dr. Álex Criollo"
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
                                        <h3 className="text-3xl md:text-4xl font-bold mb-2">Dr. Álex Criollo R.</h3>
                                        <p className="text-[#F48FB1] font-semibold text-lg tracking-wide uppercase">Ginecólogo Obstetra</p>
                                    </div>
                                </div>

                                {/* Credentials / Quick Stats */}
                                <div className="p-8 bg-white relative z-20 -mt-4 rounded-t-3xl space-y-4">
                                    {CREDENTIALS.map((cred, idx) => (
                                        <div key={idx} className="flex items-center space-x-3 text-gray-700 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                            <div className="flex-shrink-0 p-1.5 bg-[#F3E5F5] rounded-full text-[#6A4C93]">
                                                <Award size={18} />
                                            </div>
                                            <span className="text-sm font-medium">{cred}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline - Adjusted for balance */}
                    <div className="space-y-12 lg:pt-8">
                        <div className="relative border-l-2 border-gray-200 ml-4 space-y-16">
                            {TIMELINE_DATA.map((item, index) => (
                                <div key={index} className="relative pl-10 group">
                                    {/* Timeline Dot */}
                                    <span className="absolute -left-[9px] top-2 h-4 w-4 rounded-full bg-white border-4 border-[#2A9D8F] group-hover:scale-125 group-hover:border-[#6A4C93] transition-all duration-300 shadow-sm"></span>

                                    {/* Content */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                                        <span className="inline-block px-3 py-1 rounded-full bg-[#F3E5F5] text-[#6A4C93] text-xs font-bold tracking-wider uppercase mb-2 sm:mb-0">
                                            {item.year}
                                        </span>
                                    </div>

                                    <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#6A4C93] transition-colors">
                                        {item.title}
                                    </h4>

                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-br from-[#F3E5F5] to-white rounded-2xl p-8 border border-[#6A4C93]/10 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-start space-x-5">
                                <div className="bg-[#6A4C93] p-3 rounded-xl text-white shadow-lg shadow-[#6A4C93]/20">
                                    <CheckCircle2 size={32} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl text-gray-900 mb-3">Compromiso Total</h4>
                                    <p className="text-gray-700 leading-relaxed">
                                        Me mantengo en constante actualización para brindarte los tratamientos más modernos y seguros del campo ginecológico, asegurando siempre tu tranquilidad y bienestar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutTimeline;
