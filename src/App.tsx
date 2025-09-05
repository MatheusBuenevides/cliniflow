import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks';
import { ProtectedRoute } from './components/auth';
import { MainLayout } from './components/layout';
import { LoadingSpinner } from './components/ui';
import { AppProvider } from './stores';

// Lazy loading das páginas para otimização
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Agenda = React.lazy(() => import('./pages/Agenda'));
const Patients = React.lazy(() => import('./pages/Patients'));
const PatientDetail = React.lazy(() => import('./pages/PatientDetail'));
const Financials = React.lazy(() => import('./pages/Financials'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const PublicProfile = React.lazy(() => import('./pages/PublicProfile'));

// Componente de Loading para Suspense
const PageLoadingFallback = () => (
  <LoadingSpinner size="lg" text="Carregando página..." fullScreen />
);

// Componente Principal da Aplicação
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/:customUrl" element={<PublicProfile />} />
              
              {/* Rotas Protegidas */}
              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="agenda" element={<Agenda />} />
                <Route path="pacientes" element={<Patients />} />
                <Route path="pacientes/:id" element={<PatientDetail />} />
                <Route path="financeiro" element={<Financials />} />
                <Route path="configuracoes" element={<Settings />} />
              </Route>
              
              {/* Rota padrão - redireciona para dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}
