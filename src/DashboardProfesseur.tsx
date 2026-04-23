import React, { useState } from 'react';
import {
    Home,
    GraduationCap,
    Users,
    Calendar,
    FileUp,
    CheckSquare,
    Search,
    Bell,
    User,
    ChevronDown,
    Clock,
    FileText,
    MoreVertical,
    LogOut,
    Plus,
    BookOpen,
    ClipboardList,
    Download,
    Settings,
    FileSpreadsheet,
    Filter,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Theme Colors ---
const colors = {
    primary: '#8178BB',
    bg: '#F3F2F9',
    white: '#FFFFFF',
    text: '#2D2D2D',
    textMuted: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
};

// --- Types ---
type Page = 'dashboard' | 'courses' | 'grades' | 'exams' | 'notifications' | 'settings';

interface Course {
    id: string;
    title: string;
    class: string;
    hours: number;
    tasks: number;
    nextSession: string;
}

interface StudentGrade {
    id: string;
    nome: string;
    note: number | null;
}

// --- Mock Data ---
const MOCK_COURSES: Course[] = [
    { id: 'C001', title: 'Algorithmique & Complexité', class: 'L1 SIL - Groupe A', hours: 45, tasks: 4, nextSession: 'Demain, 08:00' },
    { id: 'C002', title: 'Développement Web Moderne', class: 'L2 SIL', hours: 60, tasks: 2, nextSession: 'Mercredi, 10:00' },
    { id: 'C003', title: 'Architecture Logicielle', class: 'M1 FCA', hours: 30, tasks: 1, nextSession: 'Jeudi, 14:00' },
];

const MOCK_SCHEDULER_EVENTS = [
    { id: 1, title: 'Algorithmique', start: '08:00', end: '10:00', room: 'A102', day: 'Lundi' },
    { id: 2, title: 'Algorithmique', start: '10:30', end: '12:30', room: 'A102', day: 'Mercredi' },
    { id: 3, title: 'TD Algorithmique', start: '14:00', end: '16:00', room: 'Lab 1', day: 'Vendredi' },
];

const MOCK_STUDENTS: StudentGrade[] = [
    { id: 'ST001', nome: 'Jean Kouassi', note: 15.5 },
    { id: 'ST002', nome: 'Mariam Diallo', note: 18 },
    { id: 'ST003', nome: 'Christelle Bognon', note: null },
    { id: 'ST004', nome: 'Moussa Traoré', note: 12.5 },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[18px] text-[12px] font-bold transition-all relative group overflow-hidden ${active
            ? 'bg-white text-[#8178BB] shadow-[0_15px_30px_rgba(0,0,0,0.12)]'
            : 'text-white/60 hover:text-white hover:bg-white/5 hover:translate-x-1'
        }`}
    >
        {active && (
            <motion.div
                layoutId="sidebarActiveBackground"
                className="absolute inset-0 bg-white"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
        )}
        <span className={`transition-colors relative z-10 shrink-0 ${active ? 'text-[#8178BB]' : 'text-white/60 group-hover:text-white'}`}>
            <Icon size={18} />
        </span>
        <span className="relative z-10">{label}</span>
        {active && (
            <motion.div
                layoutId="sidebarActiveIndicator"
                className="absolute right-4 w-1.5 h-1.5 bg-[#8178BB] rounded-full"
            />
        )}
    </button>
);

const Card = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`} {...props}>
        {children}
    </div>
);

const PrimaryButton = ({ children, onClick, className = "", icon: Icon }: any) => (
    <button
        onClick={onClick}
        className={`bg-[#8178BB] hover:bg-[#8178BB]/90 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 ${className}`}
    >
        {Icon && <Icon size={18} />}
        {children}
    </button>
);

