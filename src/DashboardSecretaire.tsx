import React, { useState, useMemo } from 'react';
import {
    Home,
    Files,
    CreditCard,
    GraduationCap,
    MessageSquare,
    Calendar,
    Search,
    Bell,
    User,
    ChevronDown,
    AlertCircle,
    Clock,
    Plus,
    FileText,
    Send,
    Filter,
    Eye,
    Download,
    Printer,
    Mail,
    Smartphone,
    CheckCircle,
    XCircle,
    X,
    MoreVertical,
    ChevronRight,
    LogOut,
    Briefcase,
    Settings,
    RefreshCw,
    Check
} from 'lucide-react';
import { useEffect } from 'react';
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
type Page = 'home' | 'dossiers' | 'payments' | 'exams' | 'communication' | 'planning' | 'classes' | 'notifications';
type CommunicationTemplate = 'none' | 'pieces_manquantes' | 'convocation' | 'retard_paiement';

interface Document {
    id: string;
    name: string;
    status: 'ok' | 'missing' | 'error';
    url: string;
}

interface Student {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    filiere: string;
    classe: string;
    statut: 'En attente' | 'Validé' | 'Rejeté';
    documents: Document[];
    submissionDate?: string;
    dateNaissance?: string;
    lieuNaissance?: string;
    paysNaissance?: string;
    nationalite?: string;
    sexe?: string;
    adresse?: string;
    matricule: string;
    parentPere?: { nom: string, prenom: string, email: string, tel: string, job: string };
    parentMere?: { nom: string, prenom: string, email: string, tel: string, job: string };
    adminNotes?: string;
    status_step?: number;
}

interface Transaction {
    id: string;
    studentName: string;
    totalDue: number;
    paid: number;
    remaining: number;
    date: string;
    studentId?: string;
}

// --- Mock Data ---
const MOCK_STUDENTS: Student[] = [];

const MOCK_TRANSACTIONS: Transaction[] = [];

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

const PrimaryButton = ({ children, onClick, className = "", icon: Icon, disabled }: { children: React.ReactNode, onClick?: () => void, className?: string, icon?: any, disabled?: boolean }) => (
    <button
        onClick={!disabled ? onClick : undefined}
        disabled={disabled}
        className={`bg-[#8178BB] hover:bg-[#8178BB]/90 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''} ${className}`}
    >
        {Icon && <Icon size={18} />}
        {children}
    </button>
);

