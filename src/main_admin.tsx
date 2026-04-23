import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DashboardAdmin from './DashboardAdmin.tsx';
import './index_secretaire.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DashboardAdmin />
    </StrictMode>
);
