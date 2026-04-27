import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

// ── Pages des coéquipiers (décommentez au fur et à mesure) ──
// import MembrePage from './pages/MembrePage';      // Équipier A
// import CoachPage from './pages/CoachPage';        // Équipier B
// import AdminPage from './pages/AdminPage';        // Équipier C
// import ReceptionPage from './pages/ReceptionPage'; // Équipier D
// import GerantPage from './pages/GerantPage';      // Équipier E

// Placeholder en attendant les pages des coéquipiers
function Placeholder({ role }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', gap: 16,
      background: 'var(--bg)', color: 'var(--text)',
    }}>
      <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '3rem', letterSpacing: 3 }}>
        {role.toUpperCase()} DASHBOARD
      </h1>
      <p style={{ color: 'var(--text2)' }}>En cours de développement par votre coéquipier.</p>
      <a href="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← Retour à l'accueil</a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Pages publiques ── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ── Pages protégées par rôle ── */}
          <Route path="/membre" element={
            <ProtectedRoute allowedRoles={['membre']}>
              {/* <MembrePage /> */}
              <Placeholder role="membre" />
            </ProtectedRoute>
          } />

          <Route path="/coach" element={
            <ProtectedRoute allowedRoles={['coach']}>
              {/* <CoachPage /> */}
              <Placeholder role="coach" />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['administrateur']}>
              {/* <AdminPage /> */}
              <Placeholder role="administrateur" />
            </ProtectedRoute>
          } />

          <Route path="/reception" element={
            <ProtectedRoute allowedRoles={['receptionniste']}>
              {/* <ReceptionPage /> */}
              <Placeholder role="réceptionniste" />
            </ProtectedRoute>
          } />

          <Route path="/gerant" element={
            <ProtectedRoute allowedRoles={['gerant']}>
              {/* <GerantPage /> */}
              <Placeholder role="gérant" />
            </ProtectedRoute>
          } />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
