import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DashboardSecretaire from './DashboardSecretaire.tsx';
import './index_secretaire.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DashboardSecretaire />
    </StrictMode>
);
