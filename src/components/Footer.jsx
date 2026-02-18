import { LINKS, NAVIGATION } from '../constants/links';
import { Facebook, Instagram, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 border-b border-gray-800 pb-12">

                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-[#F48FB1]">Dr. Álex Criollo R.</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Cuidando tu salud femenina con experiencia, tecnología y empatía.
                        </p>
                        <div className="flex space-x-4">
                            <a href={LINKS.social.facebook} className="p-2 bg-gray-800 rounded-full hover:bg-[#6A4C93] transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href={LINKS.social.instagram} className="p-2 bg-gray-800 rounded-full hover:bg-[#F48FB1] transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#2A9D8F] transition-colors">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Enlaces Rápidos</h4>
                        <ul className="space-y-4">
                            {NAVIGATION.map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Términos de Uso</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Contacto</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start">
                                <span className="block text-white font-medium mr-2">Dirección:</span>
                                {LINKS.address}
                            </li>
                            <li className="flex items-start">
                                <span className="block text-white font-medium mr-2">Teléfono:</span>
                                099 269 6599
                            </li>
                            <li className="flex items-start">
                                <span className="block text-white font-medium mr-2">Email:</span>
                                info@dralexcriollo.com
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="text-center text-gray-600 text-sm">
                    <p>&copy; {new Date().getFullYear()} Dr. Álex Criollo R. - Todos los derechos reservados.</p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
