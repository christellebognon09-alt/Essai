import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DashboardProfesseur from './DashboardProfesseur.tsx';
import './index_secretaire.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DashboardProfesseur />
    </StrictMode>
);
