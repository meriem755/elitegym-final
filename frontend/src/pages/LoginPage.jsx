import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ROLE_ROUTES } from '../contexts/AuthContext';

export default function LoginPage() {
  const [telephone, setTelephone] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ On prend `login` depuis le contexte (pas api directement)
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ login() du contexte reçoit (telephone, motDePasse) → appelle api.login()
      const result = await login(telephone, motDePasse);

      // ✅ Redirection basée sur le rôle retourné par le backend
      const role = result.user.role?.toLowerCase();
      const destination = ROLE_ROUTES[role] || '/';
      navigate(destination, { replace: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.bgShape1} />
      <div style={S.bgShape2} />

      <div style={S.card}>
        {/* Logo */}
        <div style={S.logoRow}>
          <span style={S.logoDot} />
          <span style={S.logoText}>ÉLITE GYM</span>
        </div>

        <h1 style={S.title}>Connexion</h1>
        <p style={S.subtitle}>Entrez votre numéro de téléphone et votre mot de passe</p>

        {/* Bandeau info */}
        <div style={S.notice}>
          <span style={S.noticeIcon}>ℹ</span>
          <div>
            <strong style={{ color: 'var(--text)' }}>Pas encore membre ?</strong>
            <br />
            L'inscription se fait uniquement en salle. Présentez-vous à l'accueil.
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Téléphone */}
          <div style={S.field}>
            <label style={S.label}>Numéro de téléphone</label>
            <div style={S.inputWrapper}>
              <span style={S.inputIcon}>📱</span>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="05 XX XX XX XX"
                required
                autoComplete="tel"
                style={S.input}
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div style={S.field}>
            <label style={S.label}>Mot de passe</label>
            <div style={S.inputWrapper}>
              <span style={S.inputIcon}>🔒</span>
              <input
                type={showPwd ? 'text' : 'password'}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••"
                required
                style={{ ...S.input, paddingRight: 48 }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={S.eyeBtn}
                aria-label="Afficher/masquer le mot de passe"
              >
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Message d'erreur */}
          {error && <div style={S.errorBox}>⚠️ {error}</div>}

          {/* Bouton connexion */}
          <button
            type="submit"
            disabled={loading}
            style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '⟳ Connexion...' : 'Se connecter →'}
          </button>
        </form>

        <div style={S.backRow}>
          <Link to="/" style={S.backLink}>← Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg)', position: 'relative', overflow: 'hidden', padding: '1rem',
  },
  bgShape1: {
    position: 'absolute', width: 500, height: 500, borderRadius: '50%',
    background: 'rgba(59,130,246,0.07)', top: -150, right: -100, pointerEvents: 'none',
  },
  bgShape2: {
    position: 'absolute', width: 350, height: 350, borderRadius: '50%',
    background: 'rgba(59,130,246,0.05)', bottom: -100, left: -80, pointerEvents: 'none',
  },
  card: {
    position: 'relative', zIndex: 1, width: '100%', maxWidth: 420,
    background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16,
    padding: '2.2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' },
  logoDot: {
    width: 10, height: 10, borderRadius: '50%',
    background: 'var(--accent)', display: 'inline-block',
  },
  logoText: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem',
    letterSpacing: 3, color: 'var(--text)',
  },
  title: { fontSize: '1.7rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.3rem' },
  subtitle: { color: 'var(--text2)', fontSize: '0.88rem', marginBottom: '1.4rem', lineHeight: 1.5 },
  notice: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
    borderRadius: 10, padding: '0.85rem', marginBottom: '1.5rem',
    fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.55,
  },
  noticeIcon: { color: 'var(--accent)', fontStyle: 'normal', marginTop: 1, flexShrink: 0 },
  field: { marginBottom: '1.1rem' },
  label: {
    display: 'block', fontSize: '0.77rem', fontWeight: 700, letterSpacing: '0.5px',
    color: 'var(--text2)', marginBottom: '0.35rem', textTransform: 'uppercase',
  },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: 12, fontSize: '1rem', pointerEvents: 'none' },
  input: {
    width: '100%', padding: '0.7rem 0.9rem 0.7rem 2.6rem',
    background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10,
    color: 'var(--text)', fontSize: '0.93rem', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s',
  },
  eyeBtn: {
    position: 'absolute', right: 10, background: 'none',
    border: 'none', cursor: 'pointer', fontSize: '1rem', padding: 4,
  },
  errorBox: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8, padding: '0.7rem 1rem', color: '#ef4444',
    fontSize: '0.85rem', marginBottom: '1rem',
  },
  submitBtn: {
    width: '100%', padding: '0.85rem', background: 'var(--accent)', color: '#fff',
    border: 'none', borderRadius: 10, fontSize: '0.95rem', fontWeight: 700,
    letterSpacing: '0.5px', cursor: 'pointer', fontFamily: 'inherit', marginTop: '0.4rem',
  },
  backRow: { textAlign: 'center', marginTop: '1.4rem' },
  backLink: { color: 'var(--text2)', fontSize: '0.84rem', textDecoration: 'none' },
};
