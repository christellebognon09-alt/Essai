import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DashboardComptable from './DashboardComptable.tsx';
import './index_secretaire.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DashboardComptable />
    </StrictMode>
);
