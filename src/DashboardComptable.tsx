import React, { useState, useEffect, useRef } from 'react';
import {
    Home,
    CreditCard,
    BarChart3,
    Users,
    MessageSquare,
    Search,
    Bell,
    User,
    ChevronDown,
    Filter,
    Printer,
    Download,
    TrendingUp,
    DollarSign,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    LogOut,
    CheckCircle,
    Settings,
    X,
    ExternalLink,
    AlertCircle,
    ClipboardCheck,
    Save,
    Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Theme Colors ---
const colors = {
    primary: '#8178BB',
    secondary: '#1E293B',
    accent: '#F59E0B',
    bg: '#F3F2F9',
    white: '#FFFFFF',
    text: '#2D2D2D',
    textMuted: '#6B7280',
    success: '#10B981',
    error: '#EF4444',
};

// --- Types ---
type Page = 'overview' | 'payments' | 'tracking' | 'reports' | 'registration' | 'matricules';

interface Transaction {
    id: string;
    studentName: string;
    class: string;
    amount: number;
    type: 'Scolarité' | 'Inscription' | 'Examen';
    date: string;
    status: 'Validé' | 'En attente';
    method: 'Espèces' | 'Virement' | 'Mobile Money';
}

interface StudentTracking {
    id: string;
    name: string;
    class: string;
    filiere: string;
    totalDue: number;
    totalPaid: number;
    status: 'Payé' | 'Partiel' | 'Impayé';
}

interface FiliereFees {
    id: string;
    name: string;
    inscription: number;
    inscriptionDeadline: string;
    tranche1: number;
    tranche1Deadline: string;
    tranche2: number;
    tranche2Deadline: string;
    tranche3: number;
    tranche3Deadline: string;
    fraisStage: number;
    fraisStageDeadline: string;
    fraisDossier: number;
    fraisDossierDeadline: string;
}

interface AcademicTariff {
    id: string;
    label: string;
    price: number;
}

// --- Mock Data ---
const MOCK_TRANSACTIONS: Transaction[] = [];

const MOCK_STUDENTS: StudentTracking[] = [];

const INITIAL_FILIERE_FEES: FiliereFees[] = [
    { id: '1', name: 'Analyses Biologiques et Biochimiques', inscription: 50000, inscriptionDeadline: '2024-09-30', tranche1: 300000, tranche1Deadline: '2024-11-15', tranche2: 300000, tranche2Deadline: '2025-01-15', tranche3: 150000, tranche3Deadline: '2025-04-15', fraisStage: 150000, fraisStageDeadline: '2025-06-01', fraisDossier: 10000, fraisDossierDeadline: '2024-09-15' },
    { id: '2', name: 'Bâtiments et Travaux Publics', inscription: 50000, inscriptionDeadline: '2024-09-30', tranche1: 250000, tranche1Deadline: '2024-11-15', tranche2: 250000, tranche2Deadline: '2025-01-15', tranche3: 100000, tranche3Deadline: '2025-04-15', fraisStage: 50000, fraisStageDeadline: '2025-06-01', fraisDossier: 10000, fraisDossierDeadline: '2024-09-15' },
    { id: '3', name: 'Géomètre Topographe', inscription: 50000, inscriptionDeadline: '2024-09-30', tranche1: 250000, tranche1Deadline: '2024-11-15', tranche2: 250000, tranche2Deadline: '2025-01-15', tranche3: 100000, tranche3Deadline: '2025-04-15', fraisStage: 50000, fraisStageDeadline: '2025-06-01', fraisDossier: 10000, fraisDossierDeadline: '2024-09-15' },
    { id: '4', name: 'Génie Electrique et Energies Renouvelables', inscription: 50000, inscriptionDeadline: '2024-09-30', tranche1: 250000, tranche1Deadline: '2024-11-15', tranche2: 250000, tranche2Deadline: '2025-01-15', tranche3: 100000, tranche3Deadline: '2025-04-15', fraisStage: 50000, fraisStageDeadline: '2025-06-01', fraisDossier: 10000, fraisDossierDeadline: '2024-09-15' },
    { id: '5', name: 'Système Informatique et Logiciel', inscription: 50000, inscriptionDeadline: '2024-09-30', tranche1: 300000, tranche1Deadline: '2024-11-15', tranche2: 300000, tranche2Deadline: '2025-01-15', tranche3: 150000, tranche3Deadline: '2025-04-15', fraisStage: 150000, fraisStageDeadline: '2025-06-01', fraisDossier: 10000, fraisDossierDeadline: '2024-09-15' },
    { id: '6', name: 'Banque Finance Assurance', inscription: 50000, inscriptionDeadline: '2024-09-30', tranche1: 250000, tranche1Deadline: '2024-11-15', tranche2: 250000, tranche2Deadline: '2025-01-15', tranche3: 100000, tranche3Deadline: '2025-04-15', fraisStage: 50000, fraisStageDeadline: '2025-06-01', fraisDossier: 10000, fraisDossierDeadline: '2024-09-15' },
    { id: '7', name: 'Finance Comptabilité Audit', inscription: 50000, inscriptionDeadline: '2024-09-30', tranche1: 250000, tranche1Deadline: '2024-11-15', tranche2: 250000, tranche2Deadline: '2025-01-15', tranche3: 100000, tranche3Deadline: '2025-04-15', fraisStage: 50000, fraisStageDeadline: '2025-06-01', fraisDossier: 10000, fraisDossierDeadline: '2024-09-15' },
    { id: '8', name: 'Gestion des Ressources Humaines', inscription: 50000, inscriptionDeadline: '2024-09-30', tranche1: 250000, tranche1Deadline: '2024-11-15', tranche2: 250000, tranche2Deadline: '2025-01-15', tranche3: 100000, tranche3Deadline: '2025-04-15', fraisStage: 50000, fraisStageDeadline: '2025-06-01', fraisDossier: 10000, fraisDossierDeadline: '2024-09-15' },
    { id: '9', name: 'Marketing Communication Commerce', inscription: 50000, inscriptionDeadline: '2024-09-30', tranche1: 250000, tranche1Deadline: '2024-11-15', tranche2: 250000, tranche2Deadline: '2025-01-15', tranche3: 100000, tranche3Deadline: '2025-04-15', fraisStage: 50000, fraisStageDeadline: '2025-06-01', fraisDossier: 10000, fraisDossierDeadline: '2024-09-15' },
    { id: '10', name: 'Transport logistique', inscription: 50000, inscriptionDeadline: '2024-09-30', tranche1: 250000, tranche1Deadline: '2024-11-15', tranche2: 250000, tranche2Deadline: '2025-01-15', tranche3: 100000, tranche3Deadline: '2025-04-15', fraisStage: 50000, fraisStageDeadline: '2025-06-01', fraisDossier: 10000, fraisDossierDeadline: '2024-09-15' },
    { id: '11', name: 'Hôtellerie et Tourisme', inscription: 50000, inscriptionDeadline: '2024-09-30', tranche1: 250000, tranche1Deadline: '2024-11-15', tranche2: 250000, tranche2Deadline: '2025-01-15', tranche3: 100000, tranche3Deadline: '2025-04-15', fraisStage: 50000, fraisStageDeadline: '2025-06-01', fraisDossier: 10000, fraisDossierDeadline: '2024-09-15' },
    { id: '12', name: 'Génie de l’Environnement – Traitement des déchets et des eaux', inscription: 50000, inscriptionDeadline: '2024-09-30', tranche1: 250000, tranche1Deadline: '2024-11-15', tranche2: 250000, tranche2Deadline: '2025-01-15', tranche3: 100000, tranche3Deadline: '2025-04-15', fraisStage: 50000, fraisStageDeadline: '2025-06-01', fraisDossier: 10000, fraisDossierDeadline: '2024-09-15' }
];

const INITIAL_ACADEMIC_TARIFFS: AcademicTariff[] = [
    { id: 't1', label: 'Certificat de Scolarité', price: 2000 },
    { id: 't2', label: 'Attestation d’Inscription', price: 2000 },
    { id: 't3', label: 'Bulletin de Notes', price: 1000 },
];

// --- Sub-Components ---

const ReceiptModal = ({ transaction, onClose }: { transaction: Transaction, onClose: () => void }) => (
    <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
    >
        <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl relative"
        >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <X size={20} />
            </button>
            
            <div className="bg-[#8178BB] p-10 text-white">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter mb-1">REÇU DE PAIEMENT</h2>
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{transaction.id}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <CheckCircle size={24} />
                    </div>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Montant Payé</p>
                        <p className="text-4xl font-black">{transaction.amount.toLocaleString()} F CFA</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Date</p>
                        <p className="font-bold">{transaction.date.split(' ')[0]}</p>
                    </div>
                </div>
            </div>

            <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-8 text-sm">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Détails Étudiant</p>
                        <p className="font-black text-gray-800">{transaction.studentName}</p>
                        <p className="text-gray-500 font-bold">{transaction.class}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Info Paiement</p>
                        <p className="font-black text-gray-800">{transaction.type}</p>
                        <p className="text-gray-500 font-bold">{transaction.method}</p>
                    </div>
                </div>

                <div className="bg-[#F3F2F9] p-6 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-[10px] text-center font-bold text-gray-400 leading-relaxed">
                        Ce document sert de preuve officielle de paiement. <br/> 
                        L'université Faucon vous remercie pour votre confiance.
                    </p>
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 bg-gray-100 text-gray-800 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                        <Download size={16} /> Télécharger PDF
                    </button>
                    <button className="flex-1 bg-[#8178BB] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#8178BB]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                        <Printer size={16} /> Imprimer Reçu
                    </button>
                </div>
            </div>
        </motion.div>
    </motion.div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[18px] text-[12px] font-bold transition-all relative group overflow-hidden ${active
            ? 'bg-white text-[#8178BB] shadow-[0_15px_30px_rgba(0,0,0,0.12)]'
            : 'text-white/60 hover:text-white hover:bg-white/5 hover:translate-x-1'
        }`}
    >
        <Icon size={18} className="relative z-10 shrink-0" />
        <span className="relative z-10">{label}</span>
    </button>
);

const ReceiptViewerModal = ({ user, onClose, onValidate }: { user: any, onClose: () => void, onValidate: (id: number) => void }) => (
    <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
    >
        <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-4xl h-[90vh] rounded-[40px] overflow-hidden shadow-2xl flex flex-col"
        >
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                <div>
                  <h3 className="text-xl font-black text-gray-800">Vérification du Paiement</h3>
                  <p className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest mt-1">{user.lastname} {user.firstname}</p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => { onValidate(user.id); onClose(); }} 
                    className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
                  >
                    Valider l'encaissement
                  </button>
                  <button onClick={onClose} className="p-3 bg-gray-100 text-gray-400 hover:text-gray-600 rounded-2xl transition-all">
                    <X size={20} />
                  </button>
                </div>
            </div>
            
            <div className="flex-1 bg-gray-50 p-8 overflow-hidden">
                <div className="w-full h-full bg-white rounded-3xl shadow-inner border border-gray-100 overflow-hidden relative">
                    {user.receipt_url ? (
                        user.receipt_url.toLowerCase().endsWith('.pdf') ? (
                           <iframe src={`/storage/${user.receipt_url}`} className="w-full h-full border-none" title="Reçu" />
                        ) : (
                           <img src={`/storage/${user.receipt_url}`} className="w-full h-full object-contain" alt="Reçu de paiement" />
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-4">
                            <AlertCircle size={48} />
                            <p className="font-black uppercase text-xs tracking-widest">Aucun fichier joint trouvé</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    </motion.div>
);

const Card = ({ children, className = "", title, subtitle, action }: any) => (
    <div className={`bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 ${className}`}>
        {(title || action) && (
            <div className="flex justify-between items-center mb-8">
                <div>
                    {title && <h3 className="text-lg font-black uppercase tracking-tight text-gray-800">{title}</h3>}
                    {subtitle && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{subtitle}</p>}
                </div>
                {action && <div>{action}</div>}
            </div>
        )}
        {children}
    </div>
);

const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <Card className="flex flex-col gap-3 min-h-[160px] justify-between">
        <div className="flex justify-between items-start">
            <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/5 shrink-0`}>
                <Icon size={22} />
            </div>
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <h4 className="text-2xl font-black text-gray-800 leading-none break-all">{value}</h4>
        </div>
    </Card>
);

