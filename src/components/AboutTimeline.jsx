import { Award, CheckCircle2, BadgeCheck, GraduationCap, Stethoscope, ArrowRight } from 'lucide-react';

import ProfilePic from '../styles/Fotos/perfil/2p.jpeg';

const AboutTimeline = () => {
    // Variables para ajustar el tamaño de la imagen de perfil
    const heightMobile = "h-[250px]";
    const widthMobile = "w-[250px]";
    const heightDesktop = "sm:h-[380px]";
    const widthDesktop = "sm:w-[380px]";

    // TikTok Link
    const tiktokLink = "http://tiktok.com/@dr.alexcriollo.go";

    return (
        <section id="sobre-mi" className="py-24 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50/50 rounded-full blur-3xl opacity-60 -translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Information */}
                    <div className="order-2 lg:order-1 space-y-8">

                        {/* Credibility Statement */}
                        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5">
                            <BadgeCheck className="w-5 h-5 text-blue-600" />
                            <span className="text-blue-800 text-sm font-semibold tracking-wide">
                                Más de 20 años de experiencia médica
                            </span>
                        </div>

                        {/* Name & Title */}
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                                Dr. Álex Javier <br />
                                <span className="text-blue-600">Criollo Rodríguez</span>
                            </h2>
                            <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-lg">
                                6 años dedicados exclusivamente a la Ginecología y Obstetricia, brindando atención integral y humana.
                            </p>
                        </div>

                        {/* Academic Background */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                <GraduationCap className="w-6 h-6 text-blue-600" />
                                Formación Académica
                            </h3>

                            <div className="grid gap-4">
                                {/* Degree 1 */}
                                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600 shrink-0">
                                        <Stethoscope size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Doctor en Medicina y Cirugía</h4>
                                        <p className="text-sm text-blue-600 font-medium mb-1">Universidad Central del Ecuador</p>
                                        <p className="text-sm text-slate-500">Formación médica general completa y habilitación profesional.</p>
                                    </div>
                                </div>

                                {/* Degree 2 */}
                                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600 shrink-0">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Especialista en Ginecología y Obstetricia</h4>
                                        <p className="text-sm text-blue-600 font-medium mb-1">Pontificia Universidad Católica del Ecuador</p>
                                        <p className="text-sm text-slate-500">Formación especializada en salud femenina, embarazo y parto.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <a
                                href="#contacto"
                                className="inline-flex justify-center items-center px-8 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                            >
                                Agendar una cita
                            </a>
                            <a
                                href={tiktokLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex justify-center items-center px-8 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors"
                            >
                                Conocer más sobre el Dr.
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Profile Image */}
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                        <div className="relative group">
                            {/* Decorative backdrop */}
                            <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-2xl transform scale-110"></div>

                            <div className={`relative ${heightMobile} ${widthMobile} ${heightDesktop} ${widthDesktop} rounded-full border-8 border-white shadow-2xl overflow-hidden ring-1 ring-slate-100`}>
                                <img
                                    src={ProfilePic.src || ProfilePic}
                                    alt="Dr. Álex Criollo"
                                    className="w-full h-full object-cover object-top scale-110 transform group-hover:scale-115 transition-transform duration-700"
                                />
                            </div>

                            {/* Floating Badge (optional aesthetic touch) */}
                            <div className="absolute bottom-4 right-0 lg:right-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 animate-bounce-slow hidden sm:block">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Estado</p>
                                        <p className="text-sm font-bold text-slate-800">Disponible</p>
                                    </div>
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