export default function DashboardProfesseur() {
    const [activePage, setActivePage] = useState<Page>('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(MOCK_COURSES[0]);
    const [viewingCourseId, setViewingCourseId] = useState<string | null>(null);

    const filteredCourses = MOCK_COURSES.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.class.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [calendarView, setCalendarView] = useState<'Jour' | 'Semaine' | 'Mois'>('Semaine');
    const [currentDate, setCurrentDate] = useState(new Date());

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            alert(`Fichier "${file.name}" prêt pour l'envoi.`);
        }
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const profileInputRef = React.useRef<HTMLInputElement>(null);

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card>
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                        <Calendar className="text-[#8178BB]" /> Prochaines Sessions
                                    </h3>
                                    <button 
                                        onClick={() => setActivePage('courses')}
                                        className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest hover:underline"
                                    >
                                        Calendrier Complet
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {MOCK_COURSES.map((course) => (
                                        <div 
                                            key={course.id} 
                                            onClick={() => setViewingCourseId(course.id)}
                                            className="flex items-center gap-6 p-5 bg-[#F3F2F9] rounded-2xl border-l-4 border-[#8178BB] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100 group cursor-pointer"
                                        >
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest mb-1">{course.class}</p>
                                                <h4 className="font-black text-gray-800">{course.title}</h4>
                                                <div className="flex items-center gap-4 mt-3">
                                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                                                        <Clock size={12} /> {course.nextSession}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                                                        <GraduationCap size={12} /> Salle A102
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card>
                                <h3 className="text-lg font-black uppercase tracking-tight mb-8">Dépôt d'épreuves (PDF/Word)</h3>
                                <div className="space-y-6">
                                    <div 
                                        onClick={() => setActivePage('exams')}
                                        className="border-2 border-dashed border-gray-100 rounded-2xl p-8 text-center bg-[#F3F2F9]/50 hover:bg-[#F3F2F9] transition-all group cursor-pointer"
                                    >
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-[#8178BB] mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                            <FileUp size={32} />
                                        </div>
                                        <p className="text-sm font-bold text-gray-600">Cliquer ou glisser pour déposer le sujet d'examen</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Max. 10 Mo • PDF, DOCX</p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Derniers dépôts</p>
                                        {[
                                            { file: 'Quiz_Algo_V1.pdf', class: 'L1 Info', date: 'Hier' },
                                            { file: 'TP_Web_React.zip', class: 'L2 Info', date: 'Le 05/03' },
                                        ].map((file, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-50 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <FileText size={16} className="text-red-500" />
                                                    <span className="text-xs font-bold text-gray-700">{file.file}</span>
                                                </div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{file.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                );

            case 'courses':
                if (viewingCourseId) {
                    const course = MOCK_COURSES.find(c => c.id === viewingCourseId);
                    return (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setViewingCourseId(null)} className="p-2 hover:bg-white rounded-xl text-[#8178BB] transition-all">
                                        <ChevronDown size={24} className="rotate-90" />
                                    </button>
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight">{course?.title}</h2>
                                        <p className="text-xs font-bold text-gray-400">{course?.class} • Planning de la semaine</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex gap-4 items-center">
                                    <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                                        {(['Jour', 'Semaine', 'Mois'] as const).map((view) => (
                                            <button 
                                                key={view} 
                                                onClick={() => setCalendarView(view)}
                                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${calendarView === view ? 'bg-[#8178BB] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                {view}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                                        <button className="p-2 hover:bg-[#F3F2F9] rounded-lg text-[#8178BB] transition-all"><ChevronDown className="rotate-90" size={16} /></button>
                                        <button className="p-2 hover:bg-[#F3F2F9] rounded-lg text-[#8178BB] transition-all"><ChevronDown className="-rotate-90" size={16} /></button>
                                    </div>
                                    </div>
                                </div>
                            </div>

                            <Card className="p-0 overflow-hidden min-h-[500px]">
                                {calendarView === 'Mois' ? (
                                    <div className="p-8 text-center">
                                        <div className="grid grid-cols-7 border-b border-gray-100 mb-4">
                                            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(d => <div key={d} className="p-4 text-[10px] font-black uppercase text-gray-400">{d}</div>)}
                                        </div>
                                        <div className="grid grid-cols-7 gap-2">
                                            {[...Array(31)].map((_, i) => (
                                                <div key={i} className={`h-24 p-2 rounded-xl border border-gray-50 flex flex-col items-end ${i + 1 === 12 ? 'bg-[#8178BB]/10 border-[#8178BB]/20' : 'bg-white'}`}>
                                                    <span className={`text-[10px] font-black ${i + 1 === 12 ? 'text-[#8178BB]' : 'text-gray-400'}`}>{i + 1}</span>
                                                    {i + 1 === 12 && <div className="mt-auto w-full p-1 bg-[#8178BB] rounded-lg text-[8px] text-white font-bold truncate">Algo & Complexité</div>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : calendarView === 'Jour' ? (
                                    <div className="p-8">
                                        <div className="max-w-2xl mx-auto space-y-6">
                                            <div className="flex items-center gap-6 p-6 bg-[#F3F2F9] rounded-3xl border-l-8 border-[#8178BB]">
                                                <div className="text-center shrink-0">
                                                    <p className="text-xl font-black text-gray-800">08:00</p>
                                                    <p className="text-[10px] font-black text-gray-400">AM</p>
                                                </div>
                                                <div className="w-px h-12 bg-gray-200" />
                                                <div>
                                                    <p className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest mb-1">L1 SIL - Groupe A</p>
                                                    <h4 className="text-lg font-black text-gray-800">Algorithmique & Complexité</h4>
                                                    <p className="text-xs font-bold text-gray-400 mt-1">Salle A102 • 2 heures</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-gray-100">
                                            <div className="p-4 bg-[#F3F2F9]/50"></div>
                                            {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map(day => (
                                                <div key={day} className="p-4 text-center text-[10px] font-black uppercase tracking-widest text-[#8178BB] border-l border-gray-100 bg-[#F3F2F9]/30">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="h-[500px] relative overflow-y-auto">
                                            <div className="absolute inset-0 grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] grid-rows-[repeat(9,60px)]">
                                                {[...Array(9)].map((_, i) => (
                                                    <React.Fragment key={i}>
                                                        <div className="p-4 text-[10px] font-black text-gray-400 text-center border-b border-gray-50 bg-white">
                                                            {8 + i}:00
                                                        </div>
                                                        {[...Array(5)].map((_, j) => (
                                                            <div key={j} className="border-l border-b border-gray-50"></div>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                            <div className="absolute inset-x-[80px] inset-y-0 pointer-events-none">
                                                {MOCK_SCHEDULER_EVENTS.map(event => {
                                                    const dayIndex = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].indexOf(event.day);
                                                    const startHour = parseInt(event.start.split(':')[0]);
                                                    const top = (startHour - 8) * 60;
                                                    return (
                                                        <div 
                                                            key={event.id}
                                                            className="absolute p-3 rounded-xl bg-[#8178BB]/10 border-l-4 border-[#8178BB] pointer-events-auto cursor-pointer hover:bg-[#8178BB]/20 transition-all"
                                                            style={{ 
                                                                left: `${(dayIndex / 5) * 100}%`, 
                                                                width: `${(1 / 5) * 100}%`, 
                                                                top: `${top}px`, 
                                                                height: '110px' 
                                                            }}
                                                        >
                                                            <p className="text-[9px] font-black text-[#8178BB] uppercase tracking-widest mb-1">{event.room}</p>
                                                            <h5 className="text-[11px] font-black text-gray-800 leading-tight">{event.title}</h5>
                                                            <div className="flex items-center gap-1 mt-2 text-[9px] font-bold text-gray-400">
                                                                <Clock size={10} /> {event.start} - {event.end}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </Card>
                        </div>
                    );
                }
                return (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black uppercase tracking-tight">Mes Cours & Planning</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map((course) => (
                                <Card 
                                    key={course.id} 
                                    className="hover:shadow-xl transition-all cursor-pointer group"
                                    onClick={() => setViewingCourseId(course.id)}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 bg-[#F3F2F9] rounded-2xl flex items-center justify-center text-[#8178BB] group-hover:bg-[#8178BB] group-hover:text-white transition-all">
                                            <BookOpen size={24} />
                                        </div>
                                        <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Actif</span>
                                    </div>
                                    <p className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest mb-1">{course.class}</p>
                                    <h4 className="text-lg font-black text-gray-800 mb-4">{course.title}</h4>
                                    <div className="space-y-3 pt-4 border-t border-gray-50">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-gray-400">Volume Horaire</span>
                                            <span className="text-gray-800">{course.hours}h total</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-gray-400">Prochaine séance</span>
                                            <span className="text-[#8178BB]">{course.nextSession}</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            case 'exams':
                return (
                    <div className="space-y-8 max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tight">Dépôt d'épreuves</h2>
                            <p className="text-gray-400 font-bold text-sm mt-1">Veuillez sélectionner la matière et le type d'évaluation avant l'envoi.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="space-y-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest block">Sélectionner la Matière</label>
                                    <select className="w-full bg-[#F3F2F9] border-none rounded-xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-[#8178BB]/20 transition-all outline-none">
                                        {MOCK_COURSES.map(c => <option key={c.id}>{c.title} ({c.class})</option>)}
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest block">Type d'évaluation</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border-2 border-[#8178BB] text-[#8178BB]">
                                            <div className="w-10 h-10 bg-[#F3F2F9] rounded-xl flex items-center justify-center mb-2">
                                                <Clock size={20} />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-tight">Évaluation Continue</span>
                                        </button>
                                        <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 hover:border-[#8178BB]/20 text-gray-400 transition-all">
                                            <div className="w-10 h-10 bg-[#F3F2F9] rounded-xl flex items-center justify-center mb-2">
                                                <FileText size={20} />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-tight">Devoir / Examen</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <PrimaryButton className="w-full py-4" icon={FileUp}>Confirmer et Envoyer</PrimaryButton>
                                </div>
                            </Card>

                            <Card 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center border-2 border-dashed border-[#8178BB]/20 bg-[#F3F2F9]/30 hover:bg-[#F3F2F9] transition-all cursor-pointer group"
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept=".pdf" 
                                    onChange={handleFileUpload}
                                />
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#8178BB] mb-6 shadow-xl shadow-[#8178BB]/10 group-hover:scale-110 transition-transform">
                                    <FileUp size={40} />
                                </div>
                                <h4 className="text-lg font-black text-gray-800">Déposer le fichier</h4>
                                <p className="text-sm font-bold text-gray-400 text-center mt-2 px-8">Glissez votre sujet ici ou cliquez pour parcourir vos fichiers.</p>
                                <div className="mt-8 px-6 py-2 bg-white rounded-full text-[10px] font-black text-[#8178BB] uppercase tracking-widest border border-gray-100">
                                    Format PDF uniquement
                                </div>
                            </Card>
                        </div>

                        {/* Historique des épreuves */}
                        <div className="mt-12">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Historique des épreuves déposées</h3>
                            <Card className="p-0 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-[#F3F2F9]/50 border-b border-gray-100">
                                        <tr className="text-[10px] font-black uppercase tracking-widest text-[#8178BB]">
                                            <th className="p-4 text-left">Document</th>
                                            <th className="p-4 text-left">Filière</th>
                                            <th className="p-4 text-left">Type</th>
                                            <th className="p-4 text-left">Date</th>
                                            <th className="p-4 text-right">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {[
                                            { name: 'Examen_Final_Algo.pdf', class: 'L1 SIL', type: 'Examen', date: '10/03/2026', status: 'Validé' },
                                            { name: 'Quiz_Web_React.pdf', class: 'L2 SIL', type: 'Quiz', date: '08/03/2026', status: 'En attente' },
                                        ].map((doc, idx) => (
                                            <tr key={idx} className="hover:bg-[#F3F2F9]/30 transition-colors">
                                                <td className="p-4 flex items-center gap-3">
                                                    <FileText size={16} className="text-red-500" />
                                                    <span className="text-xs font-bold text-gray-700">{doc.name}</span>
                                                </td>
                                                <td className="p-4 text-xs font-bold text-gray-400">{doc.class}</td>
                                                <td className="p-4 text-xs font-bold text-gray-400">{doc.type}</td>
                                                <td className="p-4 text-xs font-bold text-gray-400">{doc.date}</td>
                                                <td className="p-4 text-right">
                                                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${doc.status === 'Validé' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                                        {doc.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    </div>
                );

            case 'grades':
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-4 gap-4">
                            {MOCK_COURSES.map(course => (
                                <button
                                    key={course.id}
                                    onClick={() => setSelectedCourse(course)}
                                    className={`p-4 rounded-2xl transition-all text-left border ${selectedCourse.id === course.id ? 'bg-[#8178BB] text-white border-[#8178BB] shadow-xl shadow-[#8178BB]/20' : 'bg-white text-gray-600 border-gray-100 hover:border-[#8178BB]/20'}`}
                                >
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedCourse.id === course.id ? 'text-white/60' : 'text-[#8178BB]'}`}>{course.class}</p>
                                    <h4 className="font-bold text-xs truncate">{course.title}</h4>
                                </button>
                            ))}
                        </div>

                        <Card>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">Saisie des Notes</h3>
                                    <p className="text-xs font-bold text-gray-400 mt-1">{selectedCourse.title} • {selectedCourse.class}</p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <button className="flex items-center gap-2 px-6 py-3 bg-[#F3F2F9] rounded-xl text-[#8178BB] font-black text-[10px] uppercase tracking-widest hover:bg-[#8178BB]/10 transition-all">
                                        <FileSpreadsheet size={16} />
                                        Déposer fichier Excel
                                    </button>
                                    <button className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-100 transition-all">
                                        <Download size={16} />
                                        Exporter Modèle
                                    </button>
                                    <PrimaryButton icon={CheckSquare}>Publier les notes</PrimaryButton>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                                            <th className="p-4 text-left">ID Étudiant</th>
                                            <th className="p-4 text-left">Nom & Prénoms</th>
                                            <th className="p-4 text-center">Note / 20</th>
                                            <th className="p-4 text-center">Observation</th>
                                            <th className="p-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {MOCK_STUDENTS.map(s => (
                                            <tr key={s.id} className="hover:bg-[#F3F2F9]/50 transition-colors">
                                                <td className="p-4 text-xs font-bold text-gray-400">{s.id}</td>
                                                <td className="p-4 font-bold text-sm text-gray-800">{s.nome}</td>
                                                <td className="p-4 text-center">
                                                    <input
                                                        type="number"
                                                        defaultValue={s.note || ''}
                                                        placeholder="--"
                                                        className="w-16 h-10 bg-[#F3F2F9] border-none rounded-xl text-center font-black text-[#8178BB] focus:ring-2 focus:ring-[#8178BB]/20"
                                                    />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${s.note && s.note >= 10 ? 'text-green-500' : 'text-orange-500'}`}>
                                                        {s.note ? (s.note >= 10 ? 'Admis' : 'Ajourné') : '--'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button className="p-2 text-gray-300 hover:text-[#8178BB]"><MoreVertical size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tight">Centre de Notifications</h2>
                            <p className="text-gray-400 font-bold text-sm mt-1">Restez informé des activités académiques et administratives.</p>
                        </div>

                        {[
                            { id: 1, title: 'Nouveau cours assigné', desc: 'Le cours "Intelligence Artificielle" (L3 Info) vous a été attribué pour le semestre 2.', time: 'Il y a 2h', type: 'info' },
                            { id: 2, title: 'Rappel : Dépôt d\'épreuves', desc: 'La date limite pour le dépôt des sujets d\'examen du premier semestre est fixée au 25 Mars.', time: 'Hier, 16:45', type: 'warning' },
                            { id: 3, title: 'Délais de saisie de notes', desc: 'Merci de finaliser la saisie des notes pour le cours "Algorithmique" avant vendredi soir.', time: 'Le 10/03', type: 'important' },
                        ].map(notif => (
                            <div key={notif.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex gap-6 hover:shadow-lg transition-all border-l-4 border-l-[#8178BB]">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${notif.type === 'warning' ? 'bg-orange-50 text-orange-500' : 'bg-[#F3F2F9] text-[#8178BB]'}`}>
                                    <Bell size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-black text-gray-800">{notif.title}</h4>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{notif.time}</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-500 leading-relaxed">{notif.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'settings':
                return (
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="flex items-center gap-10">
                            <div className="w-32 h-32 bg-[#8178BB] rounded-[40px] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-[#8178BB]/40">
                                KK
                            </div>
                             <div>
                                <h1 className="text-3xl font-black text-gray-800">Dr. Koffi Konan</h1>
                                <p className="text-[#8178BB] font-black uppercase tracking-[0.2em] text-xs mt-2">Enseignant Chercheur • Département Informatique</p>
                                <div className="flex gap-3 mt-6">
                                    <input 
                                        type="file" 
                                        ref={profileInputRef} 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={(e) => e.target.files?.[0] && alert('Photo de profil mise à jour')}
                                    />
                                    <PrimaryButton onClick={() => profileInputRef.current?.click()}>Modifier la photo</PrimaryButton>
                                    <button className="px-6 py-3 bg-white rounded-xl font-bold text-sm text-gray-500 border border-gray-100 hover:border-[#8178BB]/20 transition-all">Supprimer</button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Informations Personnelles</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest block mb-1">Email Académique</label>
                                        <input type="email" defaultValue="k.konan@faucon.edu" className="w-full bg-[#F3F2F9] border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-[#8178BB]/20 transition-all outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest block mb-1">Téléphone</label>
                                        <input type="tel" defaultValue="+225 07 00 00 00 00" className="w-full bg-[#F3F2F9] border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-[#8178BB]/20 transition-all outline-none" />
                                    </div>
                                </div>
                            </Card>

                             <Card className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Sécurité</h3>
                                <div className="space-y-4">
                                    <button 
                                        onClick={() => alert('Ouverture du formulaire de changement de mot de passe')}
                                        className="w-full flex items-center justify-between p-4 bg-[#F3F2F9] rounded-xl hover:bg-[#8178BB]/10 transition-all group"
                                    >
                                        <span className="text-sm font-bold text-gray-700">Changer le mot de passe</span>
                                        <ChevronDown size={16} className="-rotate-90 text-gray-400 group-hover:text-[#8178BB]" />
                                    </button>
                                    <div className="w-full flex items-center justify-between p-4 bg-[#F3F2F9] rounded-xl">
                                        <span className="text-sm font-bold text-gray-700">Double Authentification</span>
                                        <button 
                                            onClick={(e) => {
                                                const btn = e.currentTarget;
                                                btn.classList.toggle('bg-emerald-500');
                                                btn.classList.toggle('bg-gray-200');
                                                btn.firstElementChild?.classList.toggle('translate-x-4');
                                            }}
                                            className="w-10 h-6 bg-gray-200 rounded-full relative transition-colors duration-200 ease-in-out"
                                        >
                                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F2F9] flex font-sans tracking-tight text-[#2D2D2D] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[240px] bg-gradient-to-b from-[#8178BB] to-[#7168A0] flex flex-col py-8 px-5 relative z-[101] shadow-[25px_0_80px_rgba(129,120,187,0.2)]">
                {/* Logo Section */}
                <div className="mb-10 px-4">
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-2xl font-black tracking-tighter leading-tight">
                            <span className="text-white">Fau</span><span className="text-[#1E293B]">con</span>
                        </span>
                    </div>
                    <div className="h-px w-full bg-white/10 mt-4" />
                </div>

                <nav className="flex-1 space-y-1.5">
                    <SidebarItem icon={Home} label="Tableau de bord" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
                    <SidebarItem icon={Calendar} label="Mes Cours" active={activePage === 'courses'} onClick={() => setActivePage('courses')} />
                    <SidebarItem icon={ClipboardList} label="Saisie de Notes" active={activePage === 'grades'} onClick={() => setActivePage('grades')} />
                    <SidebarItem icon={FileText} label="Mes Épreuves" active={activePage === 'exams'} onClick={() => setActivePage('exams')} />
                </nav>

                <div className="mt-auto space-y-2 pt-6 border-t border-white/10">
                    <SidebarItem icon={Bell} label="Notifications" active={activePage === 'notifications'} onClick={() => setActivePage('notifications')} />
                    <SidebarItem icon={Settings} label="Paramètres" active={activePage === 'settings'} onClick={() => setActivePage('settings')} />
                    <button 
                        onClick={() => { window.location.href = 'login-staff.html'; }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[18px] text-white/50 hover:text-white hover:bg-red-500/20 transition-all text-[11px] font-bold group"
                    >
                        <div className="bg-white/10 group-hover:bg-red-500/30 p-2 rounded-lg transition-colors">
                            <LogOut size={16} />
                        </div>
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-24 bg-white border-b border-gray-100 flex items-center justify-between px-12 shrink-0">
                    <div className="flex items-center gap-8 flex-1 max-w-2xl">
                        <div className="relative group flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Chercher cours, document..."
                                className="w-full bg-[#F3F2F9] border-none rounded-xl py-3 px-6 pl-12 text-sm font-bold focus:ring-2 focus:ring-[#8178BB]/20 transition-all outline-none placeholder:text-gray-400"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8178BB] transition-colors" size={18} />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 ml-8">
                        <button 
                            onClick={() => setActivePage('notifications')}
                            className="p-3 bg-[#F3F2F9] rounded-xl text-gray-400 hover:text-[#8178BB] transition-all relative"
                        >
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
                            <div className="text-right">
                                <p className="text-sm font-black text-gray-800">Dr. Koffi Konan</p>
                                <p className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest">Enseignant Chercheur</p>
                            </div>
                            <div className="w-10 h-10 bg-[#8178BB] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#8178BB]/20 text-xs font-black">
                                KK
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePage}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderPage()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