export default function DashboardComptable() {
    const [activePage, setActivePage] = useState<Page>('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFiliereFilter, setSelectedFiliereFilter] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [filiereFees, setFiliereFees] = useState<FiliereFees[]>(INITIAL_FILIERE_FEES);
    const [academicTariffs, setAcademicTariffs] = useState<AcademicTariff[]>(INITIAL_ACADEMIC_TARIFFS);
    const [selectedFiliere, setSelectedFiliere] = useState<FiliereFees | null>(null);
    const [selectedStudentForMatricule, setSelectedStudentForMatricule] = useState({
        id: '',
        nom: '',
        prenom: '',
        filiere: '',
        email: '',
        telephone: '',
        matricule: ''
    });
    const [students, setStudents] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [viewingReceiptUser, setViewingReceiptUser] = useState<any>(null);
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedFiliere && editorRef.current) {
            editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [selectedFiliere]);

    const filteredTransactions = students
        .filter(s => (s.status_step || 1) >= 4)
        .map(s => ({
            id: `FAC-25-${s.id}`,
            date: s.created_at?.split(' ')[0] || new Date().toISOString().split('T')[0],
            studentName: `${s.lastname} ${s.firstname}`,
            method: 'Virement',
            amount: (s.status_step || 1) >= 5 ? 50000 : 0
        }))
        .filter(t => 
            t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.id.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const updateFiliereFee = (id: string, field: keyof FiliereFees, value: string) => {
        let finalValue: any = value;
        if (!field.toLowerCase().includes('deadline') && field !== 'name') {
            finalValue = parseInt(value) || 0;
        }
        setFiliereFees(prev => prev.map(f => f.id === id ? { ...f, [field]: finalValue } : f));
        if (selectedFiliere?.id === id) {
            setSelectedFiliere(prev => prev ? { ...prev, [field]: finalValue } : null);
        }
    };

    const fetchStudents = () => {
        const token = localStorage.getItem('token');
        fetch('/api/admin/students', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setStudents(data);
                
                // Generate notifications for validated students without matricules
                const matriculeNotifs = data
                    .filter((s: any) => s.status_step === 2 && !s.matricule)
                    .map((s: any) => ({
                        id: `notif-valid-${s.id}`,
                        message: `Nouveau dossier validé : ${s.lastname} ${s.firstname}`,
                        type: 'info',
                        student: s,
                        action: 'matricule'
                    }));

                // Generate notifications for students who submitted receipts
                const paymentNotifs = data
                    .filter((s: any) => s.status_step === 4)
                    .map((s: any) => ({
                        id: `notif-payment-${s.id}`,
                        message: `Nouveau reçu déposé : ${s.lastname} ${s.firstname}`,
                        type: 'payment',
                        student: s,
                        action: 'payment'
                    }));

                setNotifications([...matriculeNotifs, ...paymentNotifs]);
            })
            .catch(err => console.error('Error fetching students:', err));
    };

    useEffect(() => {
        fetchStudents();
        const interval = setInterval(fetchStudents, 10000); // Polling for new validations
        return () => clearInterval(interval);
    }, []);

    const updateAcademicTariff = (id: string, price: string) => {
        const numPrice = parseInt(price) || 0;
        setAcademicTariffs(prev => prev.map(t => t.id === id ? { ...t, price: numPrice } : t));
    };

    const handleGenerateMatricule = () => {
        if (!selectedStudentForMatricule.id || !selectedStudentForMatricule.matricule) {
            alert("Veuillez sélectionner un étudiant et entrer un matricule");
            return;
        }

        const token = localStorage.getItem('token');
        fetch('/api/admin/generate-matricule', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                studentId: selectedStudentForMatricule.id,
                matricule: selectedStudentForMatricule.matricule,
                email: selectedStudentForMatricule.email
            })
        })
        .then(res => res.json())
        .then(() => {
            alert(`Matricule attribué à ${selectedStudentForMatricule.nom} ${selectedStudentForMatricule.prenom}. Un email a été généré.`);
            fetchStudents();
            setActivePage('overview');
        })
        .catch(err => alert("Erreur lors de la génération du matricule"));
    };

    const handleValidatePayment = (studentId: number) => {
        const token = localStorage.getItem('token');
        fetch('/api/admin/validate-payment', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({ studentId })
        })
        .then(res => res.json())
        .then(() => {
            alert("Paiement validé avec succès.");
            fetchStudents();
        })
        .catch(err => alert("Erreur lors de la validation du paiement"));
    };

    const renderPage = () => {
        switch (activePage) {
            case 'overview':
                return (
                    <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <StatCard label="Paiement du jour" value="700,000 F" icon={DollarSign} color="bg-[#8178BB]" />
                            <StatCard label="Recette du mois" value="12,400,000 F" icon={TrendingUp} color="bg-emerald-500" />
                            <StatCard label="Étudiants en règle" value="245" icon={Users} color="bg-orange-500" />
                            <StatCard label="Taux de recouvrement" value="78%" icon={BarChart3} color="bg-indigo-500" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <Card className="lg:col-span-2" title="Flux des Paiements" subtitle="Nouveaux reçus et transactions récentes">
                                <div className="space-y-4">
                                    {/* Pending Receipts */}
                                    {students.filter(s => s.status_step === 4).map((student) => (
                                        <div key={student.id} className="flex items-center justify-between p-5 bg-orange-50 rounded-2xl group hover:shadow-xl hover:shadow-orange-500/5 transition-all border border-orange-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-500 font-black shadow-sm border border-orange-50">
                                                    {student.lastname?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-800">{student.lastname} {student.firstname}</p>
                                                    <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mt-1">Nouveau Reçu à valider • {student.filiere}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => setViewingReceiptUser(student)}
                                                    className="p-3 bg-white text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-sm border border-orange-100"
                                                    title="Voir le reçu"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleValidatePayment(student.id)}
                                                    className="px-5 py-3 bg-orange-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                                                >
                                                    Valider
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Validated/Recent Students */}
                                    {students.filter(s => s.status_step >= 5).slice(0, 5).map((student) => (
                                        <div key={student.id} className="flex items-center justify-between p-5 bg-[#F3F2F9]/50 rounded-2xl group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all border border-transparent hover:border-[#8178BB]/20">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#8178BB] font-black shadow-sm">
                                                    {student.lastname?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-800">{student.lastname} {student.firstname}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{student.filiere} • Scolarité</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex items-center gap-6">
                                                <div>
                                                    <p className="font-black text-sm text-emerald-600">Validé</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Aujourd'hui</p>
                                                </div>
                                                <div className="p-2 text-gray-300 group-hover:text-[#8178BB] cursor-pointer" onClick={() => setSelectedTransaction({
                                                    id: `FAC-25-${student.id}`,
                                                    studentName: `${student.lastname} ${student.firstname}`,
                                                    class: student.level || 'L1',
                                                    amount: 50000,
                                                    type: 'Inscription',
                                                    date: new Date().toISOString().split('T')[0],
                                                    status: 'Validé',
                                                    method: 'Mobile Money'
                                                })}>
                                                    <Printer size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {students.filter(s => s.status_step >= 4).length === 0 && (
                                        <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                                            <CreditCard size={40} className="text-gray-400 mb-4" />
                                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Aucun paiement récent</p>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <Card title="Répartition / Filière" subtitle="Recettes par département">
                                <div className="space-y-6">
                                    {[
                                        { name: 'Informatique', val: 78, color: 'bg-[#8178BB]' },
                                        { name: 'Droit & Management', val: 45, color: 'bg-emerald-500' },
                                        { name: 'Santé', val: 92, color: 'bg-indigo-500' },
                                        { name: 'Génie Civil', val: 30, color: 'bg-orange-500' }
                                    ].map((cat, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-gray-700">
                                                <span>{cat.name}</span>
                                                <span className="text-gray-400">{cat.val}%</span>
                                            </div>
                                            <div className="h-2 bg-[#F3F2F9] rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${cat.val}%` }} transition={{ duration: 1, delay: i * 0.1 }} className={`h-full ${cat.color} rounded-full`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                );

            case 'tracking':
                return (
                    <div className="space-y-8">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-3xl font-black text-gray-800 tracking-tighter">Gestion de la Scolarité</h3>
                                <p className="text-sm font-bold text-[#8178BB] uppercase tracking-[0.2em] mt-1">Configuration des tarifs par Filière</p>
                            </div>
                            <button className="bg-[#1E293B] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-[#1E293B]/20 hover:scale-105 transition-all">
                                <Save size={16} /> Appliquer les Tarifs
                            </button>
                        </div>

                        {/* Filiere Fees Editor Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filiereFees.map((f) => (
                                <Card key={f.id} className={`transition-all border-2 ${selectedFiliere?.id === f.id ? 'border-[#8178BB]/50 bg-[#8178BB]/5' : 'border-transparent'}`}>
                                    <h4 className="font-black text-gray-800 text-[11px] leading-tight mb-4 min-h-[32px]">{f.name}</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black text-gray-400 uppercase">Total</span>
                                            <span className="text-sm font-black text-[#8178BB]">{(f.inscription + f.tranche1 + f.tranche2 + f.tranche3 + f.fraisStage + f.fraisDossier).toLocaleString()} F</span>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setSelectedFiliere(null);
                                                setTimeout(() => setSelectedFiliere(f), 0);
                                            }}
                                            className="w-full py-2 bg-[#F3F2F9] rounded-xl text-[10px] font-black text-gray-600 hover:bg-[#8178BB] hover:text-white transition-all uppercase tracking-widest"
                                        >
                                            Éditer les frais
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {selectedFiliere && (
                            <motion.div 
                                ref={editorRef}
                                initial={{ opacity: 0, y: 30 }} 
                                animate={{ opacity: 1, y: 0 }}
                                className="scroll-mt-10"
                            >
                                <Card title={`Détails des frais: ${selectedFiliere.name}`} subtitle="Définition des montants et délais par type de frais">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {[
                                                { id: 'inscription', label: 'Inscription' },
                                                { id: 'tranche1', label: '1ère Tranche' },
                                                { id: 'tranche2', label: '2ème Tranche' },
                                                { id: 'tranche3', label: '3ème Tranche' },
                                                { id: 'fraisStage', label: 'Frais de Stage' },
                                                { id: 'fraisDossier', label: 'Frais de Dossier' }
                                            ].map((fee) => (
                                                <div key={fee.id} className="p-5 bg-[#F3F2F9]/50 rounded-2xl border border-transparent hover:border-[#8178BB]/10 transition-all space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black text-[#8178BB] uppercase tracking-[0.1em]">{fee.label}</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[8px] font-black text-gray-400 uppercase">Montant (F)</label>
                                                            <input 
                                                                type="number" 
                                                                value={(selectedFiliere as any)[fee.id]} 
                                                                onChange={(e) => updateFiliereFee(selectedFiliere.id, fee.id as any, e.target.value)}
                                                                className="w-full bg-white border-none rounded-xl py-2 px-3 text-xs font-black text-gray-800 outline-none focus:ring-1 focus:ring-[#8178BB]/40"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[8px] font-black text-gray-400 uppercase">Délai limite</label>
                                                            <input 
                                                                type="date" 
                                                                value={(selectedFiliere as any)[`${fee.id}Deadline`]} 
                                                                onChange={(e) => updateFiliereFee(selectedFiliere.id, `${fee.id}Deadline` as any, e.target.value)}
                                                                className="w-full bg-white border-none rounded-xl py-2 px-3 text-xs font-black text-gray-800 outline-none focus:ring-1 focus:ring-[#8178BB]/40"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                                            <p className="text-[10px] font-bold text-gray-400 italic flex items-center gap-2 uppercase tracking-widest">
                                                <AlertCircle size={14} /> Publication automatique des délais pour {selectedFiliere.name}
                                            </p>
                                            <div className="flex gap-3">
                                                <button onClick={() => setSelectedFiliere(null)} className="px-6 py-3 font-black text-[9px] uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Annuler</button>
                                                <button onClick={() => setSelectedFiliere(null)} className="bg-[#8178BB] text-white px-8 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-[#8178BB]/20 hover:bg-[#7168A0] transition-all">Enregistrer les délais</button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Academic Documents Tariffs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card title="Tarifs Actes Académiques" subtitle="Documents officiels et certificats">
                                <div className="space-y-4">
                                    {academicTariffs.map((t) => (
                                        <div key={t.id} className="flex items-center justify-between p-4 bg-[#F3F2F9]/50 rounded-2xl border border-transparent hover:border-[#8178BB]/10 transition-all">
                                            <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">{t.label}</span>
                                            <div className="flex items-center gap-4">
                                                <input 
                                                    type="number" 
                                                    value={t.price} 
                                                    onChange={(e) => updateAcademicTariff(t.id, e.target.value)}
                                                    className="w-24 bg-white border-none rounded-xl py-2 px-3 text-right text-xs font-black text-[#8178BB] outline-none"
                                                />
                                                <span className="text-[10px] font-black text-gray-400 uppercase">F CFA</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6">
                                    <button className="w-full bg-[#1E293B] text-white py-3.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-black/5 hover:bg-slate-800 transition-all">
                                        Valider les Tarifs Documents
                                    </button>
                                </div>
                            </Card>

                            <Card title="Aide au Recouvrement" subtitle="Statistiques rapides">
                                <div className="space-y-6">
                                    <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100/50">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Moyenne de paiement</p>
                                        <h5 className="text-2xl font-black text-emerald-700">62.4%</h5>
                                        <p className="text-[9px] font-bold text-emerald-600/60 mt-2 italic">Toutes filières confondues</p>
                                    </div>
                                    <div className="p-5 bg-orange-50 rounded-3xl border border-orange-100/50">
                                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Échéance Proche</p>
                                        <h5 className="text-2xl font-black text-orange-700">30 Octobre</h5>
                                        <p className="text-[9px] font-bold text-orange-600/60 mt-2 italic">Délai standard pour les tranches d'automne</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-xl font-black text-gray-800 tracking-tighter">Status des Étudiants</h4>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                        <input type="text" placeholder="Rechercher un étudiant..." className="bg-white border-none rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold outline-none ring-1 ring-gray-100 focus:ring-[#8178BB]/20 w-64" />
                                    </div>
                                </div>
                            </div>
                            <Card>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50">
                                                <th className="p-6 text-left">Étudiant</th>
                                                <th className="p-6 text-left">Filière / Classe</th>
                                                <th className="p-6 text-right">Scorlarité Totale</th>
                                                <th className="p-6 text-right font-black text-emerald-600">Total Payé</th>
                                                <th className="p-6 text-right text-red-500">Reste à Recouvrer</th>
                                                <th className="p-6 text-center">Statut</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {students.map(student => {
                                                const fees = filiereFees.find(f => f.name === student.filiere);
                                                const totalDue = fees ? (fees.inscription + fees.tranche1 + fees.tranche2 + fees.tranche3 + fees.fraisStage + fees.fraisDossier) : 800000;
                                                const totalPaid = student.status_step >= 5 ? totalDue : (student.status_step >= 4 ? 50000 : 0);
                                                return (
                                                    <tr key={student.id} className="hover:bg-[#F3F2F9]/50 transition-colors cursor-pointer group">
                                                        <td className="p-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-500 group-hover:text-[#8178BB] transition-colors">
                                                                    {student.lastname?.charAt(0)}
                                                                </div>
                                                                <span className="font-bold text-gray-800">{student.lastname} {student.firstname}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight w-48">{student.filiere || 'Générale'} <br/> <span className="text-[8px] text-gray-300">{student.level || 'L1'}</span></td>
                                                        <td className="p-6 text-right font-black text-sm text-gray-800">{totalDue.toLocaleString()} F</td>
                                                        <td className="p-6 text-right font-bold text-sm text-emerald-600">+{totalPaid.toLocaleString()} F</td>
                                                        <td className="p-6 text-right font-black text-sm text-red-500">{(totalDue - totalPaid).toLocaleString()} F</td>
                                                        <td className="p-6 text-center">
                                                            <div className="flex items-center justify-center gap-3">
                                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                                                                    totalPaid >= totalDue ? 'bg-green-100 text-green-600' : 
                                                                    totalPaid > 0 ? 'bg-orange-100 text-orange-500' : 
                                                                    'bg-red-100 text-red-600'
                                                                }`}>
                                                                    {totalPaid >= totalDue ? 'À JOUR' : totalPaid > 0 ? 'PARTIEL' : 'IMPAYÉ'}
                                                                </span>
                                                                {student.status_step === 4 && (
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setViewingReceiptUser(student);
                                                                        }}
                                                                        className="p-2 bg-[#8178BB]/10 text-[#8178BB] rounded-lg hover:bg-[#8178BB] hover:text-white transition-all shadow-sm"
                                                                        title="Voir le reçu"
                                                                    >
                                                                        <Eye size={14} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    </div>
                );

            case 'registration':
                return (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-3xl font-black text-gray-800 tracking-tighter">Inscription des Étudiants</h3>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Liste des dossiers validés</div>
                        </div>
                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50">
                                            <th className="p-6 text-left">Nom</th>
                                            <th className="p-6 text-left">Prénom</th>
                                            <th className="p-6 text-left">Filière</th>
                                            <th className="p-6 text-left">Email</th>
                                            <th className="p-6 text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {students.filter(s => s.status_step >= 2).map(student => (
                                            <tr 
                                                key={student.id} 
                                                onClick={() => {
                                                    setSelectedStudentForMatricule({
                                                        id: student.id.toString(),
                                                        nom: student.lastname,
                                                        prenom: student.firstname,
                                                        filiere: student.filiere || 'Générale',
                                                        email: student.email || `${student.id}@faucon.ci`,
                                                        telephone: student.phone || 'N/A',
                                                        matricule: student.matricule || `25-${student.lastname?.slice(0,3).toUpperCase()}-00${student.id}`
                                                    });
                                                    setActivePage('matricules');
                                                }}
                                                className="hover:bg-[#8178BB]/5 transition-colors cursor-pointer group"
                                            >
                                                <td className="p-6 font-bold text-gray-800">{student.lastname}</td>
                                                <td className="p-6 font-bold text-gray-800">{student.firstname}</td>
                                                <td className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">{student.filiere || 'Générale'}</td>
                                                <td className="p-6 text-sm text-[#8178BB] font-medium">{student.email}</td>
                                                <td className="p-6">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${student.matricule ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                                        {student.matricule ? 'Inscrit' : 'Matricule à générer'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                );

            case 'matricules':
                return (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-12">
                            <h3 className="text-3xl font-black text-gray-800 tracking-tighter">Génération de Matricule</h3>
                            <p className="text-sm font-bold text-[#8178BB] uppercase tracking-[0.2em] mt-1">Attribution d'identifiant unique étudiant</p>
                        </div>
                        <Card>
                            <form className="space-y-8 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom de l'étudiant</label>
                                        <input 
                                            type="text" 
                                            value={selectedStudentForMatricule.nom}
                                            onChange={(e) => setSelectedStudentForMatricule({...selectedStudentForMatricule, nom: e.target.value})}
                                            placeholder="Ex: Kouamé" 
                                            className="w-full bg-[#F3F2F9] border-none rounded-xl py-4 px-5 text-sm font-black text-gray-800 outline-none focus:ring-2 focus:ring-[#8178BB]/20" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prénom de l'étudiant</label>
                                        <input 
                                            type="text" 
                                            value={selectedStudentForMatricule.prenom}
                                            onChange={(e) => setSelectedStudentForMatricule({...selectedStudentForMatricule, prenom: e.target.value})}
                                            placeholder="Ex: Marc" 
                                            className="w-full bg-[#F3F2F9] border-none rounded-xl py-4 px-5 text-sm font-black text-gray-800 outline-none focus:ring-2 focus:ring-[#8178BB]/20" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filière</label>
                                        <select 
                                            value={selectedStudentForMatricule.filiere}
                                            onChange={(e) => setSelectedStudentForMatricule({...selectedStudentForMatricule, filiere: e.target.value})}
                                            className="w-full bg-[#F3F2F9] border-none rounded-xl py-4 px-5 text-sm font-black text-gray-800 outline-none focus:ring-2 focus:ring-[#8178BB]/20 appearance-none"
                                        >
                                            <option value="">Sélectionner une filière</option>
                                            {filiereFees.map(f => (
                                                <option key={f.id} value={f.name}>{f.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Adresse E-mail</label>
                                        <input 
                                            type="email" 
                                            value={selectedStudentForMatricule.email}
                                            onChange={(e) => setSelectedStudentForMatricule({...selectedStudentForMatricule, email: e.target.value})}
                                            placeholder="etudiant@faucon.ci" 
                                            className="w-full bg-[#F3F2F9] border-none rounded-xl py-4 px-5 text-sm font-black text-gray-800 outline-none focus:ring-2 focus:ring-[#8178BB]/20" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Numéro de Téléphone</label>
                                        <input 
                                            type="tel" 
                                            value={selectedStudentForMatricule.telephone}
                                            onChange={(e) => setSelectedStudentForMatricule({...selectedStudentForMatricule, telephone: e.target.value})}
                                            placeholder="+225 00 00 00 00 00" 
                                            className="w-full bg-[#F3F2F9] border-none rounded-xl py-4 px-5 text-sm font-black text-gray-800 outline-none focus:ring-2 focus:ring-[#8178BB]/20" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Matricule</label>
                                        <input 
                                            type="text" 
                                            value={selectedStudentForMatricule.matricule}
                                            onChange={(e) => setSelectedStudentForMatricule({...selectedStudentForMatricule, matricule: e.target.value})}
                                            placeholder="Ex: 25-INF-001" 
                                            className="w-full bg-[#F3F2F9] border-2 border-[#8178BB]/20 rounded-xl py-4 px-5 text-sm font-black text-[#8178BB] outline-none focus:ring-2 focus:ring-[#8178BB]/40" 
                                        />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-gray-100 flex justify-end">
                                    <button 
                                        type="button"
                                        onClick={handleGenerateMatricule}
                                        className="bg-[#1E293B] text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-black/10 hover:scale-[1.02] transition-all"
                                    >
                                        Générer et envoyer par email
                                    </button>
                                </div>
                            </form>
                        </Card>
                    </div>
                );

            case 'payments':
                const filteredByMore = filteredTransactions.filter(tr => {
                    const matchFiliere = !selectedFiliereFilter || tr.studentName.includes('Mohamed') || tr.studentName.includes('Sery'); 
                    const matchDate = !selectedDate || tr.date.startsWith(selectedDate);
                    const matchMethod = !selectedMethod || tr.method === selectedMethod;
                    return matchFiliere && matchDate && matchMethod;
                });
                const pendingReceipts = students.filter(s => s.status_step === 4);
                return (
                    <div className="space-y-8 h-full overflow-y-auto pr-2 pb-20">
                        {pendingReceipts.length > 0 && (
                            <Card title="Attentes de Validation" subtitle={`${pendingReceipts.length} reçus à vérifier`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pendingReceipts.map(student => (
                                        <div key={student.id} className="p-6 bg-[#8178BB]/5 border border-[#8178BB]/10 rounded-3xl flex flex-col gap-4">
                                            <div className="flex justify-between items-start">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-[#8178BB]">
                                                    {student.lastname?.charAt(0)}
                                                </div>
                                                <span className="bg-orange-100 text-orange-600 text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">Nouveau Reçu</span>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-800 text-sm truncate">{student.lastname} {student.firstname}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{student.filiere}</p>
                                            </div>
                                            <button 
                                                onClick={() => setViewingReceiptUser(student)}
                                                className="w-full bg-white text-[#8178BB] py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm border border-[#8178BB]/10 hover:bg-[#8178BB] hover:text-white transition-all flex items-center justify-center gap-2"
                                            >
                                                <Eye size={14} /> Voir le reçu
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        <Card title="Journal des Encaissements" subtitle="Historique complet des transactions">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="Nom étudiant..." 
                                        className="w-full bg-[#F3F2F9] border-none rounded-xl py-3 pl-12 pr-6 text-xs font-bold outline-none"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <select 
                                    className="bg-[#F3F2F9] border-none rounded-xl py-3 px-6 text-xs font-black uppercase tracking-widest text-gray-500 outline-none"
                                    value={selectedFiliereFilter}
                                    onChange={(e) => setSelectedFiliereFilter(e.target.value)}
                                >
                                    <option value="">Toutes les Filières</option>
                                    {filiereFees.map(f => (
                                        <option key={f.id} value={f.name}>{f.name}</option>
                                    ))}
                                </select>
                                <input 
                                    type="date"
                                    className="bg-[#F3F2F9] border-none rounded-xl py-3 px-6 text-xs font-black text-gray-500 outline-none"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                                <select 
                                    className="bg-[#F3F2F9] border-none rounded-xl py-3 px-6 text-xs font-black uppercase tracking-widest text-gray-500 outline-none"
                                    value={selectedMethod}
                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                >
                                    <option value="">Méthode de Paiement</option>
                                    <option value="Virement">Virement</option>
                                    <option value="Espèces">Espèces</option>
                                    <option value="Mobile Money">Mobile Money</option>
                                </select>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            <th className="p-4 text-left">Référence</th>
                                            <th className="p-4 text-left">Date</th>
                                            <th className="p-4 text-left">Étudiant</th>
                                            <th className="p-4 text-left">Méthode</th>
                                            <th className="p-4 text-right">Montant</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredByMore.map(tr => (
                                            <tr key={tr.id} className="hover:bg-[#F3F2F9]/50 transition-colors group">
                                                <td className="p-4 text-[10px] font-black text-[#8178BB] uppercase tracking-widest">{tr.id}</td>
                                                <td className="p-4 text-xs font-bold text-gray-400">{tr.date}</td>
                                                <td className="p-4 font-bold text-sm text-gray-800">{tr.studentName}</td>
                                                <td className="p-4 text-xs font-bold text-gray-400 uppercase">{tr.method}</td>
                                                <td className="p-4 text-right font-black text-sm text-gray-800">{tr.amount.toLocaleString()} F</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                );

            default:
                return (
                    <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-[32px] flex items-center justify-center text-gray-300"><BarChart3 size={40} /></div>
                        <div>
                            <p className="font-black text-gray-800 uppercase tracking-widest">Module de Reporting en préparation</p>
                            <p className="text-gray-400 text-xs font-bold mt-2">Les analytiques avancées arrivent bientôt dans votre espace.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F2F9] flex font-sans tracking-tight text-[#2D2D2D] overflow-hidden">
            <AnimatePresence>
                {selectedTransaction && <ReceiptModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />}
                {viewingReceiptUser && <ReceiptViewerModal user={viewingReceiptUser} onClose={() => setViewingReceiptUser(null)} onValidate={handleValidatePayment} />}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className="w-[240px] bg-gradient-to-b from-[#8178BB] to-[#7168A0] flex flex-col py-8 px-5 relative z-[101] shadow-[25px_0_80px_rgba(129,120,187,0.2)]">
                <div className="mb-12 px-4">
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-2xl font-black tracking-tighter leading-tight">
                            <span className="text-white">Fau</span><span className="text-slate-900">con</span>
                        </span>
                    </div>
                    <div className="h-px w-full bg-white/10 mt-4" />
                </div>

                <nav className="flex-1 space-y-1.5">
                    <SidebarItem icon={Home} label="Vue d'ensemble" active={activePage === 'overview'} onClick={() => setActivePage('overview')} />
                    <SidebarItem icon={CreditCard} label="Encaissements" active={activePage === 'payments'} onClick={() => setActivePage('payments')} />
                    <SidebarItem icon={Users} label="Inscription" active={activePage === 'registration'} onClick={() => setActivePage('registration')} />
                    <SidebarItem icon={User} label="Génération Matricule" active={activePage === 'matricules'} onClick={() => setActivePage('matricules')} />
                    <SidebarItem icon={ClipboardCheck} label="Suivi Scolarité" active={activePage === 'tracking'} onClick={() => setActivePage('tracking')} />
                    <SidebarItem icon={MessageSquare} label="Rappels SMS" active={false} onClick={() => {}} />
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[18px] text-[12px] font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all">
                        <Settings size={18} />
                        <span>Configuration</span>
                    </button>
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
                <header className="h-24 bg-white border-b border-gray-100 flex items-center justify-between px-12 shrink-0 z-50">
                    <div className="flex items-center gap-8 flex-1 max-w-2xl">
                        <div className="flex items-center gap-3 bg-[#F3F2F9] px-6 py-3 rounded-2xl">
                            <Calendar size={18} className="text-[#8178BB]" />
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                                {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 ml-8">
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-4 bg-[#F3F2F9] rounded-2xl text-gray-400 hover:text-[#8178BB] transition-all relative"
                            >
                                <Bell size={20} />
                                {notifications.length > 0 && (
                                    <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"></span>
                                )}
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-80 bg-white rounded-[32px] shadow-2xl border border-gray-100 p-6 z-[200]"
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8178BB]">Notifications</h4>
                                            <span className="text-[10px] font-black bg-[#8178BB]/10 text-[#8178BB] px-2 py-1 rounded-full">{notifications.length}</span>
                                        </div>
                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {notifications.length === 0 ? (
                                                <p className="text-[10px] font-bold text-gray-400 text-center py-4 uppercase">Aucune nouvelle notification</p>
                                            ) : (
                                                notifications.map(n => (
                                                    <div 
                                                        key={n.id} 
                                                        onClick={() => {
                                                            if (n.action === 'matricule') {
                                                                setSelectedStudentForMatricule({
                                                                    id: n.student.id.toString(),
                                                                    nom: n.student.lastname,
                                                                    prenom: n.student.firstname,
                                                                    filiere: n.student.filiere || 'Générale',
                                                                    email: n.student.email || `${n.student.id}@faucon.ci`,
                                                                    telephone: n.student.phone || 'N/A',
                                                                    matricule: n.student.matricule || `25-${n.student.lastname?.slice(0,3).toUpperCase()}-00${n.student.id}`
                                                                });
                                                                setActivePage('matricules');
                                                            } else if (n.action === 'payment') {
                                                                setViewingReceiptUser(n.student);
                                                                setActivePage('tracking');
                                                            }
                                                            setShowNotifications(false);
                                                        }}
                                                        className="p-4 bg-[#F3F2F9]/50 rounded-2xl hover:bg-[#8178BB]/5 cursor-pointer transition-all border border-transparent hover:border-[#8178BB]/10"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2 h-2 rounded-full ${n.type === 'payment' ? 'bg-emerald-500' : 'bg-[#8178BB]'}`} />
                                                            <p className="text-[11px] font-bold text-gray-800 leading-tight">{n.message}</p>
                                                        </div>
                                                        <p className="text-[8px] font-black text-[#8178BB] uppercase tracking-widest mt-2">{n.action === 'payment' ? 'Cliquer pour voir le reçu' : 'Cliquer pour générer matricule'}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
                            <div className="text-right">
                                <p className="text-sm font-black text-gray-800 leading-tight">Marc Kouamé</p>
                                <p className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest mt-1">Chef Comptable</p>
                            </div>
                            <div className="w-12 h-12 bg-[#8178BB] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#8178BB]/20 font-black text-xs">
                                MK
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-12 bg-[#F3F2F9]/50">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePage}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderPage()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

