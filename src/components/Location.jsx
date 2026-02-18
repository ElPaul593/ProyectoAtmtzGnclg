import { LINKS } from '../constants/links';
import { MapPin, Clock } from 'lucide-react';

const Location = () => {
    return (
        <section id="ubicacion" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <div className="space-y-8">
                        <div className="inline-block p-3 rounded-2xl bg-[#F3E5F5] text-[#6A4C93]">
                            <MapPin size={32} />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900">Visítanos en nuestra clínica</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Ubicación céntrica y accesible. Contamos con instalaciones modernas y parqueadero para tu comodidad.
                        </p>

                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start space-x-4">
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <MapPin className="text-[#2A9D8F]" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Dirección</h4>
                                    <p className="text-gray-600">{LINKS.address}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start space-x-4">
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <Clock className="text-[#F48FB1]" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Horarios de Atención</h4>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 shadow-sm">Lun - Vie: 09:00 - 18:00</span>
                                        <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 shadow-sm">Sáb: 09:00 - 13:00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a
                            href={LINKS.maps}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-[#6A4C93] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-[#583C7E] transition-all hover:-translate-y-1"
                        >
                            Cómo llegar
                        </a>
                    </div>

                    <div className="h-[500px] w-full bg-gray-200 rounded-3xl overflow-hidden shadow-2xl relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15950.048704040954!2d-78.6276856!3d-1.2415518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d381a176825c5d%3A0x6b6e4e548682a20!2sJuan%20Benigno%20Vela%20y%20Quito%2C%20Ambato%2C%20Ecuador!5e0!3m2!1ses!2sus!4v1704930000000!5m2!1ses!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Google Maps Location"
                            className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700"
                        ></iframe>

                        {/* Overlay hint */}
                        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Location;
