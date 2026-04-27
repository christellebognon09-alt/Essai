import React, { useState, useRef } from 'react';
import {
    Home,
    Users,
    UserPlus,
    Briefcase,
    Shield,
    BarChart3,
    Search,
    Bell,
    User,
    ChevronDown,
    Settings,
    LogOut,
    MoreVertical,
    Mail,
    Phone,
    CheckCircle,
    XCircle,
    Plus,
    Database,
    Lock,
    School,
    Clock,
    MapPin,
    Activity,
    Save,
    Eye,
    Hammer,
    Megaphone,
    AlertTriangle,
    FileText,
    Key,
    UserMinus,
    Calendar,
    Cloud,
    ChevronRight,
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
type Page = 'dashboard' | 'users' | 'structure' | 'security' | 'settings' | 'communication';

interface NewsArticle {
    id: number;
    title: string;
    content: string;
    description: string;
    image_url: string;
    category: string;
    date_posted: string;
}

interface UserAccount {
    id: string;
    nome: string;
    role: 'Secrétaire' | 'Professeur' | 'Admin' | 'Étudiant' | 'Comptable';
    email: string;
    status: 'Actif' | 'Inactif' | 'Suspendu';
    lastLogin: string;
    permissions?: string[];
    password?: string;
}

interface AuditLog {
    id: string;
    user: string;
    action: string;
    target: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error';
}

// --- Mock Data ---
const MOCK_USERS: UserAccount[] = [
    { id: 'USR001', nome: 'Secrétaire', role: 'Secrétaire', email: 'secretaire@gmail.com', status: 'Actif', lastLogin: 'Il y a 2h', permissions: ['Voir Inscriptions', 'Valider Dossiers'], password: '12345' },
    { id: 'USR002', nome: 'Professeur', role: 'Professeur', email: 'professeur@gmail.com', status: 'Actif', lastLogin: 'Il y a 10m', permissions: ['Saisir Notes', 'Gérer Cours'], password: '12345' },
    { id: 'USR003', nome: 'Comptable', role: 'Comptable', email: 'comptable@gmail.com', status: 'Actif', lastLogin: 'Jamais', permissions: ['Finances'], password: '12345' },
];

const MOCK_AUDIT: AuditLog[] = [
    { id: 'L001', user: 'Alice Lawson', action: 'Modification Note', target: 'Jean Dupont (Maths)', timestamp: '12/10 à 14:05', status: 'success' },
    { id: 'L002', user: 'Admin', action: 'Backup Système', target: 'Serveur Principal', timestamp: '12/10 à 03:00', status: 'success' },
    { id: 'L003', user: 'Inconnu', action: 'Tentative d\'accès', target: 'Portail Professeur', timestamp: '11/10 à 23:45', status: 'error' },
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
    </button>
);

const Card = ({ children, className = "", title, subtitle, action }: any) => (
    <div className={`bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 ${className}`}>
        {(title || action) && (
            <div className="flex justify-between items-center mb-8">
                <div>
                    {title && <h3 className="text-lg font-black uppercase tracking-tight text-gray-800">{title}</h3>}
                    {subtitle && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">{subtitle}</p>}
                </div>
                {action && <div>{action}</div>}
            </div>
        )}
        {children}
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        'Actif': 'bg-green-100 text-green-600',
        'Inactif': 'bg-gray-100 text-gray-500',
        'Suspendu': 'bg-red-100 text-red-600',
        'success': 'bg-green-100 text-green-600',
        'warning': 'bg-orange-100 text-orange-600',
        'error': 'bg-red-100 text-red-600',
    };
    return (
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${styles[status] || styles['Inactif']}`}>
            {status}
        </span>
    );
};

export default function DashboardAdmin() {
    const [activePage, setActivePage] = useState<Page>('dashboard');
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [departements, setDepartements] = useState<any[]>([]);
    const [annees, setAnnees] = useState<any[]>([]);
    const [activeAnnee, setActiveAnnee] = useState<any>(null);
    const [selectedDept, setSelectedDept] = useState<any>(null);
    const [selectedFiliere, setSelectedFiliere] = useState<any>(null);
    const [expandedSemester, setExpandedSemester] = useState<number | null>(null);
    const [editAnneeData, setEditAnneeData] = useState<{id?: number, nom: string, date_debut: string, date_fin: string}>({nom: '', date_debut: '', date_fin: ''});
    const [newArticle, setNewArticle] = useState({ title: '', content: '', description: '', image_url: '', category: 'Événement' });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isPostingNews, setIsPostingNews] = useState(false);
    
    // File state and previews
    const coverRef = useRef<HTMLInputElement>(null);
    const photosRef = useRef<HTMLInputElement>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setGalleryFiles(prev => [...prev, ...newFiles]);
            const newPreviews = newFiles.map((file: File) => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryFile = (index: number) => {
        // Revoke URL to avoid memory leaks
        URL.revokeObjectURL(previews[index]);
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (coverPreview) URL.revokeObjectURL(coverPreview);
            setCoverPreview(URL.createObjectURL(file));
        } else {
            setCoverPreview(null);
        }
    };

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };
        
        if (activePage === 'communication') {
            fetch('/api/news', { headers })
                .then(res => res.json())
                .then(data => setNews(Array.isArray(data) ? data : []))
                .catch(err => console.error('Error fetching news:', err));
        }
        
        if (activePage === 'structure') {
            fetch('/api/academique/departements', { headers })
                .then(res => res.json())
                .then(data => setDepartements(Array.isArray(data) ? data : []))
                .catch(err => console.error('Error fetching departements:', err));

            fetch('/api/academique/annees', { headers })
                .then(res => res.json())
                .then(data => {
                    const anneesArray = Array.isArray(data) ? data : [];
                    setAnnees(anneesArray);
                    const active = anneesArray.find((a: any) => a.est_active) || anneesArray[0] || null;
                    setActiveAnnee(active);
                    if (active) {
                        setEditAnneeData({
                            id: active.id,
                            nom: active.nom,
                            date_debut: active.date_debut.split('T')[0],
                            date_fin: active.date_fin.split('T')[0]
                        });
                    }
                })
                .catch(err => console.error('Error fetching annees:', err));
        }
    }, [activePage]);

    // Synchronisation initiale du state
    React.useEffect(() => {
        if (activeAnnee && !editAnneeData.id) {
            setEditAnneeData({
                id: activeAnnee.id,
                nom: activeAnnee.nom,
                date_debut: activeAnnee.date_debut.split('T')[0],
                date_fin: activeAnnee.date_fin ? activeAnnee.date_fin.split('T')[0] : ''
            });
        }
    }, [activeAnnee, editAnneeData.id]);

    const handleUpdateAnnee = async () => {
        if (!editAnneeData.id) return;
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/academique/annees/${editAnneeData.id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(editAnneeData)
        });
        if (res.ok) {
            const data = await res.json();
            if (activeAnnee?.id === data.annee.id) {
                setActiveAnnee(data.annee);
            }
            setAnnees(annees.map((a:any) => a.id === data.annee.id ? data.annee : a));
            alert("Période mise à jour avec succès !");
        }
    };

    const handleAddDepartement = async () => {
        const nom = prompt("Nom de la faculté/département :");
        if (!nom) return;
        const token = localStorage.getItem('token');
        const res = await fetch('/api/academique/departements', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ nom })
        });
        if (res.ok) {
            const data = await res.json();
            setDepartements([...departements, data.departement]);
        }
    };

    const handleAddAnnee = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/academique/annees', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ nom: "Nouvelle Période", date_debut: new Date().toISOString().split('T')[0], est_active: false })
        });
        if (res.ok) {
            const data = await res.json();
            setAnnees([...annees, data.annee]);
            setEditAnneeData({
                id: data.annee.id,
                nom: data.annee.nom,
                date_debut: data.annee.date_debut.split('T')[0],
                date_fin: data.annee.date_fin ? data.annee.date_fin.split('T')[0] : ''
            });
        }
    };

    const handleActivateAnnee = async (id: number) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/academique/annees/${id}/activer`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        if (res.ok) {
            const data = await res.json();
            setActiveAnnee(data.annee);
            setAnnees(annees.map((a:any) => ({ ...a, est_active: a.id === id })));
            alert("Période activée et visible par les étudiants !");
        }
    };

    const handleDeleteDepartement = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Supprimer ce département et toutes ses filières ?')) return;
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/academique/departements/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setDepartements(departements.filter(d => d.id !== id));
    };

    const handleAddFiliere = async () => {
        if (!selectedDept) return;
        const nom = prompt("Nom de la filière (ex: Système Informatique et Logiciel) :");
        const code = prompt("Code de la filière (ex: SIL) :");
        if (!nom || !code) return;
        const token = localStorage.getItem('token');
        const res = await fetch('/api/academique/filieres', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ nom, code, departement_id: selectedDept.id })
        });
        if (res.ok) {
            const data = await res.json();
            const updatedDept = { ...selectedDept, filieres: [...(selectedDept.filieres || []), data.filiere] };
            setSelectedDept(updatedDept);
            setDepartements(departements.map(d => d.id === selectedDept.id ? updatedDept : d));
        }
    };

    const handleDeleteFiliere = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Supprimer cette filière ?')) return;
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/academique/filieres/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
            const updatedDept = { ...selectedDept, filieres: selectedDept.filieres.filter((f:any) => f.id !== id) };
            setSelectedDept(updatedDept);
            setDepartements(departements.map(d => d.id === selectedDept.id ? updatedDept : d));
        }
    };

    const handleAddMatiere = async (semestre: number) => {
        if (!selectedFiliere) return;
        const nom = prompt(`Nom de la matière pour le Semestre ${semestre} :`);
        const code = prompt("Code de la matière (ex: ALP1104) :");
        const credits = prompt("Crédits ECTS (ex: 6) :");
        if (!nom || !code || !credits) return;
        const token = localStorage.getItem('token');
        const res = await fetch('/api/academique/matieres', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ nom, code, credits: parseInt(credits), semestre, filiere_id: selectedFiliere.id })
        });
        if (res.ok) {
            const data = await res.json();
            alert("Matière ajoutée ! Vous pourrez y lier des Éléments Constitutifs plus tard.");
            
            const newMatiere = { ...data.matiere, elements_constitutifs: [] };
            const updatedMatieres = [...(selectedFiliere.matieres || []), newMatiere];
            const updatedFiliere = { ...selectedFiliere, matieres: updatedMatieres };
            
            setSelectedFiliere(updatedFiliere);

            // Synchroniser avec le département sélectionné
            if (selectedDept) {
                const updatedFilieres = selectedDept.filieres.map((f:any) => 
                    f.id === selectedFiliere.id ? updatedFiliere : f
                );
                const updatedDept = { ...selectedDept, filieres: updatedFilieres };
                setSelectedDept(updatedDept);
                setDepartements(departements.map(d => d.id === selectedDept.id ? updatedDept : d));
            }
        }
    };

    const handleDeleteMatiere = async (id: number) => {
        if (!confirm('Supprimer cette matière et ses EC ?')) return;
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/academique/matieres/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
            setSelectedFiliere({ ...selectedFiliere, matieres: selectedFiliere.matieres.filter((m:any) => m.id !== id) });
        }
    };

    const handleAddEC = async (matiereId: number) => {
        const nom = prompt("Nom de l'élément constitutif (ex: Algorithmique) :");
        if (!nom) return;
        const token = localStorage.getItem('token');
        const res = await fetch('/api/academique/elements', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ nom, matiere_id: matiereId })
        });
        if (res.ok) {
            const data = await res.json();
            const updatedMatieres = selectedFiliere.matieres.map((m:any) => 
                m.id === matiereId ? { ...m, elements_constitutifs: [...(m.elements_constitutifs || []), data.ec] } : m
            );
            setSelectedFiliere({ ...selectedFiliere, matieres: updatedMatieres });
        }
    };

    const handleDeleteEC = async (id: number, matiereId: number) => {
        if (!confirm('Supprimer cet Élément Constitutif ?')) return;
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/academique/elements/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
            const updatedMatieres = selectedFiliere.matieres.map((m:any) => 
                m.id === matiereId ? { ...m, elements_constitutifs: m.elements_constitutifs.filter((ec:any) => ec.id !== id) } : m
            );
            setSelectedFiliere({ ...selectedFiliere, matieres: updatedMatieres });
        }
    };

    const handlePostNews = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("[NEWS] Submitting form...", { editingId, newArticle });
        setIsPostingNews(true);
        
        const formData = new FormData();
        formData.append('title', newArticle.title);
        formData.append('content', newArticle.content);
        formData.append('description', newArticle.description);
        formData.append('category', newArticle.category);
        
        if (coverRef.current?.files?.[0]) {
            formData.append('cover', coverRef.current.files[0]);
        }
        
        galleryFiles.forEach(file => {
            formData.append('photos', file);
        });

        try {
            const url = editingId ? `/api/admin/news/${editingId}` : '/api/admin/news';
            const method = editingId ? 'PUT' : 'POST';
            const token = localStorage.getItem('token');

            console.log(`[NEWS] ${method} to ${url}`);

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: formData
            });

            if (res.ok) {
                console.log("[NEWS] Success!");
                const token = localStorage.getItem('token');
                const updatedNews = await fetch('/api/news', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }).then(r => r.json());
                setNews(Array.isArray(updatedNews) ? updatedNews : []);
                
                alert(editingId ? "Modification enregistrée !" : "Article publié avec succès !");

                // Full Reset after alert
                setNewArticle({ title: '', content: '', description: '', image_url: '', category: 'Événement' });
                setEditingId(null);
                setGalleryFiles([]);
                setPreviews([]);
                setCoverPreview(null);
                if (coverRef.current) coverRef.current.value = '';
                if (photosRef.current) photosRef.current.value = '';
            } else {
                console.error("[NEWS] Server error", res.status);
                const errorData = await res.json().catch(() => ({}));
                alert("Erreur serveur: " + (errorData.message || "Réponse invalide."));
            }
        } catch (err) {
            console.error("[NEWS] Fetch error:", err);
            alert("Erreur de connexion : Impossible de joindre le serveur.");
        } finally {
            setIsPostingNews(false);
        }
    };

    const handleEditClick = (article: NewsArticle) => {
        setNewArticle({
            title: article.title,
            content: article.content,
            description: article.description || '',
            category: article.category,
            image_url: article.image_url
        });
        setEditingId(article.id);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteNews = async (id: number) => {
        if (!confirm('Supprimer cette actualité ?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/news/${id}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (res.ok) setNews(news.filter(n => n.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ nom: '', prenom: '', email: '', role: 'Secrétaire' });
    const [users, setUsers] = useState<UserAccount[]>(MOCK_USERS);

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        const id = `USR00${users.length + 1}`;
        const userToAdd: UserAccount = {
            id,
            nome: `${newUser.prenom} ${newUser.nom}`,
            email: newUser.email,
            role: newUser.role as any,
            status: 'Actif',
            lastLogin: 'Jamais',
            password: '12345',
            permissions: newUser.role === 'Secrétaire' ? ['Voir Inscriptions'] : (newUser.role === 'Comptable' ? ['Finances'] : ['Saisir Notes'])
        };
        setUsers([userToAdd, ...users]);
        setIsAddUserModalOpen(false);
        setNewUser({ nom: '', prenom: '', email: '', role: 'Secrétaire' });
    };

    const handleDeleteUser = (id: string) => {
        setUsers(users.filter(u => u.id !== id));
    };

    const handleResetPassword = (id: string) => {
        setUsers(users.map(u => u.id === id ? { ...u, password: '12345' } : u));
        alert('Mot de passe réinitialisé à: 12345');
    };

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return (
                    <div className="space-y-10">
                        {/* 1. État du Système - Compteurs */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Comptes Actifs', value: '1,452', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                                { label: 'Étudiants', value: '1,284', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
                                { label: 'Professeurs', value: '45', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                { label: 'Secrétaires', value: '12', icon: Briefcase, color: 'text-[#8178BB]', bg: 'bg-purple-50' }
                            ].map((stat, i) => (
                                <Card key={i} className="flex flex-col gap-4">
                                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                                        <h4 className="text-3xl font-black text-gray-800 mt-2">{stat.value}</h4>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Actions Rapides Sécurité */}
                            <Card title="Sécurité Immédiate" subtitle="Vigilance Système">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-6 bg-red-50 rounded-3xl border border-red-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white text-red-500 rounded-2xl flex items-center justify-center shadow-sm">
                                                <Hammer size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">Mode Maintenance</p>
                                                <p className="text-xs text-red-600/70 font-medium">Bloquer les accès utilisateurs</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setMaintenanceMode(!maintenanceMode)}
                                            className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${maintenanceMode ? 'bg-red-500 text-white' : 'bg-white text-red-500 border border-red-500'}`}
                                        >
                                            {maintenanceMode ? 'Désactiver' : 'Activer'}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-6 bg-[#F3F2F9] rounded-3xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white text-indigo-500 rounded-2xl flex items-center justify-center shadow-sm">
                                                <Cloud size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">Sauvegarde Base de Données</p>
                                                <p className="text-xs text-gray-500 font-medium">Dernière : Ce matin à 04:00</p>
                                            </div>
                                        </div>
                                        <button 
                                            disabled={isBackingUp}
                                            onClick={() => {
                                                setIsBackingUp(true);
                                                setTimeout(() => setIsBackingUp(false), 2000);
                                            }}
                                            className="bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 active:scale-95 transition-all flex items-center gap-2"
                                        >
                                            {isBackingUp ? 'En cours...' : 'Forcer Backup'}
                                        </button>
                                    </div>
                                </div>
                            </Card>

                            {/* Alerte Globale */}
                            <Card title="Communication Urgente" subtitle="Diffusion Instantanée">
                                <div className="space-y-6">
                                    <textarea 
                                        placeholder="Ex: L'université est fermée ce vendredi pour maintenance électrique..."
                                        className="w-full bg-[#F3F2F9] border-none rounded-3xl p-6 text-sm font-bold placeholder:text-gray-300 min-h-[120px] outline-none"
                                    ></textarea>
                                    <button className="w-full bg-[#8178BB] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-[#8178BB]/20 transition-all">
                                        <Megaphone size={18} />
                                        Envoyer Broadcast (Tout le site)
                                    </button>
                                </div>
                            </Card>
                        </div>
                    </div>
                );

            case 'users':
                return (
                    <div className="space-y-8">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-3xl font-black text-gray-800">Utilisateurs & Accès</h3>
                            </div>
                            <div className="flex gap-4">
                                <button className="bg-white text-gray-800 border border-gray-100 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50">
                                    <Key size={16} /> Gérer Rôles
                                </button>
                                <button 
                                    onClick={() => setIsAddUserModalOpen(true)}
                                    className="bg-[#8178BB] text-white px-10 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#8178BB]/20 hover:scale-105 transition-all"
                                >
                                    <UserPlus size={16} /> Nouveau Compte Staff
                                </button>
                            </div>
                        </div>

                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            <th className="p-6 text-left">Utilisateur</th>
                                            <th className="p-6 text-left">Rôle & Permissions</th>
                                            <th className="p-6 text-left">Dernier Accès</th>
                                            <th className="p-6 text-center">Statut</th>
                                            <th className="p-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {users.map(user => (
                                            <tr key={user.id} className="group hover:bg-[#F3F2F9]/50 transition-colors">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center font-black text-[#8178BB] shadow-sm">
                                                            {user.nome.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-800">{user.nome}</p>
                                                            <p className="text-[10px] font-bold text-gray-400">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className="text-xs font-black text-[#8178BB] uppercase tracking-widest">{user.role}</span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {user.permissions?.map((p, i) => (
                                                                <span key={i} className="text-[8px] font-bold px-1.5 py-0.5 bg-white border border-gray-100 rounded text-gray-500 uppercase">{p}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-xs font-bold text-gray-500">{user.lastLogin}</td>
                                                <td className="p-6 text-center"><StatusBadge status={user.status} /></td>
                                                <td className="p-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleResetPassword(user.id)}
                                                            title="Réinitialiser MDP" 
                                                            className="p-2.5 bg-white text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all border border-transparent hover:border-orange-100"
                                                        >
                                                            <Key size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            title="Retirer" 
                                                            className="p-2.5 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                                        >
                                                            <UserMinus size={16} />
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
                );

            case 'structure':
                return (
                    <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Navigation Structure Académique */}
                            <Card 
                                title={selectedFiliere ? `Filière: ${selectedFiliere.code}` : selectedDept ? `Département: ${selectedDept.nom}` : "Structure Académique"} 
                                subtitle={selectedFiliere ? selectedFiliere.nom : selectedDept ? "Gestion des filières" : "Facultés & Départements"} 
                                action={
                                    <div className="flex gap-2">
                                        {(selectedDept || selectedFiliere) && (
                                            <button onClick={() => selectedFiliere ? setSelectedFiliere(null) : setSelectedDept(null)} className="text-xs font-bold text-gray-400 hover:text-gray-800">Retour</button>
                                        )}
                                        {!selectedFiliere && (
                                            <Plus size={20} className="text-[#8178BB] cursor-pointer" onClick={selectedDept ? handleAddFiliere : handleAddDepartement} />
                                        )}
                                    </div>
                                }
                            >
                                <div className="space-y-4">
                                    {!selectedDept && (
                                        // VUE 1 : Liste des Départements
                                        departements.length === 0 ? (
                                            <p className="text-xs text-gray-400 italic">Aucun département configuré.</p>
                                        ) : departements.map((dept: any, i: number) => {
                                            const colors = ['border-blue-500', 'border-purple-500', 'border-emerald-500', 'border-orange-500'];
                                            const color = colors[i % colors.length];
                                            return (
                                                <div key={dept.id} onClick={() => setSelectedDept(dept)} className={`p-6 bg-white border-l-4 ${color} rounded-2xl shadow-sm hover:translate-x-2 transition-all cursor-pointer group`}>
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-bold text-gray-800">{dept.nom}</p>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-[10px] font-black bg-[#F3F2F9] px-3 py-1 rounded-full">
                                                                {dept.filieres ? dept.filieres.length : 0} Filières
                                                            </span>
                                                            <button onClick={(e) => handleDeleteDepartement(dept.id, e)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600">
                                                                <XCircle size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}

                                    {selectedDept && !selectedFiliere && (
                                        // VUE 2 : Liste des Filières du Département
                                        (!selectedDept.filieres || selectedDept.filieres.length === 0) ? (
                                            <p className="text-xs text-gray-400 italic">Aucune filière dans ce département.</p>
                                        ) : selectedDept.filieres.map((fil: any) => (
                                            <div key={fil.id} onClick={() => setSelectedFiliere(fil)} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                                                <div>
                                                    <p className="font-bold text-gray-800">{fil.nom}</p>
                                                    <p className="text-[10px] font-bold text-[#8178BB] uppercase tracking-widest">{fil.code}</p>
                                                </div>
                                                <button onClick={(e) => handleDeleteFiliere(fil.id, e)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600">
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        ))
                                    )}

                                    {selectedFiliere && (
                                        // VUE 3 : Maquette de la Filière
                                        <div className="space-y-6">
                                            {[1, 2, 3].map(annee => (
                                                <div key={annee} className="bg-[#F3F2F9] rounded-3xl p-6">
                                                    <h4 className="font-black text-gray-800 mb-4">Licence {annee}</h4>
                                                    <div className="grid grid-cols-1 gap-6">
                                                        {[annee * 2 - 1, annee * 2].map(semestre => (
                                                            <div key={semestre} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                                                <div 
                                                                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                                                    onClick={() => setExpandedSemester(expandedSemester === semestre ? null : semestre)}
                                                                >
                                                                    <p className="text-sm font-black uppercase text-[#8178BB] flex items-center gap-2">
                                                                        <ChevronRight className={`transition-transform ${expandedSemester === semestre ? 'rotate-90' : ''}`} size={16} />
                                                                        Semestre {semestre}
                                                                    </p>
                                                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                                                        {((selectedFiliere.matieres || []).filter((m:any) => m.semestre === semestre)).length} Matières
                                                                    </span>
                                                                </div>

                                                                <AnimatePresence>
                                                                    {expandedSemester === semestre && (
                                                                        <motion.div 
                                                                            initial={{ height: 0, opacity: 0 }} 
                                                                            animate={{ height: 'auto', opacity: 1 }} 
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            className="border-t border-gray-50 bg-gray-50/50"
                                                                        >
                                                                            <div className="p-4 space-y-4">
                                                                                <div className="flex justify-end">
                                                                                    <button onClick={() => handleAddMatiere(semestre)} className="text-[10px] font-black uppercase tracking-widest text-white bg-[#8178BB] px-4 py-2 rounded-xl shadow-sm hover:scale-105 transition-all flex items-center gap-2">
                                                                                        <Plus size={14} /> Ajouter une Matière
                                                                                    </button>
                                                                                </div>
                                                                                
                                                                                {(selectedFiliere.matieres || []).filter((m:any) => m.semestre === semestre).map((m:any) => (
                                                                                    <div key={m.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                                                                        <div className="flex justify-between items-start mb-4">
                                                                                            <div>
                                                                                                <div className="flex items-center gap-3">
                                                                                                    <span className="font-black text-[#8178BB] bg-[#8178BB]/10 px-2.5 py-1 rounded-lg text-xs tracking-widest">{m.code}</span>
                                                                                                    <span className="text-gray-400 font-bold text-xs">{m.credits} CRÉDITS</span>
                                                                                                </div>
                                                                                                <p className="text-lg font-black text-gray-800 mt-2">{m.nom}</p>
                                                                                            </div>
                                                                                            <button onClick={() => handleDeleteMatiere(m.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-all">
                                                                                                <XCircle size={18} />
                                                                                            </button>
                                                                                        </div>

                                                                                        <div className="pl-4 border-l-2 border-gray-100 space-y-2">
                                                                                            <div className="flex justify-between items-center mb-2">
                                                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Éléments Constitutifs (EC)</p>
                                                                                                <button onClick={() => handleAddEC(m.id)} className="text-[10px] text-[#8178BB] font-bold hover:underline">+ Ajouter EC</button>
                                                                                            </div>
                                                                                            
                                                                                            {(!m.elements_constitutifs || m.elements_constitutifs.length === 0) ? (
                                                                                                <p className="text-xs text-gray-400 italic">Aucun EC configuré.</p>
                                                                                            ) : (
                                                                                                <div className="flex flex-wrap gap-2">
                                                                                                    {m.elements_constitutifs.map((ec:any) => (
                                                                                                        <div key={ec.id} className="flex items-center gap-2 bg-[#F3F2F9] px-3 py-1.5 rounded-xl border border-gray-200 group">
                                                                                                            <span className="text-xs font-bold text-gray-600">{ec.nom}</span>
                                                                                                            <button onClick={() => handleDeleteEC(ec.id, m.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600">
                                                                                                                <XCircle size={12} />
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    ))}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Années et Salles */}
                            <div className="grid grid-cols-1 gap-6">
                                <Card title="Modification de Période" subtitle={editAnneeData.id === activeAnnee?.id ? "Période Actuelle" : "Édition en cours"}>
                                    {editAnneeData.id ? (
                                        <div className={`p-6 border rounded-3xl space-y-4 ${editAnneeData.id === activeAnnee?.id ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-gray-200'}`}>
                                            <div>
                                                <label className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest mb-1 block">Titre (affiché aux étudiants)</label>
                                                <input 
                                                    type="text" 
                                                    value={editAnneeData.nom} 
                                                    onChange={e => setEditAnneeData({...editAnneeData, nom: e.target.value})}
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#8178BB]"
                                                    placeholder="Ex: PROCHAINE RENTRÉE SCOLAIRE"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest mb-1 block">Date (Début ou Unique)</label>
                                                    <input 
                                                        type="date" 
                                                        value={editAnneeData.date_debut} 
                                                        onChange={e => setEditAnneeData({...editAnneeData, date_debut: e.target.value})}
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#8178BB]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest mb-1 block">Date de Fin (Optionnel)</label>
                                                    <input 
                                                        type="date" 
                                                        value={editAnneeData.date_fin} 
                                                        onChange={e => setEditAnneeData({...editAnneeData, date_fin: e.target.value})}
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#8178BB]"
                                                    />
                                                </div>
                                            </div>
                                            <button onClick={handleUpdateAnnee} className="w-full py-2 bg-[#8178BB] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#6A6299] transition-all">
                                                Enregistrer les modifications
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic mb-4">Sélectionnez une période à modifier.</p>
                                    )}
                                </Card>
                                <Card title="Toutes les Périodes" subtitle="Gérer vos événements">
                                    <div className="space-y-3">
                                        {annees.map((annee:any) => (
                                            <div key={annee.id} className={`flex items-center justify-between p-4 rounded-xl border ${annee.est_active ? 'border-[#8178BB] bg-blue-50/50' : 'border-gray-100 bg-white hover:border-gray-300'} transition-all`}>
                                                <div>
                                                    <p className={`font-bold text-sm ${annee.est_active ? 'text-[#8178BB]' : 'text-gray-700'}`}>
                                                        {annee.nom} {annee.est_active && " (Active)"}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                                        {annee.date_debut.split('T')[0]} {annee.date_fin && annee.date_fin !== annee.date_debut ? ` - ${annee.date_fin.split('T')[0]}` : ''}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    {!annee.est_active && (
                                                        <button 
                                                            onClick={() => handleActivateAnnee(annee.id)}
                                                            className="text-[10px] font-black uppercase text-gray-500 hover:text-green-500 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-green-500 transition-all text-center"
                                                        >
                                                            Activer
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => setEditAnneeData({
                                                            id: annee.id,
                                                            nom: annee.nom,
                                                            date_debut: annee.date_debut.split('T')[0],
                                                            date_fin: annee.date_fin ? annee.date_fin.split('T')[0] : ''
                                                        })}
                                                        className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border transition-all text-center ${editAnneeData.id === annee.id ? 'bg-[#8178BB] text-white border-[#8178BB]' : 'text-[#8178BB] border-[#8178BB]/30 hover:bg-[#8178BB] hover:text-white'}`}
                                                    >
                                                        Modifier
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={handleAddAnnee} className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-[#8178BB] hover:text-[#8178BB] transition-all">
                                        + Ajouter Période
                                    </button>
                                </Card>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-10">
                        {/* Audit Logs */}
                        <Card title="Logs d'Audit" subtitle="Historique complet des actions critiques">
                            <div className="space-y-4">
                                {MOCK_AUDIT.map(log => (
                                    <div key={log.id} className="flex items-center justify-between p-6 bg-white border border-gray-50 rounded-[24px] hover:border-[#8178BB]/20 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className={`p-3 rounded-2xl ${log.status === 'success' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                                                {log.status === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">
                                                    <span className="text-[#8178BB]">{log.user}</span> : {log.action}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                    Cible: {log.target}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-gray-400">{log.timestamp}</p>
                                            <StatusBadge status={log.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-4 bg-[#F3F2F9] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:bg-gray-100 transition-all">
                                Charger l'historique complet (.CSV)
                            </button>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <Card title="Backup Configuration" subtitle="Automatique & Planifié">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-bold text-gray-600">Féquence</p>
                                        <select className="bg-[#F3F2F9] border-none rounded-xl py-2 px-4 font-bold text-xs ring-0 outline-none">
                                            <option>Toutes les 6h</option>
                                            <option>Quotidien</option>
                                            <option>Hebdomadaire</option>
                                        </select>
                                    </div>
                                    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-4">
                                        <Cloud className="text-emerald-500" />
                                        <p className="text-xs font-bold text-emerald-800">Serveur Cloud Miroir : Connecté et Synchronisé</p>
                                    </div>
                                </div>
                            </Card>
                            <Card title="RGPD & Confidentialité" subtitle="Contrôle des données">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold">Anonymisation auto (Anciens dossiers)</p>
                                        <div className="w-10 h-5 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold">Logs de consultation Photos</p>
                                        <div className="w-10 h-5 bg-gray-200 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div></div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                );

            case 'settings':
                return (
                    <Card title="Paramètres Généraux" subtitle="Identité & Serveurs">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-10">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8178BB] mb-6">Serveurs de Communication</h4>
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500">Passerelle SMS (API Key)</label>
                                            <input type="password" value="************************" className="bg-[#F3F2F9] border-none rounded-xl p-4 text-sm font-bold" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase text-gray-500">Serveur SMTP (Email Notification)</label>
                                            <input type="text" placeholder="smtp.faucon.bj" className="bg-[#F3F2F9] border-none rounded-xl p-4 text-sm font-bold outline-none ring-2 ring-transparent focus:ring-[#8178BB]/20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-10">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8178BB] mb-6">Maintenance Système</h4>
                                    <div className="p-8 bg-orange-50 border border-orange-100 rounded-[32px] space-y-4">
                                        <div className="flex items-center gap-4 text-orange-600">
                                            <AlertTriangle size={24} />
                                            <p className="font-black text-xs uppercase tracking-widest">Zone Risquée</p>
                                        </div>
                                        <p className="text-xs text-orange-800/70 font-medium">Attention, ces actions affecteront TOUS les utilisateurs du système simultanément.</p>
                                        <div className="space-y-3 pt-4">
                                            <button className="w-full bg-white text-orange-600 border border-orange-200 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all">
                                                Nettoyer Cache Système
                                            </button>
                                            <button className="w-full bg-red-600 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                                                Réinitialiser Base de Données
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 pt-12 border-t border-gray-50 flex justify-end">
                            <button className="bg-[#8178BB] text-white px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-[#8178BB]/30 hover:scale-105 active:scale-95 transition-all">
                                <Save size={20} /> Enregistrer les Paramètres
                            </button>
                        </div>
                    </Card>
                );

            case 'communication':
                return (
                    <div className="space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Formulaire */}
                            <div className="lg:col-span-1">
                                <Card 
                                    title={editingId ? "Modifier l'Actualité" : "Nouvelle Actualité"} 
                                    subtitle={editingId ? "Modification de l'article #" + editingId : "Publier sur le site"}
                                >
                                    <form onSubmit={handlePostNews} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400">Titre</label>
                                            <input 
                                                required
                                                type="text" 
                                                value={newArticle.title}
                                                onChange={e => setNewArticle({...newArticle, title: e.target.value})}
                                                className="w-full bg-[#F3F2F9] border-none rounded-xl p-4 text-sm font-bold outline-none" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400">Catégorie</label>
                                            <select 
                                                value={newArticle.category}
                                                onChange={e => {
                                                    const cat = e.target.value;
                                                    let desc = newArticle.description;
                                                    // Auto-fill if empty or matches previous category default
                                                    const standardDescs: Record<string, string> = {
                                                        'Événement': "Rejoignez une communauté académique dynamique où l'innovation pédagogique rencontre les exigences du monde professionnel.",
                                                        'Académique': "Découvrez nos programmes d'excellence conçus pour former les leaders de demain dans un environnement d'apprentissage moderne.",
                                                        'Admission': "Un parcours académique rigoureux alliant théorie et pratique pour garantir une insertion professionnelle réussie.",
                                                        'Vie Étudiante': "L'École Supérieure Faucon vous offre un pôle éducatif d'excellence axé sur l'innovation et l'insertion professionnelle."
                                                    };
                                                    if (!desc || Object.values(standardDescs).includes(desc)) {
                                                        desc = standardDescs[cat] || "";
                                                    }
                                                    setNewArticle({...newArticle, category: cat, description: desc});
                                                }}
                                                className="w-full bg-[#F3F2F9] border-none rounded-xl p-4 text-sm font-bold outline-none"
                                            >
                                                <option>Événement</option>
                                                <option>Académique</option>
                                                <option>Admission</option>
                                                <option>Vie Étudiante</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400">Descriptif (Introduction courte)</label>
                                            <textarea 
                                                required
                                                value={newArticle.description}
                                                onChange={e => setNewArticle({...newArticle, description: e.target.value})}
                                                placeholder="Une courte introduction pour l'article..."
                                                className="w-full bg-[#F3F2F9] border-none rounded-xl p-4 text-xs font-bold outline-none min-h-[80px]"
                                            ></textarea>
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                {[
                                                    "L'École Supérieure Le Faucon vous offre un pôle éducatif d'excellence, axé sur la pratique, l'innovation et l'insertion professionnelle ciblée.",
                                                    "Découvrez nos programmes d'excellence conçus pour former les leaders de demain dans un environnement d'apprentissage moderne.",
                                                    "Rejoignez une communauté académique dynamique où l'innovation pédagogique rencontre les exigences du monde professionnel.",
                                                    "Un parcours académique rigoureux alliant théorie et pratique pour garantir une insertion professionnelle réussie dès la fin de vos études."
                                                ].map((text, idx) => (
                                                    <button 
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => setNewArticle({...newArticle, description: text})}
                                                        className="text-[9px] text-left p-2 bg-white border border-gray-100 rounded-lg hover:border-[#8178BB] hover:text-[#8178BB] transition-all line-clamp-2"
                                                        title={text}
                                                    >
                                                        Sug. {idx + 1}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-gray-400">Photo de Couverture (PC)</label>
                                                <div className="space-y-4">
                                                    <input 
                                                        type="file" 
                                                        ref={coverRef}
                                                        accept="image/*"
                                                        onChange={handleCoverChange}
                                                        className="w-full bg-[#F3F2F9] border-none rounded-xl p-3 text-xs font-bold outline-none" 
                                                    />
                                                    {coverPreview && (
                                                        <div className="relative w-full h-32 bg-gray-100 rounded-xl overflow-hidden border-2 border-[#8178BB]/20">
                                                            <img src={coverPreview} className="w-full h-full object-cover" alt="Cover Preview" />
                                                            <button 
                                                                type="button"
                                                                onClick={() => { setCoverPreview(null); if (coverRef.current) coverRef.current.value = ''; }}
                                                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                                                            >
                                                                <XCircle size={14} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                {editingId && !coverPreview && <p className="text-[9px] text-[#8178BB] font-bold italic">Laissez vide pour conserver l'image actuelle</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-gray-400">Photos de Galerie ({galleryFiles.length} sélectionnés)</label>
                                                <input 
                                                    type="file" 
                                                    ref={photosRef}
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    className="w-full bg-[#F3F2F9] border-none rounded-xl p-3 text-xs font-bold outline-none" 
                                                />
                                                {previews.length > 0 && (
                                                    <div className="grid grid-cols-4 gap-2 mt-2">
                                                        {previews.map((src, i) => (
                                                            <div key={i} className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 group">
                                                                <img src={src} className="w-full h-full object-cover" />
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => removeGalleryFile(i)}
                                                                    className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                                                >
                                                                    <XCircle size={12} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400">Contenu (Texte complet)</label>
                                            <textarea 
                                                required
                                                value={newArticle.content}
                                                onChange={e => setNewArticle({...newArticle, content: e.target.value})}
                                                placeholder="Écrivez votre texte ici..."
                                                className="w-full bg-[#F3F2F9] border-none rounded-xl p-4 text-sm font-bold outline-none min-h-[250px] leading-relaxed"
                                            ></textarea>
                                        </div>

                                        <div className="space-y-3">
                                            <button 
                                                type="submit"
                                                disabled={isPostingNews}
                                                className="w-full bg-[#8178BB] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all shadow-lg shadow-[#8178BB]/20"
                                            >
                                                {isPostingNews ? (editingId ? 'Mise à jour...' : 'Publication...') : (editingId ? 'Enregistrer les modifications' : 'Publier maintenant')}
                                            </button>
                                            {editingId && (
                                                <button 
                                                    type="button"
                                                    onClick={() => { setEditingId(null); setNewArticle({ title: '', content: '', image_url: '', category: 'Événement' }); }}
                                                    className="w-full bg-gray-100 text-gray-500 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                                                >
                                                    Annuler l'édition
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </Card>
                            </div>

                            {/* Liste des actualités */}
                            <div className="lg:col-span-2">
                                <Card title="Articles Publiés" subtitle="Gestion & Modération">
                                    <div className="space-y-6">
                                        {news.length === 0 && <p className="text-gray-400 italic text-sm text-center py-20">Aucun article publié pour le moment.</p>}
                                        {news.map(article => (
                                            <div key={article.id} className="group bg-white border border-gray-100 p-6 rounded-[32px] hover:shadow-2xl hover:shadow-[#8178BB]/5 hover:border-[#8178BB]/20 transition-all duration-500">
                                                <div className="flex flex-col md:flex-row gap-8">
                                                    <div className="relative shrink-0">
                                                        <img src={article.image_url || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=300&q=80'} className="w-full md:w-48 h-48 md:h-40 object-cover rounded-[24px] shadow-lg" alt="" />
                                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                                                            <span className="text-[9px] font-black text-[#8178BB] uppercase tracking-tighter">{article.category}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-extrabold text-xl text-gray-800 leading-tight group-hover:text-[#8178BB] transition-colors">{article.title}</h4>
                                                                <div className="flex gap-2">
                                                                    <button 
                                                                        onClick={() => handleEditClick(article)}
                                                                        className="w-10 h-10 bg-gray-50 text-gray-400 hover:text-[#8178BB] hover:bg-[#8178BB]/10 rounded-xl flex items-center justify-center transition-all shadow-sm"
                                                                        title="Modifier"
                                                                    >
                                                                        <Plus size={18} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteNews(article.id)}
                                                                        className="w-10 h-10 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl flex items-center justify-center transition-all shadow-sm"
                                                                        title="Supprimer"
                                                                    >
                                                                        <UserMinus size={18} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4 whitespace-pre-wrap break-all">{article.content}</p>
                                                        </div>
                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 bg-[#8178BB]/10 rounded-full flex items-center justify-center">
                                                                    <Calendar size={12} className="text-[#8178BB]" />
                                                                </div>
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(article.date_posted).toLocaleDateString()}</span>
                                                            </div>
                                                            <a href={`actualite-detail.html?id=${article.id}`} target="_blank" className="text-[10px] font-black text-[#8178BB] uppercase tracking-widest hover:underline flex items-center gap-1">
                                                                Voir sur le site <ChevronRight size={12} />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="h-screen bg-[#F3F2F9] flex font-sans tracking-tight text-[#2D2D2D] overflow-hidden">
            {/* Maintenance Overlay */}
            <AnimatePresence>
                {maintenanceMode && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-[#8178BB]/10 backdrop-blur-sm pointer-events-none border-8 border-red-500/20"
                    >
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3">
                            <Hammer size={16} /> Mode Maintenance Actif
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className="w-[240px] bg-gradient-to-b from-[#8178BB] to-[#7168A0] flex flex-col py-8 px-5 relative z-[101] shadow-[25px_0_80px_rgba(129,120,187,0.2)]">
                {/* Logo Section */}
                <div className="mb-12 px-4">
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-2xl font-black tracking-tighter leading-tight">
                            <span className="text-white">Fau</span><span className="text-[#1E293B]">con</span>
                        </span>
                    </div>
                    <div className="h-px w-full bg-white/10 mt-4" />
                </div>

                <nav className="flex-1 space-y-1.5">
                    <SidebarItem icon={Home} label="État du Système" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
                    <SidebarItem icon={Users} label="Utilisateurs & Accès" active={activePage === 'users'} onClick={() => setActivePage('users')} />
                    <SidebarItem icon={School} label="Structure Univ." active={activePage === 'structure'} onClick={() => setActivePage('structure')} />
                    <SidebarItem icon={Megaphone} label="Actualités & News" active={activePage === 'communication'} onClick={() => setActivePage('communication')} />
                    <SidebarItem icon={Lock} label="Sécurité & Audit" active={activePage === 'security'} onClick={() => setActivePage('security')} />
                    <SidebarItem icon={Settings} label="Paramètres Généraux" active={activePage === 'settings'} onClick={() => setActivePage('settings')} />
                </nav>

                <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
                    <div className="bg-white/5 p-4 rounded-2xl mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut Serveur</p>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        </div>
                        <p className="text-[10px] font-bold text-white/80">Opérationnel (99.9%)</p>
                    </div>
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
                <header className="h-24 bg-white border-b border-gray-100 flex items-center justify-between px-12 shrink-0 z-50">
                    <div className="flex items-center gap-8 flex-1 max-w-2xl">
                        <div className="relative group flex-1">
                            <input
                                type="text"
                                placeholder="Rechercher par UID, action, email ou logs..."
                                className="w-full bg-[#F3F2F9] border-none rounded-2xl py-3.5 px-6 pl-14 text-sm font-bold focus:ring-2 focus:ring-[#8178BB]/20 transition-all outline-none placeholder:text-gray-400"
                            />
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8178BB] transition-colors" size={18} />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 ml-8">

                        
                        <div className="flex gap-2">
                            <button className="p-4 bg-[#F3F2F9] rounded-2xl text-gray-400 hover:text-[#8178BB] transition-all relative border border-gray-50">
                                <Bell size={20} />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                    3
                                </span>
                            </button>
                        </div>

                        <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
                            <div className="text-right">
                                <p className="text-sm font-black text-gray-800 leading-tight">Administrateur</p>
                                <p className="text-[10px] font-black text-[#8178BB] uppercase tracking-[0.2em] mt-0.5">Super Admin</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 text-xs font-black border-2 border-white">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-12 bg-[#F3F2F9]/50">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePage}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="max-w-7xl mx-auto"
                        >
                            {activePage !== 'users' && (
                                <div className="mb-12">
                                    <h2 className="text-sm font-black text-[#8178BB] uppercase tracking-[0.4em] mb-2">Navigation Centrale</h2>
                                    <h3 className="text-4xl font-black text-slate-800 tracking-tighter">
                                        {activePage === 'dashboard' && "Vue d'ensemble du Système"}
                                        {activePage === 'structure' && "Architecture Universitaire"}
                                        {activePage === 'security' && "Surveillance & Audit"}
                                        {activePage === 'settings' && "Paramètres de la Plateforme"}
                                    </h3>
                                </div>
                            )}
                            {renderPage()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Add User Modal */}
            <AnimatePresence>
                {isAddUserModalOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddUserModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
                        >
                            <div className="p-10">
                                <h3 className="text-2xl font-black text-gray-800 mb-2">Nouveau Compte Staff</h3>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Création d'identifiants de connexion</p>
                                
                                <form onSubmit={handleAddUser} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Prénom</label>
                                            <input 
                                                required
                                                type="text" 
                                                value={newUser.prenom}
                                                onChange={e => setNewUser({...newUser, prenom: e.target.value})}
                                                placeholder="Jean"
                                                className="w-full bg-[#F3F2F9] border-none rounded-2xl p-4 text-sm font-bold outline-none ring-2 ring-transparent focus:ring-[#8178BB]/20 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nom</label>
                                            <input 
                                                required
                                                type="text" 
                                                value={newUser.nom}
                                                onChange={e => setNewUser({...newUser, nom: e.target.value})}
                                                placeholder="Dupont"
                                                className="w-full bg-[#F3F2F9] border-none rounded-2xl p-4 text-sm font-bold outline-none ring-2 ring-transparent focus:ring-[#8178BB]/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Adresse Email</label>
                                        <input 
                                            required
                                            type="email" 
                                            value={newUser.email}
                                            onChange={e => setNewUser({...newUser, email: e.target.value})}
                                            placeholder="j.dupont@faucon.bj"
                                            className="w-full bg-[#F3F2F9] border-none rounded-2xl p-4 text-sm font-bold outline-none ring-2 ring-transparent focus:ring-[#8178BB]/20 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Rôle assigné</label>
                                        <select 
                                            value={newUser.role}
                                            onChange={e => setNewUser({...newUser, role: e.target.value as any})}
                                            className="w-full bg-[#F3F2F9] border-none rounded-2xl p-4 text-sm font-bold outline-none ring-2 ring-transparent focus:ring-[#8178BB]/20 transition-all cursor-pointer"
                                        >
                                            <option value="Secrétaire">Secrétaire</option>
                                            <option value="Professeur">Professeur</option>
                                            <option value="Comptable">Comptable</option>
                                            <option value="Admin">Administrateur</option>
                                        </select>
                                    </div>

                                    <div className="pt-4 flex gap-4">
                                        <button 
                                            type="button"
                                            onClick={() => setIsAddUserModalOpen(false)}
                                            className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:bg-gray-50 transition-all"
                                        >
                                            Annuler
                                        </button>
                                        <button 
                                            type="submit"
                                            className="flex-3 bg-[#8178BB] text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#8178BB]/20 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            Créer le compte
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-center font-bold text-gray-400 mt-4 italic">
                                        * Un mot de passe provisoire sera envoyé à l'adresse email indiquée.
                                    </p>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
