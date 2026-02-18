import { ArrowRight, Check } from 'lucide-react';

const ServiceCard = ({
    title,
    description,
    icon: Icon,
    colorAccent,
    bgAccent,
    bullets,
    category
}) => {
    return (
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-gray-100 overflow-hidden flex flex-col h-full">
            {/* Hover Gradient Overlay */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${bgAccent.replace('bg-', 'bg-gradient-to-br from-white to-')}`}></div>

            <div className="p-8 relative z-10 flex-grow">
                <div className={`w-16 h-16 rounded-2xl ${bgAccent} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${colorAccent}`} />
                </div>

                <div className="mb-4">
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${bgAccent} ${colorAccent}`}>
                        {category}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#6A4C93] transition-colors">
                    {title}
                </h3>

                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {description}
                </p>

                <ul className="space-y-2 mb-8">
                    {bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-500">
                            <Check size={16} className={`mr-2 mt-0.5 ${colorAccent}`} />
                            {bullet}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-6 border-t border-gray-50 bg-gray-50/50 group-hover:bg-white transition-colors relative z-10 mt-auto">
                <div className="flex items-center justify-between">
                    <button className={`font-bold text-sm ${colorAccent} flex items-center group/btn hover:underline`}>
                        Más información
                        <ArrowRight size={16} className="ml-1 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                    <button className="bg-[#2A9D8F] text-white p-2 rounded-lg shadow-md hover:bg-[#218175] transition-colors">
                        <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