export default function DashboardSecretaire() {
    const [activePage, setActivePage] = useState<Page>('home');
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [filterStatus, setFilterStatus] = useState<'All' | 'En attente' | 'Validé' | 'Rejeté'>('En attente');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
    const [autoSendEmail, setAutoSendEmail] = useState(true);
    const [selectedYear, setSelectedYear] = useState('2023 - 2024');
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate>('none');
    const [commMessage, setCommMessage] = useState('');
    const [showFullDetails, setShowFullDetails] = useState(false);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [viewingDoc, setViewingDoc] = useState<{ url: string, name: string } | null>(null);

    useEffect(() => {
        const student = students.find(s => s.id === currentStudentId);
        if (student) {
            setCommMessage(student.adminNotes || '');
            // Scroll to details panel
            setTimeout(() => {
                const element = document.getElementById('student-details-panel');
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } else {
            setCommMessage('');
        }
    }, [currentStudentId, students]);

    const ACADEMIC_YEARS = ['2020 - 2021', '2021 - 2022', '2022 - 2023', '2023 - 2024', '2024 - 2025'];

    const [notifications, setNotifications] = useState<any[]>([]);

    const fetchStudents = () => {
        fetch('/api/admin/students')
            .then(res => res.json())
            .then(data => {
                const mapped: Student[] = data.map((u: any) => ({
                    id: u.id.toString(),
                    nom: u.lastname || '',
                    prenom: u.firstname || '',
                    email: u.email || '',
                    telephone: u.phone || '',
                    filiere: u.filiere || 'Générale',
                    classe: u.level || 'L1',
                    statut: u.status_step >= 2 ? 'Validé' : (u.is_rejected ? 'Rejeté' : 'En attente'),
                    status_step: u.status_step || 1,
                    matricule: u.matricule || `ST-${u.id}`,
                    submissionDate: u.created_at?.split(' ')[0],
                    dateNaissance: u.birth_date,
                    lieuNaissance: u.birth_city,
                    paysNaissance: u.birth_country,
                    nationalite: u.nationality,
                    sexe: u.gender,
                    adresse: u.address,
                    adminNotes: u.admin_notes || '',
                    parentPere: {
                        nom: u.parent_father_name || '',
                        prenom: u.parent_father_firstname || '',
                        email: u.parent_father_email || '',
                        tel: u.parent_father_phone || '',
                        job: u.parent_father_job || ''
                    },
                    parentMere: {
                        nom: u.parent_mother_name || '',
                        prenom: u.parent_mother_firstname || '',
                        email: u.parent_mother_email || '',
                        tel: u.parent_mother_phone || '',
                        job: u.parent_mother_job || ''
                    },
                    documents: [
                        { id: '1', name: 'Acte de Naissance', status: u.doc_acte_naissance ? 'ok' : 'missing', url: u.doc_acte_naissance || '#' },
                        { id: '2', name: 'Photo d\'identité', status: u.doc_photo ? 'ok' : 'missing', url: u.doc_photo || '#' },
                        { id: '3', name: 'Attestation Bac', status: u.doc_attestation_bac ? 'ok' : 'missing', url: u.doc_attestation_bac || '#' },
                        { id: '4', name: 'Relevé de Notes', status: u.doc_bulletins ? 'ok' : 'missing', url: u.doc_bulletins || '#' },
                    ]
                }));
                setStudents(mapped);
                
                // Generate notifications for students with status 'En attente'
                const newNotifications = mapped
                    .filter(s => s.statut === 'En attente')
                    .map(s => ({
                        id: `notif-user-${s.id}`,
                        message: `Nouveau dossier de ${s.nom} ${s.prenom} à valider`,
                        type: 'info',
                        read: false,
                        timestamp: s.submissionDate ? new Date(s.submissionDate) : new Date(),
                        targetStudentId: s.id
                    }));
                
                setNotifications(prev => {
                    // Filter out notifications for students that are now Validated/Rejected
                    const filteredPrev = prev.filter(n => {
                        const s = mapped.find(st => st.id === n.targetStudentId);
                        return s && s.statut === 'En attente';
                    });
                    
                    const existingIds = filteredPrev.map(n => n.id);
                    const fresh = newNotifications.filter(n => !existingIds.includes(n.id));
                    return [...filteredPrev, ...fresh];
                });
            })
            .catch(err => console.error('Error fetching students:', err));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        fetchStudents();
    }, []);

    const markNotificationAsRead = (id: string | number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const getNotificationIcon = (type: string) => {
        switch(type) {
            case 'warning': return <AlertCircle size={18} />;
            default: return <Bell size={18} />;
        }
    };

    const handleValidate = (id: string) => {
        fetch('/api/admin/validate-dossier', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId: id })
        })
        .then(res => res.json())
        .then(() => {
            setStudents(prev => prev.map(s => s.id === id ? { ...s, statut: 'Validé' } : s));
            setNotifications(prev => prev.filter(n => n.targetStudentId !== id));
            setCurrentStudentId(null);
            alert(`Le dossier a été validé avec succès.`);
        })
        .catch(err => alert("Erreur lors de la validation"));
    };

    const handleReject = (id: string) => {
        const student = students.find(s => s.id === id);
        if (!student) return;

        fetch('/api/admin/reject-dossier', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId: id, notes: commMessage })
        })
        .then(res => res.json())
        .then(() => {
            alert(`Le dossier de ${student.nom} a été rejeté.`);
            setStudents(prev => prev.map(s => s.id === id ? { ...s, statut: 'Rejeté', adminNotes: commMessage } : s));
            setNotifications(prev => prev.filter(n => n.targetStudentId !== id));
            setCurrentStudentId(null);
        })
        .catch(() => alert("Erreur lors du rejet"));
    };

    const handleNotifyError = (id: string) => {
        const student = students.find(s => s.id === id);
        if (!student) return;

        fetch('/api/admin/save-notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId: id, notes: commMessage })
        })
        .then(res => res.json())
        .then(() => {
            alert(`Notification envoyée à l'étudiant ${student.nom}`);
            setStudents(prev => prev.map(s => s.id === id ? { ...s, adminNotes: commMessage } : s));
        })
        .catch(() => alert("Erreur lors de l'envoi de la notification"));
    };

    // --- Search Logic ---
    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        if (val.length > 2 && activePage !== 'dossiers' && activePage !== 'payments') {
            setActivePage('dossiers');
        }
    };

    // --- Filtered Data ---
    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchesSearch = s.nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 s.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 s.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'All' || s.statut === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [students, searchQuery, filterStatus]);

    const filteredTransactions = useMemo(() => {
        return students
            .filter(s => s.status_step !== undefined && s.status_step >= 4)
            .map(s => ({
                id: `RECU-25-${s.id}`,
                studentName: `${s.nom} ${s.prenom}`,
                studentId: s.id,
                totalDue: 650000,
                paid: s.status_step !== undefined && s.status_step >= 5 ? 50000 : 0,
                remaining: s.status_step !== undefined && s.status_step >= 5 ? 600000 : 650000,
                date: s.submissionDate || new Date().toISOString().split('T')[0]
            }))
            .filter(t => 
                t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                t.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [students, searchQuery]);

    // --- Handlers ---
    const toggleStudent = (id: string) => {
        setSelectedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    // --- Render Pages ---
    const renderPage = () => {
        switch (activePage) {
            case 'home':
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card>
                                <h3 className="text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                                    <AlertCircle className="text-orange-500" /> Tâches Urgentes
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { text: "15 dossiers à valider", time: "Reçu ce matin", target: 'dossiers', filter: 'En attente' },
                                        { text: "3 conventions de stage en attente", time: "Urgent", target: 'exams' },
                                        { text: "Relancer les retards de paiement", time: "Aujourd'hui", target: 'payments' }
                                    ].map((task, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => {
                                                setActivePage(task.target as Page);
                                                if (task.filter) setFilterStatus(task.filter as any);
                                            }}
                                            className="flex items-center justify-between p-4 bg-[#F3F2F9] rounded-xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-[#8178BB]/20 cursor-pointer"
                                        >
                                            <div>
                                                <p className="font-bold text-sm text-gray-800">{task.text}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{task.time}</p>
                                            </div>
                                            <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8178BB] group-hover:translate-x-1 transition-all" />
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card>
                                <h3 className="text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                                    <Clock className="text-[#8178BB]" /> Flux d'activités
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { type: 'Payment', user: 'Jean Kouassi', desc: 'Paiement de 50 000 FCFA', time: '10 min' },
                                        { type: 'Upload', user: 'Mariam Diallo', desc: 'A téléchargé son Attestation Bac', time: '45 min' },
                                        { type: 'New', user: 'Moussa Traoré', desc: 'Nouveau dossier soumis', time: '2h' }
                                    ].map((act, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-[#F3F2F9] rounded-xl flex items-center justify-center text-[#8178BB] shrink-0">
                                                {act.type === 'Payment' ? <CreditCard size={18} /> : act.type === 'Upload' ? <Files size={18} /> : <User size={18} />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-800">{act.user} <span className="font-medium text-gray-500">• {act.desc}</span></p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Il y a {act.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Nouvelle Inscription', icon: Plus, target: 'dossiers' },
                                { label: 'Émettre un Reçu', icon: FileText, target: 'payments' },
                                { label: 'Envoyer une Notification', icon: Send, target: 'communication' }
                            ].map((btn, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setActivePage(btn.target as Page)}
                                    className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#8178BB]/30 transition-all group text-center flex flex-col items-center gap-4 active:scale-95"
                                >
                                    <div className="w-16 h-16 bg-[#F3F2F9] text-[#8178BB] rounded-2xl flex items-center justify-center group-hover:bg-[#8178BB] group-hover:text-white transition-all">
                                        <btn.icon size={32} />
                                    </div>
                                    <span className="font-black text-sm uppercase tracking-widest text-gray-700">{btn.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'dossiers':
                const selectedStudent = students.find(s => s.id === currentStudentId);
                return (
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-12 lg:col-span-12 space-y-6">
                            <Card>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Gestion des Dossiers</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-xs font-bold text-gray-400">{filteredStudents.length} dossiers trouvés</p>
                                            <button onClick={fetchStudents} className="p-1 hover:bg-gray-100 rounded-lg text-[#8178BB]" title="Actualiser">
                                                <RefreshCw size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedStudents.length > 0 && (
                                            <button
                                                onClick={() => setShowBulkActions(true)}
                                                className="px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all bg-orange-500 text-white border-2 border-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20"
                                            >
                                                Relance Groupée ({selectedStudents.length})
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 mb-8 pb-2 border-b border-gray-50 overflow-x-auto">
                                    {(['All', 'En attente', 'Validé', 'Rejeté'] as const).map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                filterStatus === status 
                                                ? 'bg-[#8178BB] text-white shadow-lg shadow-[#8178BB]/20' 
                                                : 'bg-[#F3F2F9] text-gray-400 hover:bg-gray-200'
                                            }`}
                                        >
                                            {status === 'All' ? 'Tous' : status}
                                        </button>
                                    ))}
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                                                <th className="p-4 text-left w-10">
                                                    <input 
                                                        type="checkbox" 
                                                        onChange={(e) => {
                                                            if (e.target.checked) setSelectedStudents(filteredStudents.map(s => s.id));
                                                            else setSelectedStudents([]);
                                                        }}
                                                        className="rounded border-gray-300 text-[#8178BB]" 
                                                    />
                                                </th>
                                                <th className="p-4 text-left">Étudiant</th>
                                                <th className="p-4 text-left">Classe</th>
                                                <th className="p-4 text-left">Filière</th>
                                                <th className="p-4 text-center">Status</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredStudents.map(s => (
                                                <tr key={s.id} className={`group hover:bg-[#F3F2F9]/50 transition-colors cursor-pointer ${currentStudentId === s.id ? 'bg-[#F3F2F9]' : ''}`} onClick={() => setCurrentStudentId(s.id)}>
                                                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={selectedStudents.includes(s.id)} 
                                                            onChange={() => toggleStudent(s.id)} 
                                                            className="rounded border-gray-300 text-[#8178BB]" 
                                                        />
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[#8178BB] font-black text-xs uppercase">
                                                                {s.nom?.[0] || '?'}{s.prenom?.[0] || '?'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm text-gray-800">{s.nom || 'Sans nom'} {s.prenom || ''}</p>
                                                                <p className="text-[10px] text-gray-400 font-bold">{s.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-xs font-bold text-gray-600">{s.classe}</td>
                                                    <td className="p-4 text-xs font-bold text-gray-600">{s.filiere}</td>
                                                    <td className="p-4 text-center">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${s.statut === 'Validé' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                                            {s.statut === 'Validé' ? 'Validé' : 'En attente'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {s.statut !== 'Validé' && (
                                                                <button 
                                                                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                                                    onClick={(e) => { e.stopPropagation(); handleValidate(s.id); }}
                                                                    title="Valider immédiatement"
                                                                >
                                                                    <Check size={16} />
                                                                </button>
                                                            )}
                                                            <button 
                                                                className="p-2 text-gray-400 hover:text-[#8178BB] transition-colors"
                                                                onClick={(e) => { e.stopPropagation(); setCurrentStudentId(s.id); }}
                                                                title="Voir les détails"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>

                        <AnimatePresence>
                            {showBulkActions && (
                                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
                                    >
                                        <h3 className="text-xl font-black uppercase tracking-tight mb-4">Relance Groupée</h3>
                                        <p className="text-sm font-medium text-gray-500 mb-8">
                                            Vous avez sélectionné {selectedStudents.length} étudiants. Quelle action souhaitez-vous effectuer ?
                                        </p>
                                        <div className="space-y-3">
                                            <button 
                                                onClick={() => {
                                                    setStudents(prev => prev.map(s => selectedStudents.includes(s.id) ? { ...s, statut: 'Validé' } : s));
                                                    setShowBulkActions(false);
                                                    setSelectedStudents([]);
                                                    alert('Dossiers validés avec succès');
                                                }}
                                                className="w-full py-4 rounded-xl bg-green-500 text-white font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                                            >
                                                Valider les dossiers
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setActivePage('communication');
                                                    setSelectedTemplate('pieces_manquantes');
                                                    setShowBulkActions(false);
                                                }}
                                                className="w-full py-4 rounded-xl bg-[#8178BB] text-white font-black text-xs uppercase tracking-widest hover:bg-[#8178BB]/90 transition-all shadow-lg shadow-[#8178BB]/20"
                                            >
                                                Envoyer une notification groupée
                                            </button>
                                            <button 
                                                onClick={() => setShowBulkActions(false)}
                                                className="w-full py-4 rounded-xl bg-gray-100 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>

                        {selectedStudent && (
                            <motion.div 
                                id="student-details-panel"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="col-span-12 space-y-6 scroll-mt-8"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <Card className="lg:col-span-1">
                                        <div className="flex flex-col items-center text-center mb-8">
                                            <div className="w-24 h-24 bg-[#F3F2F9] rounded-3xl flex items-center justify-center text-[#8178BB] mb-4 shadow-inner">
                                                <User size={48} />
                                            </div>
                                            <h4 className="text-xl font-black text-gray-800 uppercase tracking-tight">{selectedStudent.nom} {selectedStudent.prenom}</h4>
                                            <p className="text-xs font-bold text-[#8178BB] uppercase tracking-widest mt-1">{selectedStudent.classe} • {selectedStudent.filiere}</p>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-gray-50">
                                            <button 
                                                onClick={() => setShowFullDetails(true)}
                                                className="w-full p-4 bg-[#F3F2F9] rounded-xl flex items-center justify-between group hover:bg-[#8178BB] transition-all"
                                            >
                                                <div className="text-left">
                                                    <p className="text-xs font-black uppercase tracking-widest text-[#8178BB] group-hover:text-white/70">Résumé des informations</p>
                                                    <p className="text-sm font-bold text-gray-800 group-hover:text-white mt-1">Cliquer pour tout voir</p>
                                                </div>
                                                <ChevronRight size={18} className="text-gray-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                            </button>

                                            <div className="flex items-center gap-3 text-sm px-1">
                                                <Mail size={16} className="text-gray-400" />
                                                <span className="font-bold text-gray-600">{selectedStudent.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm px-1">
                                                <Smartphone size={16} className="text-gray-400" />
                                                <span className="font-bold text-gray-600">{selectedStudent.telephone}</span>
                                            </div>
                                            <div className="pt-4 mt-4 border-t border-gray-50 space-y-3">
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                    <span className="text-gray-400">Sexe</span>
                                                    <span className="text-gray-800">{selectedStudent.sexe || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                    <span className="text-gray-400">Nationalité</span>
                                                    <span className="text-gray-800">{selectedStudent.nationalite || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                    <span className="text-gray-400">Pays Naissance</span>
                                                    <span className="text-gray-800 text-right">{selectedStudent.paysNaissance || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 space-y-3">
                                            <PrimaryButton 
                                                className="w-full bg-green-500 hover:bg-green-600" 
                                                icon={CheckCircle}
                                                onClick={() => handleValidate(selectedStudent.id)}
                                            >
                                                Valider Dossier
                                            </PrimaryButton>
                                            <button 
                                                className="w-full py-3 rounded-xl border-2 border-orange-500 text-orange-500 font-bold text-sm hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                                                onClick={() => handleReject(selectedStudent.id)}
                                            >
                                                <XCircle size={18} />
                                                Rejeter le dossier
                                            </button>
                                        </div>
                                    </Card>

                                    <Card className="lg:col-span-2">
                                        <div className="flex justify-between items-center mb-8">
                                            <h4 className="text-sm font-black uppercase tracking-widest text-[#8178BB]">Documents Fournis</h4>
                                            <button className="text-xs font-bold text-gray-400 hover:text-[#8178BB] flex items-center gap-2">
                                                <Download size={14} /> Tout télécharger
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedStudent.documents.map((doc) => (
                                                <div key={doc.id} className="p-4 bg-[#F3F2F9] rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-[#8178BB]/20">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-gray-400 group-hover:text-[#8178BB] transition-colors">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-800">{doc.name}</p>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Document joint</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {doc.status === 'ok' ? (
                                                            <button 
                                                                onClick={(e) => { e.preventDefault(); setViewingDoc({ url: doc.url, name: doc.name }); }}
                                                                className="p-2.5 bg-white text-[#8178BB] hover:shadow-sm rounded-xl transition-all flex items-center gap-2 border border-[#8178BB]/10"
                                                            >
                                                                <Eye size={16} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Voir</span>
                                                            </button>
                                                        ) : (
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 px-3">Absent</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-8 p-6 bg-orange-50 rounded-2xl border border-orange-100">
                                            <h5 className="text-xs font-black uppercase tracking-widest text-orange-600 mb-2 flex items-center gap-2">
                                                <AlertCircle size={14} /> Note de révision interne
                                            </h5>
                                            <textarea 
                                                value={commMessage}
                                                onChange={(e) => setCommMessage(e.target.value)}
                                                placeholder="Ajouter une note pour le suivi..."
                                                className="w-full bg-white/50 border-none rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-orange-200 transition-all outline-none resize-none"
                                                rows={3}
                                            />
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <button 
                                                onClick={() => handleNotifyError(selectedStudent.id)}
                                                className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
                                            >
                                                <Send size={14} /> Envoyer une notification
                                            </button>
                                        </div>
                                    </Card>
                                </div>
                                
                                <AnimatePresence>
                                    {showFullDetails && (
                                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                                            <motion.div 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                                className="bg-white rounded-3xl p-10 max-w-2xl w-full shadow-2xl relative overflow-hidden"
                                            >
                                                <button onClick={() => setShowFullDetails(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-xl transition-all">
                                                    <XCircle size={24} className="text-gray-400" />
                                                </button>

                                                <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Détails Étudiant</h3>
                                                
                                                <div className="grid grid-cols-2 gap-8">
                                                    <div className="space-y-6">
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Nom complet</p>
                                                            <p className="text-base font-bold text-gray-800">{selectedStudent.nom} {selectedStudent.prenom}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Sexe</p>
                                                            <p className="text-base font-bold text-gray-800">{selectedStudent.sexe || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email</p>
                                                            <p className="text-base font-bold text-gray-800">{selectedStudent.email}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Téléphone</p>
                                                            <p className="text-base font-bold text-gray-800">{selectedStudent.telephone}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Adresse</p>
                                                            <p className="text-base font-bold text-gray-800">{selectedStudent.adresse}</p>
                                                        </div>
                                                        <div className="pt-4 border-t border-gray-100">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#8178BB] mb-2">Père</p>
                                                            <p className="text-sm font-bold">{selectedStudent.parentPere?.nom} {selectedStudent.parentPere?.prenom}</p>
                                                            <p className="text-xs text-gray-500">{selectedStudent.parentPere?.tel} • {selectedStudent.parentPere?.job}</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-6">
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Filière / Classe</p>
                                                            <p className="text-base font-bold text-gray-800">{selectedStudent.filiere} ({selectedStudent.classe})</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Nationalité</p>
                                                            <p className="text-base font-bold text-gray-800">{selectedStudent.nationalite || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Lieu & Pays de Naissance</p>
                                                            <p className="text-base font-bold text-gray-800">{selectedStudent.lieuNaissance}, {selectedStudent.paysNaissance}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Dernière Note Administrative</p>
                                                            <p className="text-sm italic text-orange-600">{selectedStudent.adminNotes || 'Aucune note'}</p>
                                                        </div>
                                                        <div className="pt-4 border-t border-gray-100">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#8178BB] mb-2">Mère</p>
                                                            <p className="text-sm font-bold">{selectedStudent.parentMere?.nom} {selectedStudent.parentMere?.prenom}</p>
                                                            <p className="text-xs text-gray-500">{selectedStudent.parentMere?.tel} • {selectedStudent.parentMere?.job}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end">
                                                    <button 
                                                        onClick={() => setShowFullDetails(false)}
                                                        className="px-8 py-3 bg-[#8178BB] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#8178BB]/90 transition-all"
                                                    >
                                                        Fermer
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                );

            case 'payments':
                return (
                    <Card>
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-black uppercase tracking-tight">Paiements & Reçus</h3>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-gray-500">Envoi auto email</span>
                                <button
                                    onClick={() => setAutoSendEmail(!autoSendEmail)}
                                    className={`w-12 h-6 rounded-full transition-all relative ${autoSendEmail ? 'bg-[#8178BB]' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${autoSendEmail ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                                        <th className="p-4 text-left">Étudiant</th>
                                        <th className="p-4 text-left">Balance (Dû / Payé / Reste)</th>
                                        <th className="p-4 text-left">Date</th>
                                        <th className="p-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredTransactions.map(tr => (
                                        <tr key={tr.id} className="hover:bg-[#F3F2F9]/50 transition-colors">
                                            <td className="p-4 font-bold text-sm text-gray-800">{tr.studentName}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-xs font-bold">
                                                    <span className="text-gray-400">{tr.totalDue.toLocaleString()}</span>
                                                    <span className="text-gray-300">/</span>
                                                    <span className="text-green-600">{tr.paid.toLocaleString()}</span>
                                                    <span className="text-gray-300">/</span>
                                                    <span className="text-orange-500">{tr.remaining.toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs font-bold text-gray-400">{tr.date}</td>
                                            <td className="p-4 text-center">
                                                <PrimaryButton 
                                                    className="mx-auto !py-2 !px-4 text-[10px] uppercase tracking-widest" 
                                                    icon={Printer}
                                                    onClick={() => setSelectedTransaction(tr)}
                                                >
                                                    Générer Reçu PDF
                                                </PrimaryButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <AnimatePresence>
                            {selectedTransaction && (
                                <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-black/60 backdrop-blur-md overflow-y-auto">
                                    <motion.div 
                                        initial={{ opacity: 0, y: 100 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 100 }}
                                        className="bg-white rounded-none w-full max-w-4xl shadow-2xl p-16 relative font-serif text-gray-800"
                                    >
                                        <button 
                                            onClick={() => setSelectedTransaction(null)}
                                            className="absolute top-8 right-8 p-3 bg-white/80 hover:bg-red-500 hover:text-white rounded-full transition-all shadow-lg z-10 border border-gray-100"
                                            title="Fermer le reçu"
                                        >
                                            <X size={24} />
                                        </button>

                                        {/* Header */}
                                        <div className="flex justify-between items-start border-b-4 border-[#8178BB] pb-10 mb-10">
                                            <div className="space-y-1">
                                                <h2 className="text-3xl font-black text-[#8178BB] uppercase italic tracking-tighter">École Supérieure le Faucon</h2>
                                                <p className="text-sm font-bold">Adresse : Angle Rue des Arts, Abidjan Cocody</p>
                                                <p className="text-sm font-bold">Téléphone : +225 27 22 44 55 66</p>
                                                <p className="text-sm font-bold">Email : finance@esf-benin.bj</p>
                                            </div>
                                            <div className="text-right">
                                                <h1 className="text-4xl font-black uppercase text-gray-200 opacity-50 mb-4 tracking-widest">REÇU</h1>
                                                <p className="text-lg font-bold">Reçu N° : <span className="text-[#8178BB]">{selectedTransaction.id}</span></p>
                                                <p className="text-sm font-bold text-gray-400">Date : {new Date().toLocaleDateString('fr-FR')}</p>
                                            </div>
                                        </div>

                                        {/* Student Info */}
                                        <div className="grid grid-cols-2 gap-12 mb-12 bg-[#F3F2F9]/30 p-8 rounded-3xl border border-gray-100">
                                            <div className="space-y-4">
                                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Informations de l'étudiant</h3>
                                                <div className="space-y-2">
                                                    <p className="text-sm">Nom et prénom : <span className="font-black border-b border-gray-300 pb-0.5">{selectedTransaction.studentName}</span></p>
                                                    <p className="text-sm">Matricule : <span className="font-black border-b border-gray-300 pb-0.5">{students.find(s => s.nom + " " + s.prenom === selectedTransaction.studentName)?.matricule || '25-GEN-000'}</span></p>
                                                    <p className="text-sm">Classe / Filière : <span className="font-black border-b border-gray-300 pb-0.5">{students.find(s => s.nom + " " + s.prenom === selectedTransaction.studentName)?.classe || 'L1'} / {students.find(s => s.nom + " " + s.prenom === selectedTransaction.studentName)?.filiere || 'Générale'}</span></p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Détails de l'année</h3>
                                                <p className="text-sm italic">Paiement partiel des frais de scolarité pour l'année académique <span className="font-black">2025 / 2026</span></p>
                                            </div>
                                        </div>

                                        {/* Financial Details */}
                                        <div className="mb-12">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-[#8178BB] text-white">
                                                        <th className="p-4 text-left uppercase text-xs tracking-widest">Désignation</th>
                                                        <th className="p-4 text-right uppercase text-xs tracking-widest">Montant</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    <tr>
                                                        <td className="p-4 font-bold text-sm">Montant total de la scolarité</td>
                                                        <td className="p-4 text-right font-black text-lg">{selectedTransaction.totalDue.toLocaleString()} FCFA</td>
                                                    </tr>
                                                    <tr className="bg-[#F3F2F9]/50">
                                                        <td className="p-4 font-bold text-sm">Montant versé ce jour</td>
                                                        <td className="p-4 text-right font-black text-2xl text-green-600">{selectedTransaction.paid.toLocaleString()} FCFA</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-4 font-bold text-sm">Mode de paiement</td>
                                                        <td className="p-4 text-right font-black text-sm uppercase">Virement Bancaire</td>
                                                    </tr>
                                                    <tr className="bg-[#F3F2F9]/50">
                                                        <td className="p-4 font-bold text-sm">Référence de paiement</td>
                                                        <td className="p-4 text-right font-bold text-sm font-mono tracking-tighter">REF-BNK-99283-XP</td>
                                                    </tr>
                                                    <tr className="border-t-4 border-[#8178BB]">
                                                        <td className="p-4 font-black uppercase text-sm text-[#8178BB]">Reste à payer</td>
                                                        <td className="p-4 text-right font-black text-3xl text-orange-500">{selectedTransaction.remaining.toLocaleString()} FCFA</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex justify-between items-end mt-20">
                                            <div className="text-center w-64 border-t-2 border-gray-100 pt-6">
                                                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8">Signature et cachet de l'administration</p>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-24 h-24 border-4 border-[#8178BB]/20 rounded-full flex items-center justify-center mb-4 text-[#8178BB] opacity-30 select-none pointer-events-none">
                                                        <span className="font-black text-2xl rotate-45">PAID</span>
                                                    </div>
                                                    <p className="text-sm font-bold">Nom : Alice Lawson</p>
                                                </div>
                                            </div>
                                            <div className="text-right space-y-4 flex flex-col items-end">
                                                <button 
                                                    onClick={() => {
                                                        // Update student status to validated (step 5)
                                                        setStudents(prev => prev.map(s => 
                                                            (s.nom + " " + (s.prenom || "")) === selectedTransaction.studentName 
                                                            ? { ...s, status_step: 5, status: 'Validé' } 
                                                            : s
                                                        ));
                                                        alert(`Le reçu ${selectedTransaction.id} a été envoyé par email à l'étudiant ${selectedTransaction.studentName}. Il peut désormais le télécharger depuis son espace.`);
                                                        setSelectedTransaction(null);
                                                    }}
                                                    className="w-full bg-[#8178BB] text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#8178BB]/90 transition-all flex items-center justify-center gap-3 no-print shadow-lg shadow-[#8178BB]/20"
                                                >
                                                    <Send size={18} /> Envoyer le reçu
                                                </button>
                                                <button 
                                                    onClick={() => setSelectedTransaction(null)}
                                                    className="w-full bg-gray-100 text-gray-500 px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-3 no-print"
                                                >
                                                    Fermer le document
                                                </button>
                                                <button 
                                                    onClick={() => window.print()}
                                                    className="w-full bg-gray-800 text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 no-print"
                                                >
                                                    <Printer size={20} /> Imprimer le reçu
                                                </button>
                                                <p className="text-[10px] text-gray-300 italic">Document généré électroniquement • ESF Bénin 2026</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </Card>
                );

            case 'exams':
                return (
                    <div className="space-y-8">
                        <Card>
                            <h3 className="text-xl font-black uppercase tracking-tight mb-8">Suivi de saisie des notes</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                                            <th className="p-4 text-left">Cours</th>
                                            <th className="p-4 text-left">Enseignant</th>
                                            <th className="p-4 text-left">Statut</th>
                                            <th className="p-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {[
                                            { course: 'Algorithmique', prof: 'Dr. Koffi', status: 'Green' },
                                            { course: 'Réseaux IP', prof: 'M. Soro', status: 'Orange' },
                                            { course: 'Anglais Tech', prof: 'Mme. Brown', status: 'Red' },
                                        ].map((c, i) => (
                                            <tr key={i} className="hover:bg-[#F3F2F9]/50 transition-colors">
                                                <td className="p-4 font-bold text-sm text-gray-800">{c.course}</td>
                                                <td className="p-4 text-xs font-bold text-gray-600">{c.prof}</td>
                                                <td className="p-4">
                                                    <div className={`w-3 h-3 rounded-full ${c.status === 'Green' ? 'bg-green-500' : c.status === 'Orange' ? 'bg-orange-500' : 'bg-red-500'}`} />
                                                </td>
                                                <td className="p-4 flex justify-center gap-2">
                                                    <button className="p-2 text-[#8178BB] hover:bg-[#8178BB]/10 rounded-lg transition-all"><Mail size={16} /></button>
                                                    <button className="p-2 text-[#8178BB] hover:bg-[#8178BB]/10 rounded-lg transition-all"><Eye size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card>
                                <h3 className="text-lg font-black uppercase tracking-tight mb-6">Documents Officiels</h3>
                                <div className="space-y-4">
                                    <PrimaryButton className="w-full" icon={FileText}>Générer Certificat de Scolarité</PrimaryButton>
                                    <PrimaryButton className="w-full" icon={GraduationCap}>Générer Relevé de Notes</PrimaryButton>
                                </div>
                            </Card>
                            <Card>
                                <h3 className="text-lg font-black uppercase tracking-tight mb-6">Planning des Épreuves</h3>
                                <div className="space-y-4">
                                    {[
                                        { date: '15 Mai', room: 'Amphi A', invig: 'Dr. Yao' },
                                        { date: '16 Mai', room: 'Salle 102', invig: 'M. Soro' }
                                    ].map((ex, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-[#F3F2F9] rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <Calendar size={16} className="text-[#8178BB]" />
                                                <span className="text-sm font-bold text-gray-800">{ex.date}</span>
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">{ex.room}</span>
                                            <span className="text-xs font-black uppercase tracking-widest text-[#8178BB]">{ex.invig}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                );

            case 'communication':
                const templates: { id: CommunicationTemplate, label: string, icon: any, color: string }[] = [
                    { id: 'pieces_manquantes', label: 'Pièces Manquantes', icon: Files, color: 'bg-orange-100 text-orange-500' },
                    { id: 'convocation', label: 'Convocation Entretien', icon: User, color: 'bg-blue-100 text-blue-500' },
                    { id: 'retard_paiement', label: 'Retard de Paiement', icon: AlertCircle, color: 'bg-red-100 text-red-500' }
                ];

                const today = new Date().toISOString().split('T')[0];
                const studentsSentToday = students.filter(s => s.submissionDate === today);
                const studentsMissingDocs = students.filter(s => s.statut === 'Incomplet');
                const studentsWithArrears = MOCK_TRANSACTIONS.filter(t => t.remaining > 0);

                return (
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-12 lg:col-span-4 space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 px-2">Modèles de messages</h3>
                            {templates.map((t) => (
                                <button 
                                    key={t.id} 
                                    onClick={() => {
                                        setSelectedTemplate(t.id);
                                        setSelectedStudents([]);
                                        if (t.id === 'pieces_manquantes') setCommMessage("Bonjour, des pièces sont manquantes dans votre dossier. Veuillez les soumettre rapidement.");
                                        if (t.id === 'convocation') setCommMessage("Bonjour, vous êtes convié à un entretien avec l'administration.");
                                        if (t.id === 'retard_paiement') setCommMessage("Bonjour, nous vous informons d'un retard de paiement sur votre scolarité.");
                                    }}
                                    className={`w-full p-6 rounded-2xl border transition-all flex items-center gap-4 group active:scale-95 ${selectedTemplate === t.id ? 'bg-[#8178BB] border-[#8178BB] shadow-lg' : 'bg-white border-gray-100 shadow-sm hover:shadow-lg hover:border-[#8178BB]/30'}`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedTemplate === t.id ? 'bg-white/20 text-white' : t.color}`}>
                                        <t.icon size={20} />
                                    </div>
                                    <span className={`font-black text-xs uppercase tracking-widest ${selectedTemplate === t.id ? 'text-white' : 'text-gray-700'}`}>{t.label}</span>
                                    <ChevronRight size={16} className={`ml-auto transition-colors ${selectedTemplate === t.id ? 'text-white' : 'text-gray-300 group-hover:text-[#8178BB]'}`} />
                                </button>
                            ))}

                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 px-2 mb-4">Actions de groupe</h3>
                                <PrimaryButton 
                                    className="w-full" 
                                    icon={Send} 
                                    disabled={selectedStudents.length === 0}
                                    onClick={() => alert(`Message envoyé à ${selectedStudents.length} étudiants.`)}
                                >
                                    Envoyer ({selectedStudents.length})
                                </PrimaryButton>
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-8 space-y-6">
                            {selectedTemplate === 'none' ? (
                                <Card>
                                    <h3 className="text-xl font-black uppercase tracking-tight mb-8">Système de Tickets</h3>
                                    <div className="space-y-4">
                                        {[
                                            { student: 'Jean Kouassi', req: 'Correction nom', status: 'Open' },
                                            { student: 'Mariam Diallo', req: 'Demande certificat', status: 'Closed' },
                                            { student: 'Moussa Traoré', req: 'Problème accès portail', status: 'Open' }
                                        ].map((tk, i) => (
                                            <div key={i} className="flex items-center justify-between p-5 bg-[#F3F2F9] rounded-2xl border border-transparent hover:border-[#8178BB]/20 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#8178BB] transition-colors">
                                                        <MessageSquare size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800">{tk.req}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{tk.student}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${tk.status === 'Open' ? 'bg-orange-100 text-orange-500' : 'bg-green-100 text-green-600'}`}>
                                                    {tk.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ) : (
                                <Card>
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tight"> Sélection des Destinataires</h3>
                                            <p className="text-xs font-bold text-gray-400 mt-1">
                                                {selectedTemplate === 'pieces_manquantes' ? "Affichage des dossiers soumis aujourd'hui" : 
                                                 selectedTemplate === 'retard_paiement' ? "Étudiants ayant une balance impayée" :
                                                 "Sélectionner des étudiants pour l'entretien"}
                                            </p>
                                        </div>
                                        {selectedTemplate === 'pieces_manquantes' && (
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Aujourd'hui: {studentsSentToday.length} dossiers</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="overflow-y-auto max-h-[400px] mb-8 pr-2">
                                        <table className="w-full">
                                            <thead className="sticky top-0 bg-white">
                                                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                                                    <th className="p-4 text-left w-10">
                                                        <input 
                                                            type="checkbox" 
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    const list = selectedTemplate === 'pieces_manquantes' ? studentsMissingDocs :
                                                                                 selectedTemplate === 'retard_paiement' ? studentsWithArrears.map(t => students.find(s => s.nom + " " + s.prenom === t.studentName)?.id).filter(Boolean) as string[] :
                                                                                 students.map(s => s.id);
                                                                    setSelectedStudents(list);
                                                                } else {
                                                                    setSelectedStudents([]);
                                                                }
                                                            }}
                                                            className="rounded border-gray-300 text-[#8178BB]" 
                                                        />
                                                    </th>
                                                    <th className="p-4 text-left">Étudiant</th>
                                                    <th className="p-4 text-left">{selectedTemplate === 'retard_paiement' ? 'Balance' : 'Statut'}</th>
                                                    {selectedTemplate === 'retard_paiement' && <th className="p-4 text-right">Délai</th>}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {(selectedTemplate === 'pieces_manquantes' ? studentsMissingDocs :
                                                  selectedTemplate === 'retard_paiement' ? studentsWithArrears.map(t => ({ 
                                                      id: students.find(s => s.nom + " " + s.prenom === t.studentName)?.id || t.id,
                                                      nom: t.studentName,
                                                      balance: t.remaining,
                                                      date: t.date
                                                  })) : 
                                                  students).map((item: any) => (
                                                    <tr key={item.id} className="hover:bg-[#F3F2F9]/50 transition-colors">
                                                        <td className="p-4">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={selectedStudents.includes(item.id)}
                                                                onChange={() => toggleStudent(item.id)}
                                                                className="rounded border-gray-300 text-[#8178BB]" 
                                                            />
                                                        </td>
                                                        <td className="p-4">
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-800">{item.nom} {item.prenom || ''}</p>
                                                                <p className="text-[10px] text-gray-400 font-bold">{item.id}</p>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            {selectedTemplate === 'retard_paiement' ? (
                                                                <span className="text-sm font-black text-red-500">{item.balance.toLocaleString()} FCFA</span>
                                                            ) : (
                                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                                                    item.statut === 'Validé' ? 'bg-green-100 text-green-600' : 
                                                                    item.statut === 'Complet' ? 'bg-blue-100 text-blue-600' : 
                                                                    'bg-orange-100 text-orange-500'
                                                                }`}>
                                                                    {item.statut}
                                                                </span>
                                                            )}
                                                        </td>
                                                        {selectedTemplate === 'retard_paiement' && (
                                                            <td className="p-4 text-right text-[10px] font-bold text-gray-400">
                                                                {item.date}
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-[#8178BB]">Message à envoyer</h4>
                                        <textarea 
                                            value={commMessage}
                                            onChange={(e) => setCommMessage(e.target.value)}
                                            className="w-full bg-[#F3F2F9] border-none rounded-xl p-6 text-sm font-medium focus:ring-2 focus:ring-[#8178BB]/20 transition-all outline-none resize-none h-32"
                                            placeholder="Écrivez votre message ici..."
                                        />
                                        <div className="flex justify-end gap-3">
                                            <button 
                                                onClick={() => setSelectedTemplate('none')}
                                                className="px-6 py-3 rounded-xl font-bold text-sm text-gray-400 hover:text-gray-600 transition-all"
                                            >
                                                Annuler
                                            </button>
                                            <PrimaryButton 
                                                icon={Send}
                                                disabled={selectedStudents.length === 0}
                                                onClick={() => {
                                                    alert(`Message envoyé à ${selectedStudents.length} étudiants.`);
                                                    setSelectedTemplate('none');
                                                }}
                                            >
                                                Envoyer le message
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                );

            case 'planning':
                return (
                    <div className="space-y-8">
                        <Card>
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-xl font-black uppercase tracking-tight">Emploi du temps quotidien</h3>
                                <PrimaryButton className="bg-red-500 hover:bg-red-600" icon={XCircle}>
                                    Annuler / Déplacer cours
                                </PrimaryButton>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { time: '08:00 - 10:00', course: 'Algorithmique', prof: 'Dr. Koffi', room: 'Salle A101' },
                                    { time: '10:00 - 12:00', course: 'Réseaux IP', prof: 'M. Soro', room: 'Labo Info 1' },
                                    { time: '14:00 - 16:00', course: 'Anglais Tech', prof: 'Mme. Brown', room: 'Salle 202' },
                                ].map((slot, i) => (
                                    <div key={i} className="flex items-center gap-6 p-6 bg-[#F3F2F9] rounded-2xl border-l-4 border-[#8178BB]">
                                        <div className="w-32 shrink-0">
                                            <p className="text-xs font-black text-[#8178BB] uppercase tracking-widest">{slot.time}</p>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-base font-black text-gray-800">{slot.course}</h4>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{slot.prof}</p>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                                            <Clock size={14} className="text-gray-400" />
                                            <span className="text-xs font-black uppercase tracking-widest text-gray-700">{slot.room}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );

            case 'classes':
                return (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black uppercase tracking-tight">Classes & Filières</h3>
                            <PrimaryButton icon={Plus}>Ajouter une Classe</PrimaryButton>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { name: 'L1 Informatique', count: 45, courses: 8 },
                                { name: 'L2 Informatique', count: 38, courses: 10 },
                                { name: 'L3 Informatique', count: 32, courses: 12 },
                                { name: 'L1 Gestion', count: 55, courses: 7 },
                                { name: 'L2 Gestion', count: 48, courses: 9 },
                            ].map((cls, i) => (
                                <Card key={i} className="hover:shadow-xl transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 bg-[#F3F2F9] text-[#8178BB] rounded-2xl flex items-center justify-center group-hover:bg-[#8178BB] group-hover:text-white transition-all">
                                            <GraduationCap size={24} />
                                        </div>
                                        <button className="text-gray-400 hover:text-[#8178BB]"><MoreVertical size={16} /></button>
                                    </div>
                                    <h4 className="font-black text-gray-800 mb-2">{cls.name}</h4>
                                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <span>{cls.count} Étudiants</span>
                                        <span>•</span>
                                        <span>{cls.courses} Cours</span>
                                    </div>
                                    <div className="mt-6 flex gap-2 pt-4 border-t border-gray-50">
                                        <button className="flex-1 py-2 rounded-lg bg-[#F3F2F9] text-[#8178BB] font-black text-[10px] uppercase tracking-widest hover:bg-[#8178BB] hover:text-white transition-all">Gérer Cours</button>
                                        <button className="flex-1 py-2 rounded-lg bg-[#F3F2F9] text-[#8178BB] font-black text-[10px] uppercase tracking-widest hover:bg-[#8178BB] hover:text-white transition-all">Liste</button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            case 'payments':
                return (
                    <div className="space-y-8 h-full overflow-y-auto pr-2 pb-20">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight">Suivi des Encaissements</h3>
                                <p className="text-xs font-bold text-gray-400 mt-1">Consultez l'état des paiements des étudiants</p>
                            </div>
                        </div>
                        
                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                                            <th className="p-4 text-left">Étudiant</th>
                                            <th className="p-4 text-left">Classe / Filière</th>
                                            <th className="p-4 text-left">État Paiement</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {students.map(student => (
                                            <tr key={student.id} className="hover:bg-[#F3F2F9]/50 transition-colors group">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-[#8178BB]/10 text-[#8178BB] rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                                                            {student.nom?.charAt(0)}
                                                        </div>
                                                        <span className="font-bold text-gray-800 text-sm">{student.nom} {student.prenom}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <p className="text-xs font-bold text-gray-600">{student.classe || 'L1'}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{student.filiere}</p>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                                                        student.status_step >= 5 ? 'bg-green-100 text-green-600' :
                                                        student.status_step === 4 ? 'bg-orange-100 text-orange-500' :
                                                        'bg-gray-100 text-gray-400'
                                                    }`}>
                                                        {student.status_step >= 5 ? 'PAYÉ / VALIDÉ' : student.status_step === 4 ? 'EN ATTENTE' : 'IMPAYÉ'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button 
                                                        onClick={() => {
                                                            setActivePage('dossiers');
                                                            setCurrentStudentId(student.id);
                                                        }}
                                                        className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest hover:underline"
                                                    >
                                                        Voir Dossier
                                                    </button>
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
                    <div className="space-y-8">
                        <Card>
                            <h3 className="text-xl font-black uppercase tracking-tight mb-8">Vos Notifications</h3>
                            <div className="space-y-4">
                                {notifications.length === 0 ? (
                                    <div className="py-20 text-center text-gray-300">
                                        <Bell size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Aucune nouvelle notification</p>
                                    </div>
                                ) : (
                                    notifications.map(n => (
                                        <div 
                                            key={n.id} 
                                            className={`flex items-center justify-between p-5 rounded-2xl border transition-all group ${n.read ? 'bg-[#F3F2F9] border-transparent' : 'bg-white border-[#8178BB]/20 shadow-sm'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div 
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer ${n.read ? 'bg-white text-gray-400' : 'bg-[#8178BB] text-white'}`}
                                                    onClick={() => {
                                                        if (n.targetStudentId) {
                                                            setActivePage('dossiers');
                                                            setCurrentStudentId(n.targetStudentId);
                                                            markNotificationAsRead(n.id);
                                                        }
                                                    }}
                                                >
                                                    {getNotificationIcon(n.type)}
                                                </div>
                                                <div 
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        if (n.targetStudentId) {
                                                            setActivePage('dossiers');
                                                            setCurrentStudentId(n.targetStudentId);
                                                            markNotificationAsRead(n.id);
                                                        }
                                                    }}
                                                >
                                                    <p className={`text-sm font-bold ${n.read ? 'text-gray-600' : 'text-gray-800'}`}>{n.message}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                        {new Date(n.timestamp).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                                                    </p>
                                                </div>
                                            </div>
                                            {!n.read && (
                                                <button 
                                                    onClick={() => markNotificationAsRead(n.id)}
                                                    className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest hover:underline"
                                                >
                                                    Marquer comme lu
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="h-screen bg-[#F3F2F9] flex font-sans tracking-tight text-[#2D2D2D] overflow-hidden">
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
                    <SidebarItem icon={Home} label="Tableau de Bord" active={activePage === 'home'} onClick={() => setActivePage('home')} />
                    <SidebarItem icon={Files} label="Gestion des Dossiers" active={activePage === 'dossiers'} onClick={() => setActivePage('dossiers')} />
                    <SidebarItem icon={CreditCard} label="Paiements & Reçus" active={activePage === 'payments'} onClick={() => setActivePage('payments')} />
                    <SidebarItem icon={GraduationCap} label="Scolarité & Examens" active={activePage === 'exams'} onClick={() => setActivePage('exams')} />
                    <SidebarItem icon={MessageSquare} label="Communication" active={activePage === 'communication'} onClick={() => setActivePage('communication')} />
                    <SidebarItem icon={Calendar} label="Planning & Salles" active={activePage === 'planning'} onClick={() => setActivePage('planning')} />
                    <SidebarItem icon={Briefcase} label="Classes & Filières" active={activePage === 'classes'} onClick={() => setActivePage('classes')} />
                </nav>

                <div className="mt-auto space-y-2 pt-6 border-t border-white/10">
                    <SidebarItem icon={Bell} label="Notifications" active={activePage === 'notifications'} onClick={() => setActivePage('notifications')} />
                    <SidebarItem icon={Settings} label="Paramètres" active={false} onClick={() => {}} />
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
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Rechercher par nom ou ID..."
                                className="w-full bg-[#F3F2F9] border-none rounded-xl py-3 px-6 pl-12 text-sm font-bold focus:ring-2 focus:ring-[#8178BB]/20 transition-all outline-none placeholder:text-gray-400"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8178BB] transition-colors" size={18} />
                        </div>

                        <div className="relative">
                            <div 
                                onClick={() => setShowYearDropdown(!showYearDropdown)}
                                className="flex items-center gap-3 bg-[#F3F2F9] px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                            >
                                <Calendar size={16} className="text-[#8178BB]" />
                                <span className="text-xs font-black uppercase tracking-widest text-gray-600">{selectedYear}</span>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${showYearDropdown ? 'rotate-180' : ''}`} />
                            </div>

                            <AnimatePresence>
                                {showYearDropdown && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                                    >
                                        {ACADEMIC_YEARS.map(year => (
                                            <div 
                                                key={year}
                                                onClick={() => { setSelectedYear(year); setShowYearDropdown(false); }}
                                                className="px-4 py-3 text-xs font-bold text-gray-600 hover:bg-[#F3F2F9] hover:text-[#8178BB] transition-colors cursor-pointer"
                                            >
                                                {year}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 ml-8">
                        <button 
                            onClick={() => setActivePage('notifications')}
                            className="p-3 bg-[#F3F2F9] rounded-xl text-gray-400 hover:text-[#8178BB] transition-all relative"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white rounded-full border-2 border-white text-[10px] font-bold flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
                            <div className="text-right">
                                <p className="text-sm font-black text-gray-800 uppercase tracking-widest">Secrétaire</p>
                                <p className="text-[10px] font-black text-[#8178BB]">Alice Lawson</p>
                            </div>
                            <div className="w-10 h-10 bg-[#8178BB] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#8178BB]/20">
                                <User size={20} />
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
            {/* Document Viewer Modal */}
            <AnimatePresence>
                {viewingDoc && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col relative"
                        >
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-gray-800 uppercase tracking-tight text-sm">{viewingDoc.name}</h3>
                                <button onClick={() => setViewingDoc(null)} className="p-2 hover:bg-gray-200 rounded-full transition-all">
                                    <XCircle size={24} className="text-gray-500" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-auto p-4 flex justify-center items-center bg-gray-100 min-h-[500px]">
                                {viewingDoc.url.toLowerCase().endsWith('.pdf') ? (
                                    <iframe src={viewingDoc.url} className="w-full h-[70vh] rounded-xl" title="PDF Viewer" />
                                ) : (
                                    <img src={viewingDoc.url} alt={viewingDoc.name} className="max-w-full h-auto shadow-2xl rounded-lg" />
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
