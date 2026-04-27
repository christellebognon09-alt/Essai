import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  LogOut,
  Bell,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  ChevronRight,
  ChevronLeft,
  User,
  GraduationCap,
  Banknote,
  Info,
  Files,
  ClipboardCheck,
  CreditCard,
  Users,
  Calendar,
  Layout,
  Download,
  MoreVertical,
  Search,
  Mail,
  Settings,
  MessageSquare,
  Clock,
  ClipboardList,
  ChevronDown,
  PlusCircle,
  Filter,
  Plus,
  MapPin,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Theme Colors ---
const colors = {
  primary: '#8178B1',
  primaryLight: '#F0EEF9',
  accentPink: '#FBCFE8',
  accentTeal: '#99F6E4',
  text: '#2D2D2D',
  textMuted: '#6B7280',
  bg: '#FFFFFF',
  bgSoft: '#F9FAFB',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

// Global styles for Inter font and letter spacing
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  :root {
    font-family: 'Inter', sans-serif !important;
    letter-spacing: -0.01em;
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    letter-spacing: -0.02em;
  }

  button, input, select, textarea {
    font-family: inherit;
  }
`;

// --- Types ---
type Page = 'inscription' | 'documents' | 'statut' | 'paiement' | 'resume' | 'succes' | 'dashboard';

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  jour: string;
  mois: string;
  annee: string;
  paysNaissance: string;
  nationalite: string;
  adresse: string;
  filiere: string;
  niveau: string;
  // Parent info
  nomPere: string;
  prenomPere: string;
  emailPere: string;
  telephonePere: string;
  autreInfoPere: string;
  nomMere: string;
  prenomMere: string;
  emailMere: string;
  telephoneMere: string;
  autreInfoMere: string;
  genre: string;
}

interface DocumentState {
  acteNaissance: File | null;
  photoIdentite: File | null;
  attestationBac: File | null;
  bulletinsNotes: File | null;
}

// --- Components ---

const AutocompleteInput = ({ label, value, onChange, onBlur, placeholder, options, error = false }: { label: string, value: string, onChange: (val: string) => void, onBlur?: () => void, placeholder?: string, options: string[], error?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = React.useState(value);

  React.useEffect(() => { setSearchTerm(value); }, [value]);

  const filteredOptions = options.filter(o => o.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <div className="flex flex-col gap-1.5 relative w-full">
      {label && <label className="text-xs font-semibold text-gray-700">{label}</label>}
      <input
        value={searchTerm}
        onChange={(e) => {
          const val = e.target.value;
          setSearchTerm(val);
          setIsOpen(true);
          onChange(val);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          if (onBlur) onBlur();
          setTimeout(() => {
            setIsOpen(false);
          }, 200);
        }}
        placeholder={placeholder}
        className={`bg-white border rounded-md px-4 py-3 text-sm outline-none transition-all w-full ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#8178B1] focus:ring-1 focus:ring-[#8178B1]'}`}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-md max-h-48 overflow-y-auto z-50 py-1">
          {filteredOptions.map((opt, i) => (
            <li
              key={i}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(opt);
                setSearchTerm(opt);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm transition-colors text-gray-700"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SidebarItem = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-8 py-4 transition-all duration-300 relative group ${active ? 'text-[#8178B1]' : 'text-gray-400 hover:text-[#8178B1]'}`}
  >
    {active && (
      <motion.div
        layoutId="activeNav"
        className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#8178B1] rounded-r-full"
      />
    )}
    <span className={`font-bold text-sm tracking-wide ${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
  </button>
);

const InputField = ({ label, value, onChange, onBlur, placeholder, type = "text", error = false }: { label: string, value: string, onChange: (val: string) => void, onBlur?: () => void, placeholder?: string, type?: string, error?: boolean }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-xs font-semibold text-gray-700">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      autoComplete="off"
      className={`bg-white border rounded-md px-4 py-3 text-sm outline-none transition-all w-full ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#8178B1] focus:ring-1 focus:ring-[#8178B1]'}`}
    />
  </div>
);

const FileUpload = ({ label, file, onFileChange, error = false }: { label: string, file: File | null, onFileChange: (f: File | null) => void, error?: boolean }) => (
  <div className={`bg-white border-2 border-dashed p-6 rounded-3xl flex flex-col items-center text-center gap-3 hover:border-[#8178B1]/50 transition-colors group relative ${(error && !file) ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${file ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 group-hover:bg-[#8178B1]/10 group-hover:text-[#8178B1]'}`}>
      {file ? <CheckCircle2 size={24} /> : <Upload size={24} />}
    </div>
    <div>
      <p className="font-bold text-sm text-gray-700">{label}</p>
      <p className="text-[10px] text-gray-400 mt-1">{file ? file.name : 'Format PDF, JPG ou PNG'}</p>
    </div>
    <input
      type="file"
      className="absolute inset-0 opacity-0 cursor-pointer"
      onChange={(e) => onFileChange(e.target.files?.[0] || null)}
    />
    {file && (
      <button
        onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
        className="text-[10px] font-bold text-red-500 uppercase hover:underline z-10"
      >
        Supprimer
      </button>
    )}
  </div>
);

// --- Helper for Enter to Tab behavior ---
const handleEnterToTab = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    const target = e.target as HTMLElement;
    // Don't prevent default for buttons as we want Enter to trigger them
    if (target.tagName === 'BUTTON' || target.tagName === 'A') return;

    e.preventDefault();
    const focusableSelector = 'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const elements = Array.from(document.querySelectorAll(focusableSelector)).filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });

    const index = elements.indexOf(target);
    if (index > -1 && index < elements.length - 1) {
      (elements[index + 1] as HTMLElement).focus();
    }
  }
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const saved = localStorage.getItem('faucon_current_page') as Page;
    const submitted = localStorage.getItem('faucon_submitted') === 'true';
    if (submitted && (saved === 'inscription' || saved === 'resume' || !saved)) return 'succes';
    return saved || 'inscription';
  });
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem('faucon_form_data');
    return saved ? JSON.parse(saved) : {
      nom: '', prenom: '', email: '', telephone: '', genre: '', jour: '', mois: '', annee: '', paysNaissance: '', nationalite: '', adresse: '',
      filiere: '', niveau: '',
      nomPere: '', prenomPere: '', emailPere: '', telephonePere: '', autreInfoPere: '',
      nomMere: '', prenomMere: '', emailMere: '', telephoneMere: '', autreInfoMere: ''
    };
  });
  const [docs, setDocs] = useState<DocumentState>({
    acteNaissance: null, photoIdentite: null, attestationBac: null, bulletinsNotes: null
  });
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isPaymentValidated, setIsPaymentValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(() => localStorage.getItem('faucon_submitted') === 'true');
  const [dashboardTab, setDashboardTab] = useState('Tableau de bord');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState('Paiement de Tranche 2');
  const [financeStatus, setFinanceStatus] = useState<'idle' | 'pending' | 'validated'>('idle');
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);

  const [showErrors, setShowErrors] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [formError, setFormError] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(() => {
    const saved = localStorage.getItem('faucon_form_step');
    return saved ? parseInt(saved) : 1;
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [statusStep, setStatusStep] = useState(() => {
    const saved = localStorage.getItem('faucon_status_step');
    return saved ? parseInt(saved) : 1;
  });
  const [isRejected, setIsRejected] = useState(false);
  const [rejectedFields, setRejectedFields] = useState<Set<string>>(new Set());
  const [rejectionMessage, setRejectionMessage] = useState("Certains documents sont illisibles. Veuillez renvoyer une copie claire de votre acte de naissance.");
  const [isReceiptAccepted, setIsReceiptAccepted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inputEmail, setInputEmail] = useState('');
  const [inputMatricule, setInputMatricule] = useState('');
  const [activeAnnee, setActiveAnnee] = useState<any>(null);
  const [filieres, setFilieres] = useState<any[]>([]);
  const [financeData, setFinanceData] = useState<any>({ configs: [], extra_frais: [], tariffs: [] });

  const userFiliere = useMemo(() => {
    if (!filieres.length) return null;
    if (currentUser?.filiere_id) {
        return filieres.find(f => f.id === currentUser.filiere_id) || null;
    }
    return filieres.find(f => f.nom === (currentUser?.filiere || formData.filiere)) || filieres[0] || null;
  }, [filieres, currentUser, formData.filiere]);

  const userFinanceConfig = useMemo(() => {
    return (financeData.configs || []).find((c: any) => c.filiere_id === userFiliere?.id);
  }, [financeData.configs, userFiliere]);

  const scolariteStats = useMemo(() => {
    if (!userFinanceConfig) return { total: 0, paid: 0, percent: 0, rest: 0 };
    
    const extraTotal = (financeData.extra_frais || [])
      .filter((e: any) => e.filiere_id === userFiliere?.id)
      .reduce((acc: number, curr: any) => acc + curr.amount, 0);

    const total = userFinanceConfig.inscription + userFinanceConfig.tranche1 + userFinanceConfig.tranche2 + userFinanceConfig.tranche3 + userFinanceConfig.frais_stage + userFinanceConfig.frais_dossier + extraTotal;
    
    // Logic for totalPaid based on status_step (simplified for now)
    let paid = 0;
    if (statusStep >= 5) paid = userFinanceConfig.inscription; 
    if (statusStep >= 6) paid = total; 
    
    const percent = total > 0 ? Math.round((paid / total) * 100) : 0;
    return { total, paid, percent, rest: total - paid };
  }, [userFinanceConfig, financeData.extra_frais, statusStep]);

  // --- Auth Check ---
  const fetchUserData = () => {
    const token = localStorage.getItem('token');
    fetch('/api/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) { // Laravel returns the user object directly if authenticated
          const user = data;
          const lastUserEmail = localStorage.getItem('faucon_auth_email');
          if (lastUserEmail !== user.email) {
            // User changed or first login after update: Clear old local storage
            console.log("Session reset detected. Clearing local storage.");
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith('faucon_')) {
                keysToRemove.push(key);
              }
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));
            
            // Reset local states
            setFormStep(1);
            setCurrentPage('inscription');
            setFormData({
              nom: user.lastname || '',
              prenom: user.firstname || '',
              email: user.email || '',
              telephone: '', genre: '', jour: '', mois: '', annee: '', paysNaissance: '', nationalite: '', adresse: '',
              filiere: '', niveau: '',
              nomPere: '', prenomPere: '', emailPere: '', telephonePere: '', autreInfoPere: '',
              nomMere: '', prenomMere: '', emailMere: '', telephoneMere: '', autreInfoMere: ''
            });
            setIsSubmitted(false);
          }
          
          localStorage.setItem('faucon_auth_email', user.email);
          setCurrentUser(user);

          // Always populate formData from backend to sync state
          const birthParts = (user.birth_date || "").split(" ");
          setFormData(prev => ({
            ...prev,
            nom: user.lastname || prev.nom,
            prenom: user.firstname || prev.prenom,
            email: user.email || prev.email,
            telephone: user.phone || prev.telephone,
            genre: user.gender || prev.genre,
            jour: birthParts[0] || prev.jour,
            mois: birthParts[1] || prev.mois,
            annee: birthParts[2] || prev.annee,
            paysNaissance: user.birth_country || prev.paysNaissance,
            nationalite: user.nationality || prev.nationalite,
            adresse: user.address || prev.adresse,
            filiere: user.filiere || prev.filiere,
            niveau: user.level || prev.niveau,
            nomPere: user.parent_father_name || prev.nomPere,
            prenomPere: user.parent_father_firstname || prev.prenomPere,
            emailPere: user.parent_father_email || prev.emailPere,
            telephonePere: user.parent_father_phone || prev.telephonePere,
            autreInfoPere: user.parent_father_job || prev.autreInfoPere,
            nomMere: user.parent_mother_name || prev.nomMere,
            prenomMere: user.parent_mother_firstname || prev.prenomMere,
            emailMere: user.parent_mother_email || prev.emailMere,
            telephoneMere: user.parent_mother_phone || prev.telephoneMere,
            autreInfoMere: user.parent_mother_job || prev.autreInfoMere,
          }));

          if (user.registration_complete) {
            setIsSubmitted(true);
            const step = user.status_step || 1;
            setStatusStep(step);
            setIsRejected(!!user.is_rejected);
            if (user.admin_notes) setRejectionMessage(user.admin_notes);
            
            if (step === 5) {
              setCurrentPage('dashboard');
            } else {
              setCurrentPage('succes');
            }
          } else {
            setIsSubmitted(false);
            // Force inscription step 1 if no saved progress or if we just cleared it
            if (!localStorage.getItem('faucon_form_step')) {
              setFormStep(1);
            }
            if (currentPage === 'succes' || currentPage === 'dashboard' || !localStorage.getItem('faucon_current_page')) {
              setCurrentPage('inscription');
            }
          }
        } else {
          window.location.href = 'login.html';
        }
      })
      .catch(err => console.error('Auth error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUserData();

    // Fetch active academic year
    fetch('/api/academique/annees', { headers: { 'Accept': 'application/json' } })
      .then(res => res.json())
      .then(data => {
        const anneesArray = Array.isArray(data) ? data : [];
        const active = anneesArray.find((a: any) => a.est_active) || anneesArray[0] || null;
        setActiveAnnee(active);
      })
      .catch(err => console.error('Error fetching annees:', err));
    
    // Fetch filieres
    fetch('/api/academique/filieres', { headers: { 'Accept': 'application/json' } })
      .then(res => res.json())
      .then(data => setFilieres(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching filieres:', err));

    // Fetch finance configs
    fetch('/api/finances/configs', { headers: { 'Accept': 'application/json' } })
      .then(res => res.json())
      .then(data => setFinanceData(data))
      .catch(err => console.error('Error fetching finance configs:', err));
    
    // Refresh every 10s only if we are in the "Succes" flow (waiting for validation/matricule/payment)
    const interval = setInterval(() => {
      if (currentPage === 'succes' && statusStep < 5) {
        fetchUserData();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [currentPage, statusStep]);

  const updateStatusStep = (newStep: number) => {
    const token = localStorage.getItem('token');
    setStatusStep(newStep);
    fetch('/api/update-status-step', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ step: newStep })
    }).catch(err => console.error('Failed to update status step:', err));
  };

  const handleSubmitReceipt = async () => {
    if (!receipt) return;
    const formDataObj = new FormData();
    formDataObj.append('receipt', receipt);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/submit-receipt', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formDataObj
      });
      if (res.ok) {
        setStatusStep(4);
        fetchUserData(); // Get the new receipt_url
      } else {
        alert("Erreur lors de l'envoi du reçu");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    }
  };

  // Pre-fill form from currentUser
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        nom: prev.nom || currentUser.lastname || '',
        prenom: prev.prenom || currentUser.firstname || '',
        email: prev.email || currentUser.email || ''
      }));
    }
  }, [currentUser]);

  // --- Persistence & Blocking Logic ---
  useEffect(() => {
    localStorage.setItem('faucon_form_data', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('faucon_submitted', isSubmitted.toString());
    // Robust blocking: if submitted, push to succes if on registration pages
    if (isSubmitted && (currentPage === 'inscription' || currentPage === 'resume')) {
      setCurrentPage('succes');
    }
  }, [isSubmitted, currentPage]);

  useEffect(() => {
    if (window.location.pathname.includes('dashboard.html') || window.location.pathname.includes('/dashboard')) {
      setCurrentPage('dashboard');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('faucon_selected_payment', selectedPaymentType);
  }, [selectedPaymentType]);

  useEffect(() => {
    localStorage.setItem('faucon_finance_status', financeStatus);
  }, [financeStatus]);

  useEffect(() => {
    localStorage.setItem('faucon_status_step', statusStep.toString());
  }, [statusStep]);

  useEffect(() => {
    localStorage.setItem('faucon_current_page', currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('faucon_form_step', formStep.toString());
  }, [formStep]);

  // --- Solution B: Browser Back/Forward Logic ---
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        // If submitted, block returning to form steps
        if (isSubmitted && (event.state.page === 'inscription' || event.state.page === 'resume')) {
          window.history.pushState({ page: currentPage, step: statusStep }, '');
          return;
        }

        isNavigatingRef.current = true;
        setCurrentPage(event.state.page);
        if (event.state.page === 'inscription') {
          setFormStep(event.state.step);
        } else if (event.state.page === 'succes') {
          setStatusStep(event.state.step);
        }
        setTimeout(() => { isNavigatingRef.current = false; }, 0);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isSubmitted, currentPage, statusStep]);

  useEffect(() => {
    if (isNavigatingRef.current) return;

    const state = window.history.state;
    const currentStepValue = currentPage === 'inscription' ? formStep : statusStep;

    if (!state || state.page !== currentPage || state.step !== currentStepValue) {
      window.history.pushState({ page: currentPage, step: currentStepValue }, '');
    }
  }, [currentPage, formStep, statusStep]);

  const isValidEmail = (email: string) => email.includes('@');
  const isValidPhone = (phone: string) => {
    const digits = phone.replace(/[^\d]/g, '');
    return digits.length >= 8; // At least 8 digits as requested
  };

  // --- Derived State ---
  const missingFieldsStep1 = useMemo(() => {
    const fields = [];
    if (!formData.nom) fields.push('nom');
    if (!formData.prenom) fields.push('prenom');
    if (!formData.email || !isValidEmail(formData.email)) fields.push('email');
    if (!formData.telephone || !isValidPhone(formData.telephone)) fields.push('telephone');
    if (!formData.genre) fields.push('genre');
    if (!formData.jour) fields.push('jour');
    if (!formData.mois) fields.push('mois');
    if (!formData.annee) fields.push('annee');
    if (!formData.paysNaissance) fields.push('paysNaissance');
    if (!formData.nationalite) fields.push('nationalite');
    if (!formData.adresse) fields.push('adresse');
    return fields;
  }, [formData]);

  const missingFieldsStep2 = useMemo(() => {
    const fields = [];
    if (!formData.nomPere) fields.push('nomPere');
    if (!formData.prenomPere) fields.push('prenomPere');
    if (!formData.autreInfoPere) fields.push('autreInfoPere');
    if (!formData.nomMere) fields.push('nomMere');
    if (!formData.prenomMere) fields.push('prenomMere');
    if (!formData.autreInfoMere) fields.push('autreInfoMere');
    return fields;
  }, [formData]);

  const missingFieldsStep3 = useMemo(() => {
    const fields = [];
    if (!formData.filiere) fields.push('filiere');
    if (!formData.niveau) fields.push('niveau');
    return fields;
  }, [formData]);

  const missingFields = useMemo(() => {
    return [...missingFieldsStep1, ...missingFieldsStep2, ...missingFieldsStep3];
  }, [missingFieldsStep1, missingFieldsStep2, missingFieldsStep3]);

  const missingInfo = missingFields.length > 0;

  const missingDocs = useMemo(() => {
    const d = [];
    if (!docs.acteNaissance) d.push('Acte de naissance');
    if (!docs.photoIdentite) d.push('Photo d\'identité');
    if (!docs.attestationBac) d.push('Attestation du Bac');
    if (!docs.bulletinsNotes) d.push('Bulletins de notes');
    return d;
  }, [docs]);

  const isComplete = missingFields.length === 0 && missingDocs.length === 0;

  // --- Handlers ---
  const handleSave = () => {
    setShowErrors(true);
    if (missingInfo) {
      setFormError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('firstname', formData.prenom);
    formDataToSend.append('lastname', formData.nom);
    formDataToSend.append('phone', formData.telephone);
    formDataToSend.append('genre', formData.genre);
    formDataToSend.append('birth_date', `${formData.jour} ${formData.mois} ${formData.annee}`);
    formDataToSend.append('birth_country', formData.paysNaissance);
    formDataToSend.append('nationality', formData.nationalite);
    formDataToSend.append('address', formData.adresse);
    formDataToSend.append('filiere', formData.filiere);
    formDataToSend.append('level', formData.niveau);
    
    // Parents
    formDataToSend.append('nomPere', formData.nomPere);
    formDataToSend.append('prenomPere', formData.prenomPere);
    formDataToSend.append('emailPere', formData.emailPere);
    formDataToSend.append('telephonePere', formData.telephonePere);
    formDataToSend.append('autreInfoPere', formData.autreInfoPere);
    formDataToSend.append('nomMere', formData.nomMere);
    formDataToSend.append('prenomMere', formData.prenomMere);
    formDataToSend.append('emailMere', formData.emailMere);
    formDataToSend.append('telephoneMere', formData.telephoneMere);
    formDataToSend.append('autreInfoMere', formData.autreInfoMere);

    // Docs
    if (docs.acteNaissance) formDataToSend.append('acteNaissance', docs.acteNaissance);
    if (docs.photoIdentite) formDataToSend.append('photoIdentite', docs.photoIdentite);
    if (docs.attestationBac) formDataToSend.append('attestationBac', docs.attestationBac);
    if (docs.bulletinsNotes) formDataToSend.append('bulletinsNotes', docs.bulletinsNotes);

    const token = localStorage.getItem('token');
    fetch('/api/update-profile', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: formDataToSend
      // No Content-Type header needed, browser will set it to multipart/form-data with boundary
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) {
        // Log precise error if available
        const errorMsg = data.message || data.error || JSON.stringify(data.errors) || "Erreur serveur";
        throw new Error(errorMsg);
      }
      return data;
    })
    .then(data => {
      // Re-fetch user to get updated info and registration_complete status
      fetch('/api/me', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      })
        .then(res => res.json())
        .then(userData => {
          if (userData.id) {
            setCurrentUser(userData);
            setIsSubmitted(true);
            setStatusStep(1);
            setCurrentPage('succes');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
    })
    .catch(err => {
      console.error("Save error:", err);
      setFormError("Erreur lors de l'enregistrement du profil: " + err.message);
      alert("Une erreur est survenue lors de la soumission. Veuillez vérifier les messages d'erreur.");
    });
  };

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    fetch('/api/logout', { 
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(() => {
        localStorage.clear();
        window.location.href = 'login.html';
      })
      .catch(err => console.error('Logout error:', err));
  };

  const markTouched = (field: string) => {
    setTouchedFields(prev => new Set(prev).add(field));
  };

  const updateField = (field: keyof FormData, value: string) => {
    markTouched(field);
    if (field === 'telephone' || field === 'telephonePere' || field === 'telephoneMere') {
      // Allow adding/deleting freely but filter to allow digits, spaces, and +
      const filtered = value.replace(/[^\d\s+]/g, '');
      setFormData(prev => ({ ...prev, [field]: filtered }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const updateDoc = (field: keyof DocumentState, file: File | null) => {
    setDocs(prev => ({ ...prev, [field]: file }));
  };

  // --- Render Helpers ---
  const renderPage = () => {
    switch (currentPage) {
      case 'inscription':
        return (
          <div className="w-full flex gap-8" onKeyDown={handleEnterToTab}>
            {/* Form Column */}
            <div className="flex-1 flex flex-col">
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-2xl font-medium text-gray-600">Veuillez renseigner vos informations</h2>
                  <span className="text-sm font-bold text-[#8178B1]">Étape {formStep} sur 3</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(formStep / 3) * 100}%` }}
                    className="h-full bg-[#8178B1]"
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {formStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Bloc 1: État Civil */}
                      <section className="bg-gray-100 p-6 md:p-8 border border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                          État Civil
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Nom"
                            value={formData.nom}
                            onChange={(v) => updateField('nom', v)}
                            onBlur={() => markTouched('nom')}
                            placeholder=""
                            error={((touchedFields.has('nom') || showErrors) && missingFieldsStep1.includes('nom')) || rejectedFields.has('nom')}
                          />
                          <InputField
                            label="Prénom(s)"
                            value={formData.prenom}
                            onChange={(v) => updateField('prenom', v)}
                            onBlur={() => markTouched('prenom')}
                            placeholder=""
                            error={((touchedFields.has('prenom') || showErrors) && missingFieldsStep1.includes('prenom')) || rejectedFields.has('prenom')}
                          />

                          <InputField
                            label="Téléphone"
                            value={formData.telephone}
                            onChange={(v) => updateField('telephone', v)}
                            onBlur={() => markTouched('telephone')}
                            type="tel"
                            placeholder=""
                            error={(touchedFields.has('telephone') || showErrors) && formData.telephone.length > 0 && !isValidPhone(formData.telephone)}
                          />
                          <InputField
                            label="Email"
                            value={formData.email}
                            onChange={(v) => updateField('email', v)}
                            onBlur={() => markTouched('email')}
                            type="email"
                            placeholder=""
                            error={(touchedFields.has('email') || showErrors) && !formData.email.includes('@')}
                          />

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-700">Sexe</label>
                            <div className={`flex gap-2 p-1 rounded-lg ${((touchedFields.has('genre') || showErrors) && !formData.genre) ? 'bg-red-50 ring-1 ring-red-200' : ''}`}>
                              {['Masculin', 'Féminin'].map(g => (
                                <button
                                  key={g}
                                  onClick={() => updateField('genre', g)}
                                  className={`flex-1 py-3 rounded-md text-sm transition-all border ${formData.genre === g ? 'bg-[#8178B1] text-white border-[#8178B1]' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                >
                                  {g}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-700">Date de naissance</label>
                            <div className="grid grid-cols-3 gap-3">
                              <InputField
                                label=""
                                value={formData.jour}
                                onChange={(v) => updateField('jour', v)}
                                onBlur={() => markTouched('jour')}
                                placeholder="Jour"
                                error={(touchedFields.has('jour') || showErrors) && missingFieldsStep1.includes('jour')}
                              />
                              <AutocompleteInput
                                label=""
                                value={formData.mois}
                                onChange={(v) => updateField('mois', v)}
                                onBlur={() => markTouched('mois')}
                                placeholder="Mois"
                                options={['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']}
                                error={(touchedFields.has('mois') || showErrors) && missingFieldsStep1.includes('mois')}
                              />
                              <InputField
                                label=""
                                value={formData.annee}
                                onChange={(v) => updateField('annee', v)}
                                onBlur={() => markTouched('annee')}
                                placeholder="Année"
                                error={(touchedFields.has('annee') || showErrors) && missingFieldsStep1.includes('annee')}
                              />
                            </div>
                          </div>
                          <AutocompleteInput
                            label="Pays de naissance"
                            value={formData.paysNaissance}
                            onChange={(v) => updateField('paysNaissance', v)}
                            onBlur={() => markTouched('paysNaissance')}
                            options={['Bénin', 'Burkina Faso', 'Côte d\'Ivoire', 'Niger', 'Togo']}
                            error={(touchedFields.has('paysNaissance') || showErrors) && missingFieldsStep1.includes('paysNaissance')}
                          />
                          <AutocompleteInput
                            label="Nationalité"
                            value={formData.nationalite}
                            onChange={(v) => updateField('nationalite', v)}
                            onBlur={() => markTouched('nationalite')}
                            options={['Béninoise', 'Burkinabé', 'Ivoirienne', 'Nigérienne', 'Togolaise']}
                            error={(touchedFields.has('nationalite') || showErrors) && missingFieldsStep1.includes('nationalite')}
                          />

                          <div className="md:col-span-2">
                            <InputField
                              label="Adresse physique"
                              value={formData.adresse}
                              onChange={(v) => updateField('adresse', v)}
                              onBlur={() => markTouched('adresse')}
                              error={(touchedFields.has('adresse') || showErrors) && missingFieldsStep1.includes('adresse')}
                            />
                          </div>
                        </div>
                      </section>
                    </motion.div>
                  )}

                  {formStep === 2 && (
                    <motion.div
                      key="step1p"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Bloc: Informations sur le père */}
                      <section className="bg-gray-100 p-6 md:p-8 border border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-800 mb-6 flex items-center gap-2">
                          <Users size={18} className="text-[#8178B1]" />
                          Informations sur le père
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Nom du père"
                            value={formData.nomPere}
                            onChange={(v) => updateField('nomPere', v)}
                            onBlur={() => markTouched('nomPere')}
                            error={(touchedFields.has('nomPere') || showErrors) && missingFieldsStep2.includes('nomPere')}
                          />
                          <InputField
                            label="Prénom(s) du père"
                            value={formData.prenomPere}
                            onChange={(v) => updateField('prenomPere', v)}
                            onBlur={() => markTouched('prenomPere')}
                            error={(touchedFields.has('prenomPere') || showErrors) && missingFieldsStep2.includes('prenomPere')}
                          />
                          <InputField
                            label="Email du père"
                            value={formData.emailPere}
                            onChange={(v) => updateField('emailPere', v)}
                            onBlur={() => markTouched('emailPere')}
                            error={(touchedFields.has('emailPere') || showErrors) && formData.emailPere.length > 0 && !formData.emailPere.includes('@')}
                          />
                          <InputField
                            label="Téléphone du père"
                            value={formData.telephonePere}
                            onChange={(v) => updateField('telephonePere', v)}
                            onBlur={() => markTouched('telephonePere')}
                            type="tel"
                            error={(touchedFields.has('telephonePere') || showErrors) && formData.telephonePere.length > 0 && !isValidPhone(formData.telephonePere)}
                          />
                          <div className="md:col-span-2">
                            <InputField
                              label="Profession"
                              value={formData.autreInfoPere}
                              onChange={(v) => updateField('autreInfoPere', v)}
                              onBlur={() => markTouched('autreInfoPere')}
                              error={(touchedFields.has('autreInfoPere') || showErrors) && missingFieldsStep2.includes('autreInfoPere')}
                            />
                          </div>
                        </div>
                      </section>

                      {/* Info Mère */}
                      <section className="bg-gray-100 p-6 md:p-8 border border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-800 mb-6 flex items-center gap-2">
                          <Users size={18} className="text-[#8178B1]" />
                          Informations sur la mère
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Nom de la mère"
                            value={formData.nomMere}
                            onChange={(v) => updateField('nomMere', v)}
                            onBlur={() => markTouched('nomMere')}
                            error={(touchedFields.has('nomMere') || showErrors) && missingFieldsStep2.includes('nomMere')}
                          />
                          <InputField
                            label="Prénom(s) de la mère"
                            value={formData.prenomMere}
                            onChange={(v) => updateField('prenomMere', v)}
                            onBlur={() => markTouched('prenomMere')}
                            error={(touchedFields.has('prenomMere') || showErrors) && missingFieldsStep2.includes('prenomMere')}
                          />
                          <InputField
                            label="Email de la mère"
                            value={formData.emailMere}
                            onChange={(v) => updateField('emailMere', v)}
                            onBlur={() => markTouched('emailMere')}
                            error={(touchedFields.has('emailMere') || showErrors) && formData.emailMere.length > 0 && !formData.emailMere.includes('@')}
                          />
                          <InputField
                            label="Téléphone de la mère"
                            value={formData.telephoneMere}
                            onChange={(v) => updateField('telephoneMere', v)}
                            onBlur={() => markTouched('telephoneMere')}
                            type="tel"
                            error={(touchedFields.has('telephoneMere') || showErrors) && formData.telephoneMere.length > 0 && !isValidPhone(formData.telephoneMere)}
                          />
                          <div className="md:col-span-2">
                            <InputField
                              label="Profession"
                              value={formData.autreInfoMere}
                              onChange={(v) => updateField('autreInfoMere', v)}
                              onBlur={() => markTouched('autreInfoMere')}
                              error={(touchedFields.has('autreInfoMere') || showErrors) && missingFieldsStep2.includes('autreInfoMere')}
                            />
                          </div>
                        </div>
                      </section>
                    </motion.div>
                  )}

                  {formStep === 3 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Bloc 2: Académique */}
                      <section className="bg-gray-100 p-6 md:p-8 border border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                          Académique
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <AutocompleteInput
                            label="Choix de la Filière"
                            value={formData.filiere}
                            onChange={(v) => updateField('filiere', v)}
                            onBlur={() => markTouched('filiere')}
                            placeholder="Sélectionnez une filière"
                            error={(touchedFields.has('filiere') || showErrors) && !formData.filiere}
                            options={[
                              "Analyses Biologiques et Biochimiques",
                              "Bâtiments et Travaux Publics",
                              "Géomètre Topographe",
                              "Génie Electrique et Energies Renouvelables",
                              "Système Informatique et Logiciel",
                              "Banque Finance Assurance",
                              "Finance Comptabilité Audit",
                              "Gestion des Ressources Humaines",
                              "Marketing Communication Commerce",
                              "Transport logistique",
                              "Hôtellerie et Tourisme",
                              "Génie de l’Environnement – Traitement des déchets et des eaux"
                            ]} />
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-700">Niveau d'entrée</label>
                            <div className="flex gap-2">
                              {['Licence 1', 'Licence 2', 'Licence 3'].map(n => (
                                <button
                                  key={n}
                                  onClick={() => updateField('niveau', n)}
                                  className={`flex-1 py-2 rounded-md text-sm transition-all border ${formData.niveau === n ? 'bg-[#8178B1] text-white border-[#8178B1]' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                >
                                  {n}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Bloc 3: Téléversement */}
                      <section className="bg-gray-100 p-6 md:p-8 border border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                          Documents requis
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <FileUpload label="Acte de naissance" file={docs.acteNaissance} onFileChange={(f) => updateDoc('acteNaissance', f)} error={rejectedFields.has('acteNaissance')} />
                          <FileUpload label="Photo d'identité" file={docs.photoIdentite} onFileChange={(f) => updateDoc('photoIdentite', f)} error={rejectedFields.has('photoIdentite')} />
                          <FileUpload label="Attestation du Bac" file={docs.attestationBac} onFileChange={(f) => updateDoc('attestationBac', f)} error={rejectedFields.has('attestationBac')} />
                          <FileUpload label="Bulletins de notes" file={docs.bulletinsNotes} onFileChange={(f) => updateDoc('bulletinsNotes', f)} error={rejectedFields.has('bulletinsNotes')} />
                        </div>
                      </section>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side Panel / Progress */}
            <div className="w-64 shrink-0 flex flex-col gap-4 mt-[52px] sticky top-[52px] h-fit">
              {formError && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-md mb-2">
                  <p className="text-[10px] font-bold text-red-600 uppercase mb-1">Erreur de validation</p>
                  <p className="text-[11px] text-red-700 leading-tight">{formError}</p>
                </div>
              )}
              <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
              <button
                onClick={() => {
                  let canNext = false;
                  if (formStep === 1) canNext = missingFieldsStep1.length === 0;
                  else if (formStep === 2) canNext = missingFieldsStep2.length === 0;
                  else if (formStep === 3) canNext = missingFieldsStep3.length === 0; // Docs are no longer blocking

                  if (canNext) {
                    setShowErrors(false);
                    setFormError(null);
                    if (formStep < 3) {
                      setFormStep(formStep + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      setCurrentPage('resume');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  } else {
                    setShowErrors(true);
                    setFormError("Veuillez remplir tous les champs correctement.");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="w-full bg-[#8178B1] text-white py-3.5 rounded-md font-medium text-sm hover:bg-[#6D63A3] transition-colors"
              >
                {formStep === 3 ? 'Terminer' : 'Suivant'}
              </button>

              {formStep > 1 && (
                <button
                  className="w-full bg-white border border-gray-200 text-gray-600 py-3.5 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setFormStep(formStep - 1);
                    setShowErrors(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Précédent
                </button>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="text-sm font-bold text-gray-700 mb-1">Informations Complémentaires</h5>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Veuillez vous assurer que toutes les informations saisies sont exactes. Vous pourrez les revoir à l'étape suivante avant la soumission définitive.
                </p>
              </div>
            </div>
          </div>
        );

      case 'resume':
        const getValue = (val: string) => val ? val : <span className="text-red-500 italic">Non renseigné</span>;
        const dateNaissance = (formData.jour && formData.mois && formData.annee) ? `${formData.jour} ${formData.mois} ${formData.annee}` : <span className="text-red-500 italic">Non renseigné</span>;
        const isDraft = missingFields.length > 0 || missingDocs.length > 0;

        return (
          <div className="w-full flex gap-8">
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              <div className="mb-12 flex justify-center">
                <h2 className="text-3xl font-bold text-[#8178B1]">
                  {isDraft ? "Brouillon" : "Récapitulatif de Vos Informations"}
                </h2>
              </div>

              <div className="space-y-6">
                {/* Section 1: État Civil */}
                <section className="bg-gray-100 p-6 md:p-8 border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">État Civil</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <p className="text-sm text-gray-600"><strong>Nom / Prénom :</strong> {getValue(formData.nom)} {getValue(formData.prenom)}</p>
                    <p className="text-sm text-gray-600"><strong>Contact :</strong> {getValue(formData.telephone)} | {getValue(formData.email)}</p>
                    <p className="text-sm text-gray-600"><strong>Naissance :</strong> {dateNaissance} ({getValue(formData.paysNaissance)})</p>
                    <p className="text-sm text-gray-600"><strong>Nationalité :</strong> {getValue(formData.nationalite)}</p>
                    <p className="text-sm text-gray-600 md:col-span-2"><strong>Adresse :</strong> {getValue(formData.adresse)}</p>
                  </div>
                </section>

                {/* Section 2: Parents */}
                <section className="bg-gray-100 p-6 md:p-8 border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Informations Parentales</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <p className="text-sm text-gray-600"><strong>Père :</strong> {getValue(formData.prenomPere)} {getValue(formData.nomPere)} ({getValue(formData.telephonePere)})</p>
                    <p className="text-sm text-gray-600"><strong>Mère :</strong> {getValue(formData.prenomMere)} {getValue(formData.nomMere)} ({getValue(formData.telephoneMere)})</p>
                  </div>
                </section>

                {/* Section 3: Académique */}
                <section className="bg-gray-100 p-6 md:p-8 border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Académique</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600"><strong>Filière :</strong> {getValue(formData.filiere)}</p>
                    <p className="text-sm text-gray-600"><strong>Niveau d'entrée :</strong> {getValue(formData.niveau)}</p>
                  </div>
                </section>

                {/* Section 4: Documents */}
                <section className="bg-gray-100 p-6 md:p-8 border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Documents Requis</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Acte Naissance', ok: !!docs.acteNaissance },
                      { label: 'Photo Identité', ok: !!docs.photoIdentite },
                      { label: 'Attestation Bac', ok: !!docs.attestationBac },
                      { label: 'Bulletins Notes', ok: !!docs.bulletinsNotes }
                    ].map((d, i) => (
                      <div key={i} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${d.ok ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                        {d.ok ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="text-[10px] font-bold text-center uppercase tracking-tight">{d.label}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="w-64 shrink-0 flex flex-col gap-4 mt-[52px] sticky top-[52px] h-fit">
              {formError && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-md mb-2">
                  <p className="text-[10px] font-bold text-red-600 uppercase mb-1">Erreur</p>
                  <p className="text-[11px] text-red-700 leading-tight">{formError}</p>
                </div>
              )}
              {!isDraft ? (
                <button
                  onClick={handleSave}
                  className="w-full bg-green-600 text-white py-3.5 rounded-md font-medium text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                >
                  Soumettre définitivement
                </button>
              ) : (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-md mb-2">
                  <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Dossier Incomplet</p>
                  <p className="text-[11px] text-amber-700 leading-tight">Veuillez compléter les informations manquantes avant de soumettre.</p>
                </div>
              )}

              <button
                onClick={() => {
                  setCurrentPage('inscription');
                  setFormStep(3);
                }}
                className="w-full bg-white border border-gray-200 text-gray-600 py-3.5 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                {isDraft ? "Compléter" : "Modifier mes infos"}
              </button>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="text-sm font-bold text-gray-700 mb-1">Note Importante</h5>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Une fois soumis, votre dossier sera examiné par le secrétariat. Assurez-vous de la véracité des pièces fournies.
                </p>
              </div>
            </div>
          </div>
        );

      case 'succes':
        return (
          <div className="fixed inset-0 bg-white z-[100] flex overflow-hidden font-['Inter',sans-serif]">
            <div className="flex w-full h-full">

              {/* Left Sidebar - Stepper */}
              <div className="hidden lg:flex w-[32%] bg-[#F0F2FF] p-12 border-r border-[#E8EAF6] flex-col justify-center">
                <div className="relative max-w-[260px] mx-auto w-full py-10">
                  {/* Vertical line connecting steps */}
                  <div className="absolute left-[19.5px] top-4 bottom-4 w-[1px] bg-gray-200">
                    <motion.div 
                      className="absolute top-0 left-0 w-full bg-[#8178B1]"
                      initial={{ height: 0 }}
                      animate={{ 
                        height: `${
                          statusStep === 1 ? 0 : 
                          statusStep === 2 ? 33 : 
                          statusStep === 3 ? 50 : 
                          statusStep === 4 ? 66 : 100
                        }%` 
                      }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </div>

                  <div className="space-y-16 relative">
                    {[
                      { id: 1, label: 'Dépôt de dossier' },
                      { id: 2, label: 'Réception du matricule' },
                      { id: 3, label: 'Paiement des frais' },
                      { id: 4, label: 'Validation de paiement' }
                    ].map((step) => {
                      const isCompleted = statusStep > step.id || (step.id === 3 && statusStep >= 5) || (step.id === 4 && isReceiptAccepted);
                      const isActive = statusStep === step.id || (step.id === 3 && statusStep === 4) || (step.id === 4 && statusStep === 5);
                      const isHalf = step.id === 3 && statusStep === 3;
                      const isFull = (step.id < 3 && statusStep >= step.id) || (step.id === 3 && statusStep >= 4) || (step.id === 4 && statusStep >= 5);

                      return (
                        <div key={step.id} className="flex items-center gap-6 group">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 relative overflow-hidden ${
                            isCompleted || (isFull && !isHalf)
                              ? 'bg-[#8178B1] text-white shadow-xl shadow-[#8178B1]/30'
                              : isHalf
                                ? 'border-2 border-[#8178B1] bg-white'
                                : 'bg-white border-2 border-gray-200 text-gray-400'
                            }`}>
                            {isHalf && (
                              <div className="absolute inset-0 bg-[#8178B1] w-1/2" />
                            )}
                            <span className={`text-xs font-black relative z-10 transition-colors ${
                              isHalf ? 'text-[#8178B1]' : ''
                            }`}>
                              {isCompleted ? <CheckCircle2 size={18} /> : 
                               (isHalf ? <span className="text-gray-600">3</span> : step.id)}
                            </span>
                          </div>
                          <span className={`text-[15px] font-bold tracking-tight transition-colors ${
                            (statusStep >= step.id || (step.id === 3 && statusStep === 4) || (step.id === 4 && statusStep === 5)) ? 'text-[#8178B1]' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="flex-1 p-10 md:p-16 overflow-hidden flex flex-col items-center justify-center bg-white relative">
                <div className="max-w-3xl w-full flex flex-col items-center justify-center">

                  {statusStep === 1 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center">
                      <div className="text-center mb-8">
                        <span className="text-[9px] font-black text-[#8178B1] uppercase tracking-[0.4em] block mb-4">Étape 01</span>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight">
                          {isRejected ? "Dossier à corriger" : "Dossier soumis avec succès !"}
                        </h2>
                      </div>
                      <div className={`w-12 h-1 rounded-full my-6 ${isRejected ? 'bg-orange-400' : 'bg-[#8178B1]'}`} />
                      
                      {isRejected ? (
                        <div className="w-full flex flex-col items-center">
                          <div className="p-10 bg-white border-2 border-orange-100 rounded-[48px] shadow-xl shadow-orange-500/5 mb-10 w-full max-w-2xl">
                            <p className="text-gray-700 leading-relaxed text-[16px] font-medium text-center italic">
                              "{rejectionMessage}"
                            </p>
                          </div>
                          <div className="flex flex-col items-center gap-6">
                            <button
                              onClick={() => {
                                const token = localStorage.getItem('token');
                                fetch('/api/re-edit-profile', {
                                  method: 'POST',
                                  headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                                }).then(() => {
                                  setIsRejected(false);
                                  setIsSubmitted(false);
                                  setCurrentPage('inscription');
                                  setFormStep(1);
                                });
                              }}
                              className="bg-orange-500 text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/30"
                            >
                              Modifier mes informations
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full flex flex-col items-center">
                          <div className="p-8 bg-gray-50 border border-gray-100 rounded-[32px] mb-10 text-center w-full shadow-sm">
                            <p className="text-gray-600 leading-relaxed text-[15px] font-medium tracking-tight">
                              Vos pièces justificatives ont été transmises à notre secrétariat.
                              <br /><br />
                              Un agent examine actuellement la conformité de vos documents. Une fois validé, vous passerez à l'étape de génération de votre matricule.
                            </p>
                          </div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Validation par le secrétariat en cours...</p>
                          <button onClick={() => fetchUserData()} className="mt-4 text-[9px] font-black text-[#8178B1] uppercase tracking-[0.2em] border-b border-[#8178B1]/20 pb-0.5 hover:text-[#7168A0] transition-colors">Actualiser le statut</button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {statusStep === 2 && !isRejected && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                      <div className="text-center mb-10">
                        <span className="text-[9px] font-black text-[#8178B1] uppercase tracking-[0.4em] block mb-4">Étape 02</span>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Réception du matricule</h2>
                      </div>
                      <div className="p-8 bg-[#8178B1]/10 border border-[#8178B1]/20 rounded-[32px] mb-10">
                        <p className="text-[#8178B1] text-sm font-black text-center tracking-tight">
                          Bonne nouvelle ! Votre dossier a été accepté. <br />
                          Veuillez maintenant renseigner votre matricule reçu par email.
                        </p>
                      </div>
                      <div className="space-y-6 max-w-md mx-auto w-full">
                        {currentUser?.matricule ? (
                          <div className="space-y-6">
                            <div className="bg-white border-2 border-[#8178BB]/10 p-8 rounded-[32px] space-y-6 shadow-sm text-center">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Votre Matricule Officiel</label>
                                <p className="text-3xl font-black text-[#8178BB] tracking-tighter">{currentUser.matricule}</p>
                              </div>
                              <div className="h-px bg-gray-50 w-full" />
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Email Académique</label>
                                <p className="text-sm font-bold text-gray-700">{currentUser.email}</p>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => updateStatusStep(3)}
                              className="w-full bg-[#8178BB] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#8178BB]/20 hover:bg-[#7168A0] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                              Confirmer et passer au paiement
                              <ChevronRight size={18} />
                            </button>
                            
                            <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest">Veuillez conserver précieusement ces identifiants</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-6">
                            <div className="p-8 bg-gray-50 border border-gray-100 rounded-[32px] text-center w-full">
                              <p className="text-gray-500 font-bold text-sm">
                                Le service comptable génère actuellement vos identifiants définitifs.
                              </p>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                               <div className="flex items-center gap-2 text-[#8178B1] animate-pulse">
                                 <div className="w-1.5 h-1.5 bg-current rounded-full" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">En attente des accès du comptable...</span>
                               </div>
                               <button onClick={() => fetchUserData()} className="text-[9px] font-black text-[#8178B1]/60 uppercase tracking-[0.2em] hover:text-[#8178B1] transition-colors">Vérifier maintenant</button>
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-10 flex justify-center opacity-10">
                           <button onClick={() => updateStatusStep(3)} className="text-[8px] font-black uppercase tracking-widest">Simuler passage au paiement</button>
                        </div>
                      </div>
                    </motion.div>
                  )}


                  {statusStep === 3 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                      <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Paiement des frais</h2>
                        <p className="text-sm text-gray-500 mt-2 font-medium">Filière : {formData.filiere || 'Non spécifiée'}</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-[#8178B1] uppercase tracking-widest flex items-center gap-2">
                            <Banknote size={14} /> Récapitulatif des frais
                          </h4>
                          <div className="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                            <table className="w-full text-[13px]">
                              <thead className="bg-gray-100/50">
                                <tr>
                                  <th className="text-left p-4 font-black uppercase text-[9px] tracking-widest text-gray-500 border-b border-gray-100">Désignation</th>
                                  <th className="text-right p-4 font-black uppercase text-[9px] tracking-widest text-gray-500 border-b border-gray-100">Montant</th>
                                </tr>
                              </thead>
                              <tbody className="font-bold text-gray-700">
                                <tr className="border-b border-gray-50">
                                  <td className="p-4">Droits d'inscription</td>
                                  <td className="p-4 text-right">50 000 FCFA</td>
                                </tr>
                                <tr className="border-b border-gray-50">
                                  <td className="p-4">1ère Tranche</td>
                                  <td className="p-4 text-right">250 000 FCFA</td>
                                </tr>
                                <tr className="border-b border-gray-50">
                                  <td className="p-4">2ème Tranche</td>
                                  <td className="p-4 text-right">200 000 FCFA</td>
                                </tr>
                                <tr className="border-b border-gray-50">
                                  <td className="p-4">3ème Tranche</td>
                                  <td className="p-4 text-right">150 000 FCFA</td>
                                </tr>
                                <tr>
                                  <td className="p-4">Uniforme</td>
                                  <td className="p-4 text-right">25 000 FCFA</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-[#8178B1] uppercase tracking-widest flex items-center gap-2">
                              <Info size={14} /> Infos Bancaires
                            </h4>
                            <div className="bg-[#8178B1]/5 p-6 rounded-3xl border border-[#8178B1]/10">
                              <div className="flex justify-between items-center mb-3">
                                <p className="text-[9px] font-black text-[#8178B1] uppercase tracking-widest">Banque</p>
                                <p className="font-bold text-gray-800 text-sm">ECOBANK</p>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-[9px] font-black text-[#8178B1] uppercase tracking-widest">Compte</p>
                                <p className="font-bold text-gray-800 text-sm">CI059 01001 1234567890 42</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-[#8178B1] uppercase tracking-widest flex items-center gap-2">
                              <Upload size={14} /> Reçu de paiement
                            </h4>
                            <div className="bg-white border-2 border-dashed border-gray-200 p-6 rounded-3xl flex flex-col items-center gap-4">
                              <p className="text-[11px] font-bold text-gray-400">Scan du reçu (PDF ou Image)</p>
                              <div className="relative w-full">
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setReceipt(e.target.files?.[0] || null)} />
                                <div className="bg-gray-50 text-gray-500 p-4 rounded-xl border border-gray-100 text-center text-xs font-bold truncate">
                                  {receipt ? receipt.name : 'Choisir un fichier...'}
                                </div>
                              </div>
                              <button
                                onClick={handleSubmitReceipt}
                                className="w-full bg-[#8178B1] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#6D63A3] transition-all shadow-lg shadow-[#8178B1]/20 disabled:opacity-50"
                                disabled={!receipt}
                              >
                                Envoyer le reçu
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {statusStep === 4 && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex flex-col items-center text-center">
                      <div className="mb-10 text-center">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Dépôt Validé !</h2>
                      </div>

                      <div className="p-10 bg-white border-2 border-gray-50 rounded-[48px] max-w-xl shadow-2xl shadow-[#8178B1]/5 mb-10">
                        <p className="text-gray-600 leading-relaxed text-[16px] font-medium">
                          Votre reçu de paiement a été transmis avec succès. <br /><br />
                          Le secrétariat procède à la vérification du paiement effectué.
                        </p>
                      </div>

                      <div className="flex flex-col items-center gap-6">
                        <button
                          onClick={() => fetchUserData()}
                          className="flex items-center gap-3 text-[#8178B1] bg-white px-8 py-4 rounded-2xl border border-[#8178B1]/20 hover:bg-[#8178B1]/5 transition-all shadow-sm group"
                        >
                          <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Actualiser le statut</span>
                        </button>

                        <button
                          onClick={() => updateStatusStep(5)}
                          className="flex items-center gap-3 text-gray-400 hover:text-[#8178B1] transition-all opacity-30 hover:opacity-100"
                        >
                          <div className="w-2 h-2 bg-current rounded-full" />
                          <span className="text-[9px] font-bold uppercase tracking-widest underline decoration-dotted">Simuler validation (Debug)</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {statusStep === 5 && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex flex-col items-center text-center">
                      <div className="mb-10 text-center">
                        <h2 className="text-4xl font-black text-emerald-600 tracking-tight">Paiement Accepté !</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest mt-2">Votre inscription est désormais finalisée</p>
                      </div>

                      <div className="bg-white p-12 rounded-[50px] border-2 border-gray-50 shadow-2xl shadow-emerald-500/5 flex flex-col items-center w-full max-w-lg mb-10">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-6">
                          <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-4">Félicitations {currentUser?.firstname}</h3>
                        <p className="text-gray-500 font-medium leading-relaxed mb-8">
                          Votre reçu a été validé par le service comptabilité. Vous faites désormais officiellement partie de l'Université Faucon.
                        </p>
                        
                        <button
                          onClick={() => {
                            setCurrentPage('dashboard');
                            localStorage.setItem('faucon_current_page', 'dashboard');
                          }}
                          className="w-full bg-[#8178B1] text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-[#6D63A3] transition-all shadow-xl shadow-[#8178B1]/20 hover:scale-[1.02] active:scale-95"
                        >
                          Accéder à mon espace personnel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div >
          </div >
        );

      case 'dashboard':
        return (
          <div className="fixed inset-0 bg-[#F8FAFC] z-[100] flex font-['Inter',sans-serif] tracking-tight overflow-hidden text-[#1E293B]">
            {/* Refined Sidebar - 240px width */}
            <aside className="w-[240px] bg-gradient-to-b from-[#8178B1] to-[#7168A0] flex flex-col py-8 px-5 relative z-[101] shadow-[25px_0_80px_rgba(129,120,187,0.2)]">
              {/* Logo Section */}
              <div className="mb-10 px-4">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-2xl font-black tracking-tighter leading-tight">
                    <span className="text-white">Fau</span><span className="text-[#1E293B]">con</span>
                  </span>
                </div>
                <div className="h-px w-full bg-white/10 mt-6" />
              </div>

              {/* Navigation Section */}
              <nav className="flex-1 space-y-1.5">
                {[
                  { icon: <Layout size={18} />, label: 'Tableau de bord' },
                  { icon: <User size={18} />, label: 'Profil' },
                  { icon: <ClipboardList size={18} />, label: 'Cursus' },
                  { icon: <CreditCard size={18} />, label: 'Finances' },
                  { icon: <Calendar size={18} />, label: 'Planning' },
                  { icon: <Files size={18} />, label: 'Dossiers à fournir' },
                  { icon: <Bell size={18} />, label: 'Notifications' },
                ].map((item, i) => {
                  const isActive = dashboardTab === item.label;
                  return (
                    <button
                      key={i}
                      onClick={() => setDashboardTab(item.label)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[18px] text-[12px] font-bold transition-all relative group overflow-hidden ${isActive
                          ? 'bg-white text-[#8178B1] shadow-[0_15px_30px_rgba(0,0,0,0.12)]'
                          : 'text-white/60 hover:text-white hover:bg-white/5 hover:translate-x-1'
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebarActiveBackground"
                          className="absolute inset-0 bg-white"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      <span className={`transition-colors relative z-10 shrink-0 ${isActive ? 'text-[#8178B1]' : 'text-white/60 group-hover:text-white'}`}>
                        {item.icon}
                      </span>
                      <span className="relative z-10">{item.label}</span>
                      
                      {isActive && (
                        <motion.div
                          layoutId="sidebarActiveIndicator"
                          className="absolute right-4 w-1.5 h-1.5 bg-[#8178B1] rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Footer Section */}
              <div className="mt-auto space-y-2 pt-6 border-t border-white/10">
                <button
                  onClick={() => setDashboardTab('Paramètres')}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[18px] text-[12px] font-bold transition-all relative group overflow-hidden ${dashboardTab === 'Paramètres'
                      ? 'bg-white text-[#8178B1] shadow-[0_15px_30px_rgba(0,0,0,0.12)]'
                      : 'text-white/60 hover:text-white hover:bg-white/5 hover:translate-x-1'
                    }`}
                >
                  {dashboardTab === 'Paramètres' && (
                    <motion.div
                      layoutId="sidebarActiveBackground"
                      className="absolute inset-0 bg-white"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className={`transition-colors relative z-10 shrink-0 ${dashboardTab === 'Paramètres' ? 'text-[#8178B1]' : 'text-white/60 group-hover:text-white'}`}>
                    <Settings size={18} />
                  </span>
                  <span className="relative z-10">Paramètres</span>
                </button>

                <button
                  onClick={() => { localStorage.clear(); window.location.reload(); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[18px] text-white/50 hover:text-white hover:bg-red-500/20 transition-all text-[11px] font-bold group"
                >
                  <div className="bg-white/10 group-hover:bg-red-500/30 p-2 rounded-lg transition-colors">
                    <LogOut size={16} />
                  </div>
                  Déconnexion
                </button>
              </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 relative">
              {/* Header - Simplified as requested */}
              <header className="h-24 bg-white border-b border-gray-100 px-10 flex items-center justify-between shrink-0">
                <div className="flex flex-col">
                  <h2 className="text-xl font-black text-[#1E293B] tracking-tight">
                    {dashboardTab === 'Profil' ? 'Mon Profil Personnel' : 
                     dashboardTab === 'Finances' ? 'Finances' : 
                     dashboardTab === 'Planning' ? 'Planning / Emploi du Temps' :
                     dashboardTab === 'Notifications' ? 'Vos Notifications' :
                     dashboardTab === 'Dossiers à fournir' ? 'Documents Académiques' :
                     dashboardTab === 'Cursus' ? 'Cursus Scolaire' : 'Espace Étudiant'}
                  </h2>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-black text-[#1E293B] leading-none mb-1">{currentUser?.lastname} {currentUser?.firstname}</p>
                      <p className="text-[10px] font-black text-[#8178B1] uppercase tracking-widest">{currentUser?.matricule || 'En cours...'}</p>
                    </div>
                    <div 
                      onClick={() => setDashboardTab('Profil')}
                      className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-gray-50 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center bg-gray-50"
                    >
                      {profileImage ? (
                        <img src={profileImage} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-[#8178B1]/40">
                          {formData.genre === 'Féminin' ? (
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                            </svg>
                          ) : (
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </header>

              {/* Content area - No scroll & No padding on Profil tab */}
              <div className={`flex-1 ${dashboardTab === 'Profil' ? 'overflow-hidden p-0' : 'overflow-y-auto px-10 pb-10'} custom-scrollbar`}>
                {dashboardTab === 'Tableau de bord' && (
                  <main className="max-w-[1600px] mx-auto space-y-10 mt-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                       {/* Date de Rentrée - Updated to 2026 and SIL */}
                       <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex items-center justify-between overflow-hidden relative group">
                        <div className="relative z-10 space-y-4">
                          <span className="inline-block px-4 py-1.5 bg-[#8178B1]/10 text-[#8178B1] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#8178B1]/20">
                            {activeAnnee?.nom || 'Prochaine rentrée scolaire'}
                          </span>
                          <h2 className="text-4xl font-black text-[#1E293B] tracking-tight">
                            {activeAnnee?.date_debut ? new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(activeAnnee.date_debut)) : 'Lundi 14 Octobre 2026'}
                          </h2>
                          <p className="text-gray-500 font-bold max-w-md">
                            Préparez-vous pour le début de votre cursus en <span className="text-[#8178B1]">{userFiliere?.nom || 'Votre Filière'}</span>.
                          </p>
                          <div className="flex gap-4 pt-2">
                             <button 
                               onClick={() => setDashboardTab('Cursus')}
                               className="bg-[#8178B1] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#6D63A3] transition-all flex items-center gap-2">
                               Voir mon programme <Layout size={14} />
                             </button>
                          </div>
                        </div>
                        <div className="relative z-10 hidden md:block">
                           <Calendar size={120} className="text-[#8178B1]/10 -rotate-12" />
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8178B1]/5 rounded-full blur-3xl -mr-20 -mt-20" />
                      </div>

                      {/* Reçu de Paiement - Redirects to Finances */}
                      <div className="bg-[#1E1B4B] rounded-[40px] p-10 text-white flex flex-col justify-between overflow-hidden relative">
                         <div className="relative z-10">
                           <h3 className="text-xl font-black mb-2">Inscription validée</h3>
                           <p className="text-white/50 text-xs font-bold leading-relaxed">
                             Vos frais d'inscription ont été reçus. Vous pouvez désormais télécharger votre reçu officiel.
                           </p>
                         </div>
                         <button 
                           onClick={() => setDashboardTab('Finances')}
                           className="relative z-10 w-full bg-white text-[#1E1B4B] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 mt-8">
                            Télécharger mon reçu <Files size={18} />
                         </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      <div className="space-y-8">
                        <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                           <div className="flex justify-between items-center mb-10">
                              <div>
                                <h3 className="text-xl font-black text-[#1E293B] tracking-tight">Matières de l'année</h3>
                                <p className="text-gray-400 text-xs font-bold mt-1">Cursus {userFiliere?.code || ''} - {currentUser?.level || 'Licence 1'}</p>
                              </div>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {(userFiliere?.matieres || [])
                                .filter((m:any) => {
                                    const userLevelNum = parseInt((currentUser?.level || '1').replace(/[^0-9]/g, '') || '1');
                                    return m.annee_etude === userLevelNum;
                                })
                                .slice(0, 4).map((item:any, i:number) => (
                                <div key={i} className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-50 hover:border-[#8178B1]/20 transition-all cursor-pointer group" onClick={() => setDashboardTab('Cursus')}>
                                   <div className={`w-12 h-12 bg-[#8178B1]/10 text-[#8178B1] rounded-xl flex items-center justify-center shrink-0`}>
                                      <ClipboardList size={20} />
                                   </div>
                                   <div className="flex-1">
                                      <h4 className="text-sm font-bold text-[#1E293B] line-clamp-1">{item.nom}</h4>
                                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.credits} Crédits</p>
                                   </div>
                                </div>
                              ))}
                              {(!userFiliere || !userFiliere.matieres || userFiliere.matieres.length === 0) && (
                                  <p className="text-sm text-gray-400">Aucune matière configurée pour l'instant.</p>
                              )}
                           </div>
                        </section>
                      </div>

                      <div className="space-y-8">
                        <section 
                          onClick={() => setDashboardTab('Finances')}
                          className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm cursor-pointer hover:border-[#8178B1]/30 transition-all group h-full"
                        >
                          <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-black text-[#1E293B] tracking-tight">État Scolarité</h3>
                            <div className="w-10 h-10 bg-[#8178B1]/10 text-[#8178B1] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                              <CreditCard size={20} />
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            <div>
                               <div className="flex justify-between items-end mb-3">
                                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payé</span>
                                  <span className="text-2xl font-black text-[#8178B1]">{scolariteStats.percent}%</span>
                               </div>
                               <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${scolariteStats.percent}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-[#8178B1] rounded-full"
                                  />
                               </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pb-2">
                               <div className="p-4 bg-gray-50 rounded-2xl">
                                  <p className="text-[9px] font-black text-gray-400">Effectué</p>
                                  <p className="text-sm font-black text-[#1E293B]">{scolariteStats.paid.toLocaleString()} F</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                   <p className="text-[9px] font-black text-gray-400">Reste</p>
                                   <p className="text-sm font-black text-orange-500">{scolariteStats.rest.toLocaleString()} F</p>
                                </div>
                             </div>
                          </div>
                        </section>
                      </div>

                        {/* Summary & Notifications row */}
                        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                           {/* Activité Récente */}
                           <section className="bg-[#1E1B4B] p-10 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                                 <Clock size={80} />
                              </div>
                              <h3 className="text-lg font-black mb-6 relative z-10">Activité Récente</h3>
                               <div className="space-y-4 relative z-10">
                                 {statusStep >= 5 && (
                                   <div 
                                      className="flex gap-4 p-4 bg-white/10 rounded-2xl border border-white/5 hover:bg-white/15 transition-all cursor-pointer group/item"
                                      onClick={() => setDashboardTab('Finances')}
                                   >
                                      <div className="text-[10px] font-black p-2 bg-white/20 rounded-lg h-fit text-[#8178B1]">DOC</div>
                                      <div>
                                         <p className="font-black text-sm">Frais d'inscription validés</p>
                                         <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest group-hover/item:text-white transition-colors">Télécharger mon reçu</p>
                                      </div>
                                   </div>
                                 )}
                                 <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-[10px] font-black p-2 bg-white/10 rounded-lg h-fit text-white/40">CAL</div>
                                    <div>
                                       <p className="font-black text-sm text-white/60">Début des cours</p>
                                       <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{activeAnnee?.date_debut || 'Octobre 2026'}</p>
                                    </div>
                                 </div>
                              </div>
                           </section>

                           <section 
                              onClick={() => setDashboardTab('Notifications')}
                              className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group cursor-pointer hover:border-[#8178B1]/30 hover:shadow-xl hover:shadow-[#8178B1]/5 transition-all"
                           >
                              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all text-[#8178B1]">
                                 <Bell size={80} />
                              </div>
                              <h3 className="text-lg font-black text-[#1E293B] mb-6 relative z-10">Notifications</h3>
                              <div className="space-y-4 relative z-10">
                                 <div className="flex gap-4 p-4 bg-[#8178B1]/5 rounded-2xl border border-[#8178B1]/10 group-hover:bg-[#8178B1]/10 transition-all">
                                    <div className="w-10 h-10 bg-[#8178B1]/20 rounded-xl flex items-center justify-center text-[#8178B1] shrink-0">
                                       <Bell size={18} />
                                    </div>
                                    <div>
                                       <p className="font-black text-sm text-[#1E293B]">Action requise</p>
                                       <p className="text-xs text-gray-500 font-bold mt-1">Vous devez fournir des dossiers pour votre carte d'étudiant</p>
                                    </div>
                                 </div>
                              </div>
                           </section>
                        </div>
                    </div>
                  </main>
                )}

                {(dashboardTab === 'User Profil' || dashboardTab === 'Profil') && (
                  <main className="h-full w-full bg-white flex overflow-hidden">
                    <section className="flex-1 flex flex-col md:flex-row h-full">
                      {/* Left side: Avatar & Summary */}
                      <div className="w-[380px] bg-gray-50/50 border-r border-gray-100 p-12 flex flex-col items-center justify-center space-y-8 shrink-0">
                        <div className="relative group">
                          <div className="w-48 h-48 rounded-[48px] overflow-hidden border-8 border-white shadow-2xl relative z-10 bg-white">
                            {profileImage ? (
                              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#8178B1]/40 bg-gray-50">
                                <User size={80} />
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-2 -right-2 z-20">
                            <button 
                              onClick={() => document.getElementById('profile-upload')?.click()}
                              className="w-12 h-12 bg-[#8178B1] text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-all border-4 border-white"
                            >
                              <PlusCircle size={20} />
                            </button>
                            <input 
                              type="file" 
                              id="profile-upload" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => setProfileImage(reader.result as string);
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </div>
                        </div>

                        <div className="text-center space-y-2">
                          <h3 className="text-2xl font-black text-[#1E293B] tracking-tight">
                            {currentUser?.lastname} {currentUser?.firstname}
                          </h3>
                          <p className="text-[10px] font-black text-[#8178B1] uppercase tracking-[0.2em]">{currentUser?.filiere || 'Étudiant'} • {currentUser?.level || 'L1'}</p>
                          <div className="inline-block px-4 py-1.5 bg-[#8178B1]/10 text-[#8178B1] rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#8178B1]/20">
                            {currentUser?.matricule || 'Sans Matricule'}
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Information Forms */}
                      <div className="flex-1 p-12 lg:p-16 flex flex-col justify-center bg-white overflow-hidden">
                        <div className="max-w-[700px] w-full mx-auto space-y-10">
                          <div className="space-y-6">
                            <div className="flex items-center gap-3">
                              <div className="w-1 h-5 bg-[#8178B1] rounded-full" />
                              <h4 className="text-lg font-black text-[#1E293B] tracking-tight uppercase tracking-widest text-[11px]">Informations Personnelles</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nom de famille</label>
                                <div className="bg-gray-50 border border-gray-100 px-5 py-3.5 rounded-xl text-sm font-bold text-gray-400">
                                  {formData.nom}
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Prénom</label>
                                <div className="bg-gray-50 border border-gray-100 px-5 py-3.5 rounded-xl text-sm font-bold text-gray-400">
                                  {formData.prenom}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="flex items-center gap-3">
                              <div className="w-1 h-5 bg-[#8178B1] rounded-full" />
                              <h4 className="text-lg font-black text-[#1E293B] tracking-tight uppercase tracking-widest text-[11px]">Coordonnées</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Adresse Email</label>
                                <input 
                                  type="email" 
                                  value={formData.email}
                                  onChange={(e) => updateField('email', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-100 px-5 py-3.5 rounded-xl text-sm font-bold text-[#1E293B] focus:bg-white focus:border-[#8178B1] outline-none transition-all shadow-sm"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Téléphone</label>
                                <input 
                                  type="tel" 
                                  value={formData.telephone}
                                  onChange={(e) => updateField('telephone', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-100 px-5 py-3.5 rounded-xl text-sm font-bold text-[#1E293B] focus:bg-white focus:border-[#8178B1] outline-none transition-all shadow-sm"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-4">
                            <button className="w-full bg-[#8178B1] text-white py-4.5 rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#6D63A3] hover:shadow-xl hover:shadow-[#8178B1]/20 transition-all flex items-center justify-center gap-3">
                              Mettre à jour mes informations
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>
                  </main>
                )}

                {dashboardTab === 'Cursus' && (
                  <main className="max-w-[1200px] mx-auto space-y-10 mt-10">
                    <header className="space-y-2 px-2">
                       <div className="flex items-center gap-3 mb-2">
                         <span className="px-3 py-1 bg-[#8178B1]/10 text-[#8178B1] rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{activeAnnee?.nom || "Période en cours"}</span>
                       </div>
                       <h2 className="text-4xl font-black text-[#1E293B] tracking-tight">Programme de Formation</h2>
                       <p className="text-gray-400 font-bold max-w-2xl">{userFiliere?.nom || 'Non défini'} — Maquette pédagogique détaillée de votre cursus.</p>
                    </header>

                    <section className="space-y-12 pb-20">
                      {userFiliere ? (
                        [1, 2, 3, 4, 5, 6]
                          .filter(semestre => {
                              const userLevelNum = parseInt((currentUser?.level || '1').replace(/[^0-9]/g, '') || '1');
                              const minSem = (userLevelNum - 1) * 2 + 1;
                              const maxSem = userLevelNum * 2;
                              return semestre >= minSem && semestre <= maxSem;
                          })
                          .filter(semestre => userFiliere.matieres && userFiliere.matieres.some((m:any) => m.semestre === semestre)).map((semestre) => {
                          const subjects = userFiliere.matieres.filter((m:any) => m.semestre === semestre);
                          const totalCredits = subjects.reduce((sum:number, subj:any) => sum + subj.credits, 0);
                          return (
                            <div key={semestre} className="space-y-6">
                               <div className="flex items-center justify-between px-2">
                                 <h3 className="text-2xl font-black text-[#1E293B] flex items-center gap-4">
                                   <span className="w-10 h-10 bg-[#1E1B4B] text-white rounded-2xl flex items-center justify-center text-sm">{semestre}</span>
                                   Semestre {semestre}
                                 </h3>
                                 <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{totalCredits} Crédits ECTS</span>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {subjects.map((subj:any, i:number) => {
                                    return (
                                      <div key={i} className="group bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-[#8178B1]/5 transition-all flex flex-col h-full">
                                         <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-900 bg-gray-50 text-gray-900`}>
                                               {subj.code}
                                            </span>
                                            <span className="text-lg font-black text-[#8178B1]">{subj.credits}C</span>
                                         </div>
                                         <h4 className="text-[15px] font-black text-[#1E293B] mb-4 leading-tight group-hover:text-[#8178B1] transition-colors">
                                            {subj.nom}
                                         </h4>
                                         <div className="mt-auto space-y-2">
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Éléments Constitutifs (EC)</p>
                                            <div className="flex flex-wrap gap-2">
                                              {subj.elements_constitutifs && subj.elements_constitutifs.length > 0 ? subj.elements_constitutifs.map((ec:any, k:number) => (
                                                <span key={k} className="px-3 py-1.5 bg-gray-50 rounded-xl text-[11px] font-bold text-gray-500 border border-transparent group-hover:border-gray-100 transition-all">
                                                  {ec.nom}
                                                </span>
                                              )) : (
                                                  <span className="text-xs italic text-gray-400">Aucun EC défini</span>
                                              )}
                                            </div>
                                         </div>
                                      </div>
                                    );
                                  })}
                               </div>
                            </div>
                          );
                        })
                      ) : (
                          <p className="text-gray-500 italic p-6">Aucun programme disponible pour votre profil. Veuillez patienter ou contacter l'administration.</p>
                      )}
                    </section>
                  </main>
                )}

                {dashboardTab === 'Finances' && (
                  <main className="max-w-[1200px] mx-auto space-y-10 mt-10 pb-20">
                    {/* Header Section */}
                    <header className="flex justify-between items-end px-2">
                       <div className="space-y-1">
                         <h3 className="text-3xl font-black text-[#1E1B4B]">Suivi détaillé de vos frais de scolarité</h3>
                         <p className="text-gray-400 font-bold text-sm">Année Académique 2026-2027</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total restant à payer</p>
                         <p className="text-2xl font-black text-orange-500">350 000 FCFA</p>
                       </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      {/* Left: Main Fees Table */}
                      <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50/50">
                              <tr className="border-b border-gray-100">
                                <th className="text-left py-6 px-8 text-[11px] font-black uppercase text-gray-400 tracking-widest">Désignation</th>
                                <th className="text-left py-6 px-8 text-[11px] font-black uppercase text-gray-400 tracking-widest">Montant</th>
                                <th className="text-left py-6 px-8 text-[11px] font-black uppercase text-gray-400 tracking-widest">Échéance</th>
                                <th className="text-right py-6 px-8 text-[11px] font-black uppercase text-gray-400 tracking-widest">Statut</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {[
                                { name: "Droits d'inscription", amount: "50 000", date: "Réinscription effectuée", status: statusStep >= 5 ? "payé" : (statusStep === 4 ? "en-cours" : "non-payé") },
                                { name: "1ère Tranche", amount: "250 000", date: "Avant 1er Nov 2026", status: "non-payé" },
                                { name: "2ème Tranche", amount: "200 000", date: "Avant 1er Jan 2027", status: "non-payé" },
                                { name: "3ème Tranche", amount: "150 000", date: "Avant 1er Avr 2027", status: "non-payé" },
                              ].map((row, i) => (
                                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                  <td className="py-6 px-8 font-black text-[#1E293B]">{row.name}</td>
                                  <td className="py-6 px-8 font-bold text-gray-500">{row.amount} FCFA</td>
                                  <td className="py-6 px-8 font-bold text-gray-400 text-sm italic">{row.date}</td>
                                  <td className="py-6 px-8 text-right">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${
                                      row.status === 'payé' 
                                      ? 'bg-green-50 text-green-600 border-green-100' 
                                      : row.status === 'en-cours'
                                      ? 'bg-blue-50 text-blue-500 border-blue-100'
                                      : 'bg-orange-50 text-orange-500 border-orange-100'
                                    }`}>
                                      {row.status === 'payé' ? 'Validé' : (row.status === 'en-cours' ? 'À vérifier' : 'À payer')}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </section>

                        {/* Others Fees Section */}
                        <section className="space-y-6">
                           <h4 className="text-lg font-black text-[#1E1B4B] px-2 flex items-center gap-3">
                             <div className="w-1.5 h-6 bg-[#8178B1] rounded-full" />
                             Autres Frais Complémentaires
                           </h4>
                           <div className="grid grid-cols-2 gap-6">
                             {[
                               { label: "Frais de Stage", amount: "25 000" },
                               { label: "Frais de Dossier", amount: "10 000" },
                               { label: "Uniforme & Équipement", amount: "45 000" },
                               { label: "Excursion Académique", amount: "15 000" }
                             ].map((f, i) => (
                               <div 
                                 key={i} 
                                 onClick={() => {
                                   setSelectedPaymentType(f.label);
                                   setFinanceStatus('idle');
                                 }}
                                 className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between group ${
                                   selectedPaymentType === f.label && financeStatus === 'idle'
                                   ? 'bg-[#8178B1]/5 border-[#8178B1] shadow-lg shadow-[#8178B1]/5' 
                                   : 'bg-white border-gray-100 hover:border-[#8178B1]/30 hover:bg-gray-50/50'
                                 }`}
                               >
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{f.label}</p>
                                    <p className="text-lg font-black text-[#1E293B]">{f.amount} FCFA</p>
                                  </div>
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                    selectedPaymentType === f.label && financeStatus === 'idle'
                                    ? 'bg-[#8178B1] text-white' 
                                    : 'bg-gray-50 text-gray-300 group-hover:bg-[#8178B1]/10 group-hover:text-[#8178B1]'
                                  }`}>
                                    <PlusCircle size={18} />
                                  </div>
                               </div>
                             ))}
                           </div>
                        </section>
                      </div>

                      {/* Right: Payment Action */}
                      <div className="space-y-8">
                        <section className="bg-[#1E1B4B] p-10 rounded-[40px] text-white space-y-8 relative overflow-hidden">
                           <div className="relative z-10">
                             <h4 className="text-xl font-black mb-4 underline decoration-[#8178B1] decoration-4 underline-offset-8">Effectuer un paiement</h4>
                             <p className="text-white/50 font-bold text-xs leading-relaxed">
                               Choisissez le type de frais et joignez votre preuve de paiement (Reçu bancaire ou capture mobile).
                             </p>
                           </div>

                           <div className="flex-1 flex flex-col justify-center gap-6 relative z-10">
                             {financeStatus === 'idle' ? (
                               <>
                                 <div className="space-y-2">
                                   <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Type de frais</label>
                                   <select 
                                     value={selectedPaymentType}
                                     onChange={(e) => setSelectedPaymentType(e.target.value)}
                                     className="w-full bg-white/10 border border-white/10 px-6 py-4 rounded-2xl text-[13px] font-bold text-white outline-none focus:bg-white/20 transition-all appearance-none cursor-pointer"
                                   >
                                      <option className="bg-[#1E1B4B]">Paiement de Tranche 2</option>
                                      <option className="bg-[#1E1B4B]">Paiement de Tranche 3</option>
                                      <option className="bg-[#1E1B4B]">Frais de Stage</option>
                                      <option className="bg-[#1E1B4B]">Frais de Dossier</option>
                                      <option className="bg-[#1E1B4B]">Excursion Académique</option>
                                      <option className="bg-[#1E1B4B]">Uniforme & Équipement</option>
                                   </select>
                                 </div>

                                 <div className="space-y-2">
                                   <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Justificatif (PDF / Image)</label>
                                   <div 
                                     onClick={() => document.getElementById('receipt-upload')?.click()}
                                     className={`relative group/upload h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                                       paymentReceipt 
                                       ? 'border-green-500 bg-green-500/10' 
                                       : 'border-white/20 hover:border-[#8178B1] hover:bg-white/5'
                                     }`}
                                   >
                                      {paymentReceipt ? (
                                        <>
                                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                                            <CheckCircle2 size={24} className="text-white" />
                                          </div>
                                          <p className="text-[10px] font-black text-white truncate max-w-[80%] px-4">{paymentReceipt.name}</p>
                                          <p className="text-[8px] font-bold text-green-500 uppercase tracking-widest">Document prêt</p>
                                        </>
                                      ) : (
                                        <>
                                          <Upload size={24} className="text-white/40 group-hover/upload:text-[#8178B1] transition-colors" />
                                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover/upload:text-white transition-colors text-center px-4">Cliquez pour joindre le reçu</p>
                                        </>
                                      )}
                                      <input 
                                        id="receipt-upload"
                                        type="file" 
                                        className="hidden" 
                                        onChange={(e) => setPaymentReceipt(e.target.files?.[0] || null)}
                                        accept="image/*,.pdf"
                                      />
                                   </div>
                                 </div>

                                 <button 
                                   onClick={() => {
                                     if (!paymentReceipt) {
                                       alert("Veuillez joindre votre justificatif avant de transmettre.");
                                       return;
                                     }
                                     setFinanceStatus('pending');
                                   }}
                                   className="w-full bg-[#8178B1] text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-[#6D63A3] transition-all shadow-xl shadow-black/20"
                                 >
                                   Transmettre au secrétariat
                                 </button>
                               </>
                             ) : financeStatus === 'pending' ? (
                               <div className="text-center space-y-6 py-4">
                                 <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                                   <Clock className="text-[#8178B1] animate-pulse" size={32} />
                                 </div>
                                 <div className="space-y-2">
                                   <h5 className="text-lg font-black italic">En attente de validation...</h5>
                                   <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                                     Le secrétariat examine actuellement votre justificatif pour<br/>
                                     <span className="text-[#8178B1] text-xs underline decoration-white/10 underline-offset-4">{selectedPaymentType}</span>
                                   </p>
                                 </div>
                                 <div className="pt-4">
                                   <p className="text-[9px] text-white/30 font-black italic mb-4">Après validation, vous pourrez télécharger votre reçu</p>
                                   <button 
                                     onClick={() => setFinanceStatus('validated')}
                                     className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black text-white/20 uppercase tracking-[0.2em] transition-all hover:text-[#8178B1]"
                                   >
                                     [ Simulation : Valider le paiement ]
                                   </button>
                                 </div>
                               </div>
                             ) : (
                               <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                                 <div className="w-24 h-24 bg-white text-[#8178B1] rounded-3xl rotate-12 flex items-center justify-center mx-auto shadow-2xl shadow-[#8178B1]/40">
                                   <CheckCircle2 size={48} className="-rotate-12" />
                                 </div>
                                 <div className="space-y-3">
                                   <h5 className="text-2xl font-black">{selectedPaymentType} Payé !</h5>
                                   <p className="text-[11px] text-white/60 font-medium leading-relaxed px-4">
                                     Votre paiement a été validé avec succès. Vous pouvez maintenant récupérer votre reçu officiel signé.
                                   </p>
                                 </div>
                                 <div className="space-y-3 px-4">
                                   <button 
                                      onClick={() => {
                                        if (currentUser?.receipt_url) {
                                          window.open(currentUser.receipt_url, '_blank');
                                        } else {
                                          alert("Votre reçu officiel est en cours de génération par le secrétariat.");
                                        }
                                      }}
                                      className="w-full bg-white text-[#1E1B4B] py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all flex items-center justify-center gap-3"
                                    >
                                      Télécharger le reçu <Download size={18} />
                                    </button>
                                   <button 
                                     onClick={() => {
                                       setFinanceStatus('idle');
                                       setPaymentReceipt(null);
                                     }}
                                     className="w-full border border-white/10 text-white/40 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all"
                                   >
                                     Effectuer un autre paiement
                                   </button>
                                 </div>
                               </div>
                             )}
                           </div>
                           
                           <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#8178B1]/10 rounded-full blur-3xl -mb-24 -mr-24" />
                        </section>

                         <section className="bg-white p-8 rounded-[40px] border border-gray-100 flex items-center justify-between">
                           <div>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Dernière validation</p>
                             <p className="font-black text-[#1E293B]">
                               {financeStatus === 'validated' ? "À l'instant" : "12 Déc. 2026 à 14:30"}
                             </p>
                           </div>
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                             financeStatus === 'validated' ? 'bg-green-100 text-green-500' : 'bg-gray-50 text-gray-200'
                           }`}>
                             <CheckCircle2 size={24} />
                           </div>
                        </section>
                      </div>
                    </div>
                  </main>
                )}

                {dashboardTab === 'Planning' && (
                  <main className="max-w-[1400px] mx-auto space-y-8 pt-6 h-full flex flex-col">
                    {/* Calendar Header */}
                    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4">
                      <div className="space-y-1">
                        <h2 className="text-3xl font-black text-[#1E293B] tracking-tight">Mon Emploi du Temps</h2>
                        <p className="text-gray-400 font-bold text-sm">Semaine du 24 au 29 Juin 2026</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                          {['Semaine', 'Mois', 'Année'].map((v) => (
                            <button key={v} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${v === 'Semaine' ? 'bg-[#8178B1] text-white shadow-lg shadow-[#8178B1]/20' : 'text-gray-400 hover:text-gray-600'}`}>
                              {v}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                           <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#8178B1] transition-all shadow-sm">
                              <ChevronLeft size={20} />
                           </button>
                           <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#8178B1] transition-all shadow-sm">
                              <ChevronRight size={20} />
                           </button>
                        </div>
                      </div>
                    </header>

                    {/* Integrated Planning Grid */}
                    <section className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden flex flex-col flex-1 min-h-[700px]">
                      {/* Grid Headers: Days */}
                      <div className="grid grid-cols-[100px_repeat(6,1fr)] bg-gray-50/50 border-b border-gray-100">
                        <div className="h-20 flex items-center justify-center border-r border-gray-100">
                           <Clock size={20} className="text-gray-300" />
                        </div>
                        {['LUN 24', 'MAR 25', 'MER 26', 'JEU 27', 'VEN 28', 'SAM 29'].map((day, i) => (
                          <div key={i} className={`h-20 flex flex-col items-center justify-center border-r border-gray-100 last:border-r-0 ${day.includes('25') ? 'bg-[#8178B1]/5' : ''}`}>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${day.includes('25') ? 'text-[#8178B1]' : 'text-gray-400'}`}>{day.split(' ')[0]}</span>
                            <span className={`text-xl font-black ${day.includes('25') ? 'text-[#8178B1]' : 'text-[#1E293B]'}`}>{day.split(' ')[1]}</span>
                          </div>
                        ))}
                      </div>

                      {/* Scrollable Time Grid */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                        {/* Time Grid Lines */}
                        <div className="grid grid-cols-[100px_repeat(6,1fr)] min-h-[900px]">
                          {/* Time Slots Labels */}
                          <div className="bg-gray-50/30 border-r border-gray-100">
                            {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((h) => (
                              <div key={h} className="h-[100px] border-b border-gray-50 flex flex-col items-center justify-start p-4">
                                <span className="text-[11px] font-black text-gray-400">{h}h00</span>
                              </div>
                            ))}
                          </div>

                          {/* Day Columns BG */}
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="relative border-r border-gray-50 last:border-r-0">
                               {/* Grid lines */}
                               {Array.from({ length: 10 }).map((_, h) => (
                                 <div key={h} className="h-[100px] border-b border-gray-50" />
                               ))}
                               
                               {/* Saturday Afternoon Blockage */}
                               {i === 5 && (
                                 <div className="absolute top-[400px] bottom-0 inset-x-0 bg-gray-50/80 backdrop-blur-[1px] flex items-center justify-center">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] rotate-90">Libre</span>
                                 </div>
                               )}

                               {/* Lunch Break shared across all days */}
                               <div className="absolute top-[400px] h-[200px] inset-x-0 bg-[#8178B1]/[0.02] border-y border-gray-100 pointer-events-none flex items-center justify-center">
                                  <div className="px-6 py-2 bg-white/80 rounded-full border border-gray-100 shadow-sm opacity-50">
                                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pause Déjeuner</span>
                                  </div>
                               </div>
                            </div>
                          ))}
                        </div>

                        {/* Lessons Content (Absolute Positioning over the grid) */}
                        <div className="absolute top-0 left-[100px] right-0 bottom-0 pointer-events-none">
                          <div className="grid grid-cols-6 h-full">
                            {/* Schedule Data Example: 8h-12h and 14h-17h */}
                            {/* Monday */}
                            <div className="relative h-full px-2 pt-0.5">
                               <div className="absolute top-[0px] h-[400px] left-2 right-2 p-2 pointer-events-auto">
                                  <div className="h-full bg-[#8178B1]/10 border-l-4 border-[#8178B1] rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                                     <span className="text-[9px] font-black text-[#8178B1] uppercase tracking-widest block mb-2">08h00 - 12h00</span>
                                     <h5 className="font-black text-sm text-[#1E293B] group-hover:text-[#8178B1] transition-colors">Algorithmique & C++</h5>
                                     <p className="text-[10px] text-gray-400 font-bold mt-2">Salle 102 • Pr. Yao</p>
                                  </div>
                               </div>
                               <div className="absolute top-[600px] h-[300px] left-2 right-2 p-2 pointer-events-auto">
                                  <div className="h-full bg-blue-50 border-l-4 border-blue-400 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                                     <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-2">14h00 - 17h00</span>
                                     <h5 className="font-black text-sm text-[#1E293B] group-hover:text-blue-500 transition-colors">Anglais Technique</h5>
                                     <p className="text-[10px] text-gray-400 font-bold mt-2">CM • Mme Koulibaly</p>
                                  </div>
                               </div>
                            </div>

                            {/* Tuesday */}
                            <div className="relative h-full px-2 pt-0.5">
                               <div className="absolute top-[100px] h-[300px] left-2 right-2 p-2 pointer-events-auto">
                                  <div className="h-full bg-teal-50 border-l-4 border-teal-400 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                                     <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest block mb-2">09h00 - 12h00</span>
                                     <h5 className="font-black text-sm text-[#1E293B]">Physique Appliquée</h5>
                                     <p className="text-[10px] text-gray-400 font-bold mt-2">Labo 04 • M. Koffi</p>
                                  </div>
                               </div>
                               <div className="absolute top-[600px] h-[200px] left-2 right-2 p-2 pointer-events-auto">
                                  <div className="h-full bg-rose-50 border-l-4 border-rose-400 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                                     <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest block mb-2">14h00 - 16h00</span>
                                     <h5 className="font-black text-sm text-[#1E293B]">Maintenance PC</h5>
                                     <p className="text-[10px] text-gray-400 font-bold mt-2">Atelier • M. Saliou</p>
                                  </div>
                               </div>
                            </div>

                            {/* Wednesday */}
                            <div className="relative h-full px-2 pt-0.5">
                               <div className="absolute top-[0px] h-[300px] left-2 right-2 p-2 pointer-events-auto">
                                  <div className="h-full bg-amber-50 border-l-4 border-amber-400 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                                     <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-2">08h00 - 11h00</span>
                                     <h5 className="font-black text-sm text-[#1E293B]">Base de Données</h5>
                                     <p className="text-[10px] text-gray-400 font-bold mt-2">Salle 204 • Mme Gnaho</p>
                                  </div>
                               </div>
                               <div className="absolute top-[300px] h-[100px] left-2 right-2 p-2 pointer-events-auto">
                                  <div className="h-full bg-gray-50 border-l-4 border-gray-400 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                                     <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2">11h00 - 12h00</span>
                                     <h5 className="font-black text-sm text-[#1E293B]">Conférence</h5>
                                     <p className="text-[10px] text-gray-400 font-bold mt-1">Amphi A</p>
                                  </div>
                               </div>
                            </div>

                            {/* Thursday */}
                            <div className="relative h-full px-2 pt-0.5">
                               <div className="absolute top-[0px] h-[400px] left-2 right-2 p-2 pointer-events-auto">
                                  <div className="h-full bg-[#8178B1]/10 border-l-4 border-[#8178B1] rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                                     <span className="text-[9px] font-black text-[#8178B1] uppercase tracking-widest block mb-2">08h00 - 12h00</span>
                                     <h5 className="font-black text-sm text-[#1E293B]">Génie Logiciel</h5>
                                     <p className="text-[10px] text-gray-400 font-bold mt-2">Salle 102 • M. Saliou</p>
                                  </div>
                               </div>
                            </div>

                            {/* Friday */}
                            <div className="relative h-full px-2 pt-0.5">
                               <div className="absolute top-[100px] h-[300px] left-2 right-2 p-2 pointer-events-auto">
                                  <div className="h-full bg-emerald-50 border-l-4 border-emerald-400 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                                     <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-2">09h00 - 12h00</span>
                                     <h5 className="font-black text-sm text-[#1E293B]">Mathématiques</h5>
                                     <p className="text-[10px] text-gray-400 font-bold mt-2">Amphi B • Pr. Yao</p>
                                  </div>
                               </div>
                            </div>

                            {/* Saturday */}
                            <div className="relative h-full px-2 pt-0.5">
                               <div className="absolute top-[0px] h-[400px] left-2 right-2 p-2 pointer-events-auto">
                                  <div className="h-full bg-indigo-50 border-l-4 border-indigo-400 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                                     <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block mb-2">08h00 - 12h00</span>
                                     <h5 className="font-black text-sm text-[#1E293B]">TP Réseaux</h5>
                                     <p className="text-[10px] text-gray-400 font-bold mt-2">CISCO Academy • M. Gnabo</p>
                                  </div>
                               </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </main>
                )}

                {dashboardTab === 'Notifications' && (
                  <main className="max-w-4xl mx-auto space-y-10 py-10">
                    <header className="flex items-center justify-between px-2">
                       <div>
                          <h2 className="text-3xl font-black text-[#1E293B] tracking-tight">Vos Notifications</h2>
                          <p className="text-gray-400 font-bold text-sm mt-1">Gérez vos alertes administratives et académiques</p>
                       </div>
                       <button className="text-[10px] font-black uppercase tracking-widest text-[#8178B1] hover:underline">Tout marquer comme lu</button>
                    </header>

                    <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl w-fit">
                       {['Tout', 'Secrétariat', 'Cours', 'Finances'].map((v, i) => (
                          <button key={i} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-white text-[#8178B1] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                             {v}
                          </button>
                       ))}
                    </div>

                    <div className="space-y-4">
                       {[
                          { title: "Action requise : Carte d'étudiant", msg: "Vous devez fournir des dossiers pour la création de votre carte d'étudiant 2026/2027.", date: "Il y a 2h", type: "Secrétariat", icon: <Files size={18} />, color: "text-blue-500 bg-blue-50" },
                          { title: "Prochain cours : Algorithmique", msg: "N'oubliez pas votre cours demain à 08h00 en salle 102.", date: "Il y a 5h", type: "Cours", icon: <Clock size={18} />, color: "text-[#8178B1] bg-[#8178B1]/10" },
                          { title: "Statut Paiement", msg: "Votre premier versement de 325 000 F a été validé avec succès.", date: "Hier", type: "Finances", icon: <CheckCircle2 size={18} />, color: "text-green-500 bg-green-50" },
                          { title: "Devoir à rendre", msg: "Le TP de Réseaux est attendu pour le samedi 29 Juin avant 12h00.", date: "2 jours", type: "Cours", icon: <ClipboardList size={18} />, color: "text-orange-500 bg-orange-50" }
                       ].map((notif, i) => (
                          <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start gap-6 group">
                             <div className={`w-12 h-12 ${notif.color} rounded-2xl flex items-center justify-center shrink-0`}>
                                {notif.icon}
                             </div>
                             <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                   <h4 className="font-black text-base text-[#1E293B]">{notif.title}</h4>
                                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{notif.date}</span>
                                </div>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-3">{notif.msg}</p>
                                <span className="inline-block px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-100">{notif.type}</span>
                             </div>
                          </div>
                       ))}
                    </div>
                  </main>
                )}

                {dashboardTab === 'Dossiers à fournir' && (
                  <main className="max-w-4xl mx-auto space-y-10 py-10">
                    <header className="px-2">
                       <h2 className="text-3xl font-black text-[#1E293B] tracking-tight">Documents Académiques</h2>
                       <p className="text-gray-400 font-bold text-sm mt-1">Liste des dossiers requis pour votre cursus actuel</p>
                    </header>

                    <div className="grid gap-6">
                       <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
                          <div className="flex items-center gap-6 mb-8">
                             <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                                <Files size={32} />
                             </div>
                             <div>
                                <h3 className="text-xl font-black text-[#1E293B]">Stage de fin d'année</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Période : Juillet - Septembre</p>
                             </div>
                          </div>
                          
                          <div className="space-y-4">
                             {[
                                { name: "Convention de stage signée", status: "Requis" },
                                { name: "Rapport de stage final", status: "À fournir après le stage" },
                                { name: "Attestation de fin de stage", status: "À fournir après le stage" }
                             ].map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl">
                                   <span className="font-bold text-sm text-[#1E293B]">{doc.name}</span>
                                   <span className="px-4 py-1.5 bg-white border border-gray-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400">{doc.status}</span>
                                </div>
                             ))}
                          </div>
                       </section>

                       <section className="bg-[#1E1B4B] p-10 rounded-[40px] text-white shadow-xl group">
                          <div className="flex items-center gap-6 mb-8">
                             <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                                <User size={32} />
                             </div>
                             <div>
                                <h3 className="text-xl font-black">Carte d'Étudiant 26-27</h3>
                                <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Action Immédiate</p>
                             </div>
                          </div>
                          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between">
                             <p className="text-sm font-medium text-white/70">Veuillez fournir une photo d'identité récente au format numérique.</p>
                             <button className="bg-[#8178B1] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#8178B1] transition-all">Téléverser</button>
                          </div>
                       </section>
                    </div>
                  </main>
                )}

                {dashboardTab === 'Validation Paiement' && (
                  <div className="max-w-4xl mx-auto space-y-10">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight text-center">Statut de validation du paiement</h2>
                    
                    <div className="bg-white p-12 rounded-[50px] border border-gray-100 shadow-2xl flex flex-col items-center text-center">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${isReceiptAccepted ? 'bg-green-100 text-green-500' : 'bg-[#8178B1]/10 text-[#8178B1]'}`}>
                        {isReceiptAccepted ? <CheckCircle2 size={48} /> : <Clock size={48} className="animate-pulse" />}
                      </div>
                      
                      <h3 className="text-2xl font-black text-gray-900 mb-4">
                        {isReceiptAccepted ? 'Paiement Validé !' : 'Vérification en cours'}
                      </h3>
                      
                      <p className="text-gray-500 font-medium max-w-md mb-10 leading-relaxed">
                        {isReceiptAccepted 
                          ? "Votre reçu a été validé par le secrétariat comptable. Votre inscription est désormais définitive."
                          : "Le secrétaire comptable examine actuellement votre reçu de paiement. Cela prend généralement moins de 24h ouvrées."}
                      </p>

                      {!isReceiptAccepted && (
                        <div className="p-6 bg-[#8178B1]/5 rounded-3xl border border-[#8178B1]/10 w-full max-w-sm">
                          <p className="text-[10px] font-black text-[#8178B1] uppercase tracking-widest mb-2 text-left">Document envoyé</p>
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                              <Files size={20} className="text-gray-400" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="text-sm font-bold text-gray-800 truncate">{receipt?.name || 'Recu_Paiement.pdf'}</p>
                              <p className="text-[10px] text-gray-400">En attente de signature</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={() => setIsReceiptAccepted(!isReceiptAccepted)}
                        className="mt-10 text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-[#8178B1] transition-colors"
                      >
                        [ Simulation : {isReceiptAccepted ? 'Annuler validation' : 'Accepter reçu'} ]
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'statut':
        const steps = [
          { label: 'Dépôt des dossiers', status: isSubmitted ? 'valid' : 'pending', desc: 'Vérification automatique des fichiers' },
          { label: 'Validation Secrétariat', status: isSubmitted ? 'valid' : 'pending', desc: 'Examen de la conformité par nos agents' },
          { label: 'Validation Paiement', status: 'pending', desc: 'Vérification du reçu de virement' },
          { label: 'Inscription Officielle', status: 'pending', desc: 'Génération de la carte d\'étudiant' },
        ];
        return (
          <div className="flex flex-col gap-10">
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black uppercase tracking-tight">Statut de mon Dossier</h3>
                {isSubmitted && (
                  <div className="bg-[#8178B1]/10 px-6 py-3 rounded-2xl border border-[#8178B1]/20">
                    <p className="text-[10px] font-black text-[#8178B1] uppercase tracking-widest mb-1">Matricule</p>
                    <p className="text-lg font-black text-[#8178B1]">24-FAU-0042</p>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                <div className="space-y-12">
                  {steps.map((step, i) => (
                    <div key={i} className="relative flex items-start gap-10">
                      <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${step.status === 'valid' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                        {step.status === 'valid' ? <CheckCircle2 size={28} /> : <span className="text-xl font-black">{i + 1}</span>}
                      </div>
                      <div className="pt-2">
                        <h4 className={`font-black text-lg ${step.status === 'valid' ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</h4>
                        <p className="text-sm text-gray-500 font-medium mt-1">{step.desc}</p>
                        {step.status === 'valid' && (
                          <span className="inline-block mt-3 text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">Validé</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'paiement':
        return (
          <div className="flex flex-col gap-10">
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-10">Paiement</h3>

              {!isSubmitted ? (
                <div className="bg-gray-50 p-10 rounded-[32px] text-center border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CreditCard size={32} />
                  </div>
                  <h4 className="text-xl font-black text-gray-400 uppercase tracking-tight mb-2">Paiement inactif</h4>
                  <p className="text-gray-400 font-medium">Cette page sera active après la validation de votre dossier par le secrétariat.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Section 1: Récapitulatif */}
                  <div className="space-y-8">
                    <h4 className="text-xs font-black text-[#8178B1] uppercase tracking-[0.25em] flex items-center gap-2">
                      <Banknote size={16} /> Section 1 : Tableau récapitulatif
                    </h4>
                    <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left p-5 font-black uppercase text-[10px] tracking-widest text-gray-500">Désignation</th>
                            <th className="text-right p-5 font-black uppercase text-[10px] tracking-widest text-gray-500">Montant</th>
                          </tr>
                        </thead>
                        <tbody className="font-bold">
                          <tr className="border-t border-gray-100">
                            <td className="p-5">Droits d'inscription</td>
                            <td className="p-5 text-right">50 000 FCFA</td>
                          </tr>
                          <tr className="border-t border-gray-100">
                            <td className="p-5">1ère Tranche</td>
                            <td className="p-5 text-right">250 000 FCFA</td>
                          </tr>
                          <tr className="border-t border-gray-100">
                            <td className="p-5">2ème Tranche</td>
                            <td className="p-5 text-right">200 000 FCFA</td>
                          </tr>
                          <tr className="border-t border-gray-100">
                            <td className="p-5">3ème Tranche</td>
                            <td className="p-5 text-right">150 000 FCFA</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 2 & 3 */}
                  <div className="space-y-10">
                    <div className="space-y-6">
                      <h4 className="text-xs font-black text-[#8178B1] uppercase tracking-[0.25em] flex items-center gap-2">
                        <Info size={16} /> Section 2 : Infos Bancaires
                      </h4>
                      <div className="bg-[#8178B1]/5 p-8 rounded-3xl border border-[#8178B1]/10">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-[10px] font-black text-[#8178B1] uppercase tracking-widest">Banque</p>
                          <p className="font-black text-gray-800">ECOBANK</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-black text-[#8178B1] uppercase tracking-widest">Numéro de compte</p>
                          <p className="font-black text-gray-800">CI059 01001 1234567890 42</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-xs font-black text-[#8178B1] uppercase tracking-[0.25em] flex items-center gap-2">
                        <Upload size={16} /> Section 3 : Zone de Validation
                      </h4>
                      <div className="bg-white border-2 border-dashed border-gray-200 p-8 rounded-[32px] flex flex-col items-center gap-4">
                        <p className="text-xs font-bold text-gray-500">Veuillez scanner et envoyer le reçu</p>
                        <div className="relative">
                          <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">
                            {receipt ? receipt.name : 'Choisir le fichier'}
                          </button>
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setReceipt(e.target.files?.[0] || null)} />
                        </div>
                        <button
                          onClick={() => {
                            if (receipt) setIsPaymentValidated(true);
                          }}
                          className="w-full bg-[#8178B1] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#6D63A3] transition-all shadow-lg shadow-[#8178B1]/20 active:scale-95"
                        >
                          Envoyer le reçu
                        </button>
                        {receipt && !isPaymentValidated && (
                          <div className="flex items-center gap-2 text-orange-500">
                            <AlertCircle size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">En attente de validation par le secrétaire</span>
                          </div>
                        )}
                        {isPaymentValidated && (
                          <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle2 size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Payé et validé</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'documents':
        const docList = [
          { key: 'acteNaissance', label: 'Acte de naissance' },
          { key: 'photoIdentite', label: 'Photo d\'identité' },
          { key: 'attestationBac', label: 'Attestation du Bac' },
          { key: 'bulletinsNotes', label: 'Bulletins de notes' },
        ];
        return (
          <div className="flex flex-col gap-10">
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-10">Mes Documents</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {docList.map((d) => {
                  const file = docs[d.key as keyof DocumentState];
                  return (
                    <div key={d.key} className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 transition-all">
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${file ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                          <Files size={28} />
                        </div>
                        <div>
                          <p className="font-black text-base">{d.label}</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${file ? 'text-green-600' : 'text-gray-400'}`}>
                            {file ? 'Fichier envoyé' : 'Non fourni'}
                          </p>
                        </div>
                      </div>

                      {file && (
                        <div className="flex items-center gap-2">
                          <button className="p-3 bg-white text-[#8178B1] rounded-xl hover:bg-[#8178B1] hover:text-white transition-all shadow-sm"><Eye size={18} /></button>
                          <button className="p-3 bg-white text-[#8178B1] rounded-xl hover:bg-[#8178B1] hover:text-white transition-all shadow-sm"><Download size={18} /></button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#8178B1]/20 border-t-[#8178B1] rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Chargement de votre session...</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#F9FAFB] flex font-sans text-[#2D2D2D] relative">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      
      {/* Sidebar removed as per user request */}

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto w-full transition-all flex flex-col ${currentPage === 'resume' ? 'p-6 bg-[#F0EEF9] overflow-hidden justify-center' : 'p-12 lg:p-16'}`}>
        {isSubmitted && currentPage !== 'resume' && (
          <header className="flex justify-between items-center mb-16 shrink-0 z-50">
            <div className="flex items-center gap-8">
              {currentUser && (
                <div className="flex flex-col">
                  <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-800">
                    Bienvenue, <span className="text-[#8178B1]">{currentUser.firstname} {currentUser.lastname}</span>
                  </h1>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#8178B1] opacity-60">Espace Étudiant • Session 2025-2026</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 relative">
              {/* Other icons removed as per user request */}
            </div>
          </header>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            className={currentPage === 'resume' ? "h-full w-full flex" : ""}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
