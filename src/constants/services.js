import {
    Stethoscope,
    Activity,
    Baby,
    HeartPulse,
    UserCheck
} from 'lucide-react';

export const SERVICES = [
    {
        title: "Cáncer de Cuello Uterino",
        description: "Detección temprana y tratamiento especializado para prevenir y combatir el cáncer.",
        icon: Stethoscope,
        colorAccent: "text-pink-500",
        bgAccent: "bg-pink-50",
        bullets: ["Papanicolaou", "Colposcopía", "Biopsia"],
        category: "Prevención"
    },
    {
        title: "Control Preventivo de Mama",
        description: "Evaluación integral para el cuidado de la salud mamaria y detección precoz.",
        icon: Activity, // Use a relevant icon
        colorAccent: "text-purple-500",
        bgAccent: "bg-purple-50",
        bullets: ["Examen físico", "Ecografía", "Mamografía"],
        category: "Prevención"
    },
    {
        title: "Menopausia",
        description: "Acompañamiento en esta etapa con tratamientos para mejorar tu calidad de vida.",
        icon: HeartPulse,
        colorAccent: "text-teal-500",
        bgAccent: "bg-teal-50",
        bullets: ["Terapia hormonal", "Nutrición", "Control óseo"],
        category: "Hormonal"
    },
    {
        title: "Planificación Familiar",
        description: "Asesoramiento y métodos anticonceptivos adaptados a tus necesidades.",
        icon: UserCheck,
        colorAccent: "text-blue-500",
        bgAccent: "bg-blue-50",
        bullets: ["DIU / SIU", "Implantes", "Pastillas"],
        category: "Procedimientos"
    },
    {
        title: "Miomatosis Uterina",
        description: "Diagnóstico y opciones de tratamiento para miomas uterinos.",
        icon: Baby,
        colorAccent: "text-rose-500",
        bgAccent: "bg-rose-50",
        bullets: ["Ecografía 3D", "Tratamiento médico", "Cirugía"],
        category: "Procedimientos"
    },
];

export const SERVICE_FILTERS = ["Todos", "Prevención", "Hormonal", "Procedimientos"];
