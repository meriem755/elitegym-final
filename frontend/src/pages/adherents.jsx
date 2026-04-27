
import { useState, useRef, useEffect, useCallback } from 'react';

// ─────────────────────────────────────────────
// DESIGN TOKENS & THEME
// ─────────────────────────────────────────────
const T = {
  aubergine: '#6c148b',
  orangeLight: '#6c148b',
  orangeGlow: 'rgba(232,80,10,0.18)',
  orangeGlow2: 'rgba(232,80,10,0.08)',
  bg: '#0A0C0F',
  bgCard: '#111418',
  bgCardHover: '#161A20',
  bgSurface: '#1A1F28',
  bgInput: '#0F1217',
  border: 'rgba(255,255,255,0.06)',
  borderHover: 'rgba(255,255,255,0.12)',
  borderOrange: 'rgba(232,80,10,0.35)',
  text: '#F0EDE8',
  textMuted: 'rgba(240,237,232,0.5)',
  textDim: 'rgba(240,237,232,0.28)',
  green: '#22C55E',
  red: '#EF4444',
  blue: '#3B82F6',
  font: "'Syne', 'Helvetica Neue', sans-serif",
  fontBody: "'DM Sans', 'Helvetica Neue', sans-serif",
};

const GS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body, #root { background: ${T.bg}; color: ${T.text}; font-family: ${T.fontBody}; min-height: 100vh; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: ${T.borderHover}; border-radius: 2px; }
input, select, textarea { font-family: ${T.fontBody}; }
button { font-family: ${T.fontBody}; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
.fade-up { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
.fade-up-1 { animation: fadeUp 0.45s 0.05s cubic-bezier(0.16,1,0.3,1) both; }
.fade-up-2 { animation: fadeUp 0.45s 0.1s cubic-bezier(0.16,1,0.3,1) both; }
.fade-up-3 { animation: fadeUp 0.45s 0.15s cubic-bezier(0.16,1,0.3,1) both; }
.fade-up-4 { animation: fadeUp 0.45s 0.2s cubic-bezier(0.16,1,0.3,1) both; }
.fade-up-5 { animation: fadeUp 0.45s 0.25s cubic-bezier(0.16,1,0.3,1) both; }
`;

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const PRODUCTS = [
  { id:1, name:'Whey Isolate 1kg', desc:'Isolée haute qualité', price:13700, cat:'nutrition', emoji:'🥛' },
  { id:2, name:'Créatine Monohydrate', desc:'500g, pureté 99.9%', price:6900, cat:'nutrition', emoji:'⚗️' },
  { id:3, name:'BCAA 2:1:1', desc:'Acides aminés branchés', price:1900, cat:'nutrition', emoji:'💊' },
  { id:4, name:'Barres Protéinées ×12', desc:'Collation pratique', price:2200, cat:'nutrition', emoji:'🍫' },
  { id:5, name:'Haltères 2×10kg', desc:'Néoprène antidérapant', price:3900, cat:'equipment', emoji:'🏋️' },
  { id:6, name:'Bande élastique Set', desc:'5 niveaux de résistance', price:1400, cat:'equipment', emoji:'🪀' },
  { id:7, name:'Tapis Premium', desc:'183×61cm, 10mm', price:2400, cat:'equipment', emoji:'🟧' },
  { id:8, name:'Sac Body Dream 40L', desc:'Compartiment chaussures', price:3400, cat:'accessories', emoji:'🎒' },
  { id:9, name:'Gants d\'entraînement', desc:'Protection paumes', price:1600, cat:'accessories', emoji:'🧤' },
  { id:10, name:'Shaker 700ml', desc:'Sans BPA, grille mélangeur', price:700, cat:'accessories', emoji:'🥤' },
];

const SESSIONS = {
  0:[{time:'09:00',type:'Musculation',coach:'Ahmed',name:'Full Body'},{time:'18:00',type:'CrossFit',coach:'Marc',name:'WOD Intense'}],
  1:[{time:'09:00',type:'Pilates',coach:'Sophie',name:'Pilates Mat'},{time:'18:00',type:'Zumba',coach:'Léa',name:'Zumba Fitness'}],
  2:[{time:'09:00',type:'Musculation',coach:'Ahmed',name:'Leg Day'},{time:'17:00',type:'Yoga',coach:'Emma',name:'Yoga Relax'}],
  3:[{time:'09:00',type:'Pilates',coach:'Sophie',name:'Pilates Ring'},{time:'18:00',type:'Zumba',coach:'Léa',name:'Zumba Gold'}],
  4:[{time:'09:00',type:'Musculation',coach:'Ahmed',name:'Pull Day'},{time:'18:30',type:'CrossFit',coach:'Marc',name:'Open Gym'}],
  5:[{time:'10:00',type:'Pilates',coach:'Sophie',name:'Pilates Advanced'},{time:'18:00',type:'Zumba',coach:'Léa',name:'Zumba Party'}],
  6:[{time:'10:00',type:'Yoga',coach:'Sahar',name:'Yoga Dimanche'}]
};

const DAY_NAMES = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];

const FOOD_DB = [
  { id:'poulet',name:'Blanc de poulet',cal:165,prot:31,gluc:0,lip:3.6 },
  { id:'riz',name:'Riz blanc (cuit)',cal:130,prot:2.7,gluc:28,lip:0.3 },
  { id:'oeuf',name:'Œuf entier',cal:155,prot:13,gluc:1.1,lip:11 },
  { id:'avoine',name:'Flocons d\'avoine',cal:389,prot:16.9,gluc:66,lip:6.9 },
  { id:'banane',name:'Banane',cal:89,prot:1.1,gluc:23,lip:0.3 },
  { id:'whey',name:'Whey Isolate (30g)',cal:120,prot:25,gluc:3,lip:1.5 },
  { id:'saumon',name:'Saumon',cal:208,prot:20,gluc:0,lip:13 },
  { id:'brocoli',name:'Brocoli',cal:34,prot:2.8,gluc:7,lip:0.4 },
  { id:'huile_olive',name:'Huile d\'olive (10ml)',cal:88,prot:0,gluc:0,lip:10 },
  { id:'pain',name:'Pain complet (1 tranche)',cal:80,prot:4,gluc:15,lip:1 },
  { id:'yaourt',name:'Yaourt nature 0%',cal:59,prot:10,gluc:3.6,lip:0.7 },
  { id:'amandes',name:'Amandes (30g)',cal:174,prot:6,gluc:6,lip:15 },
];

const PAYMENT_HISTORY = [
  { id:1,date:'01/04/2026',type:'Abonnement Premium',amount:'2 900 DA',status:'Payé' },
  { id:2,date:'15/03/2026',type:'Pack 10 Séances',amount:'4 000 DA',status:'Payé' },
  { id:3,date:'01/03/2026',type:'Abonnement Premium',amount:'2 900 DA',status:'Payé' },
];

const SLIDES = [
  { label:'FULL BODY', tag:'Ce soir 18:00', detail:'WOD Intense • Coach Marc', color:'#E8500A' },
  { label:'NUTRITION', tag:'Objectif masse', detail:'3000 kcal · P:160g · G:380g', color:'#22C55E' },
  { label:'SEMAINE', tag:'4 séances prévues', detail:'Lun · Mer · Jeu · Sam', color:'#3B82F6' },
];

const TARGETS = {
  masse:{cal:3000,prot:160,gluc:380,lip:90},
  seche:{cal:1800,prot:140,gluc:150,lip:60},
  maintien:{cal:2500,prot:130,gluc:280,lip:75}
};

// ─────────────────────────────────────────────
// MICRO COMPONENTS
// ─────────────────────────────────────────────
const Pill = ({ children, active, onClick, size = 'md' }) => (
  <button onClick={onClick} style={{
    padding: size === 'sm' ? '5px 14px' : '8px 20px',
    borderRadius: 100,
    border: active ? 'none' : `1px solid ${T.border}`,
    background: active ? T.orange : 'transparent',
    color: active ? '#fff' : T.textMuted,
    fontSize: size === 'sm' ? 12 : 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: T.fontBody,
    transition: 'all 0.2s',
    letterSpacing: '0.02em',
  }}>{children}</button>
);

const Card = ({ children, style = {}, className = '', onClick }) => (
  <div className={className} onClick={onClick} style={{
    background: T.bgCard,
    border: `1px solid ${T.border}`,
    borderRadius: 20,
    padding: '22px 24px',
    transition: 'border-color 0.2s, background 0.2s',
    ...style,
  }}>{children}</div>
);

const Input = ({ style = {}, ...props }) => (
  <input {...props} style={{
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: `1px solid ${T.border}`,
    background: T.bgInput,
    color: T.text,
    fontSize: 14,
    outline: 'none',
    fontFamily: T.fontBody,
    transition: 'border-color 0.2s',
    ...style,
  }}
  onFocus={e => e.target.style.borderColor = T.borderOrange}
  onBlur={e => e.target.style.borderColor = T.border}
  />
);

const Btn = ({ children, onClick, variant = 'primary', style = {}, disabled }) => {
  const variants = {
    primary: { background: `linear-gradient(135deg, ${T.orange}, ${T.orangeLight})`, color: '#fff', border: 'none', boxShadow: `0 4px 24px ${T.orangeGlow}` },
    ghost: { background: T.orangeGlow2, color: T.orangeLight, border: `1px solid ${T.borderOrange}`, boxShadow: 'none' },
    danger: { background: 'rgba(239,68,68,0.12)', color: T.red, border: '1px solid rgba(239,68,68,0.25)', boxShadow: 'none' },
    secondary: { background: T.bgSurface, color: T.textMuted, border: `1px solid ${T.border}`, boxShadow: 'none' },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '11px 20px',
      borderRadius: 12,
      fontWeight: 600,
      fontSize: 14,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: T.fontBody,
      transition: 'all 0.2s',
      opacity: disabled ? 0.45 : 1,
      letterSpacing: '0.01em',
      ...variants[variant],
      ...style,
    }}>{children}</button>
  );
};

const Badge = ({ children, color = 'orange' }) => {
  const colors = {
    orange: { bg: T.orangeGlow, text: T.orangeLight },
    green: { bg: 'rgba(34,197,94,0.12)', text: T.green },
    red: { bg: 'rgba(239,68,68,0.12)', text: T.red },
    blue: { bg: 'rgba(59,130,246,0.12)', text: T.blue },
  };
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 100,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.04em',
      background: colors[color].bg,
      color: colors[color].text,
    }}>{children}</span>
  );
};

const ProgressBar = ({ value, max, color = T.orange, height = 5 }) => (
  <div style={{ height, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
    <div style={{
      height: '100%',
      width: `${Math.min(100, (value / max) * 100)}%`,
      background: color,
      borderRadius: 100,
      transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
    }} />
  </div>
);

const Divider = ({ style = {} }) => (
  <div style={{ height: 1, background: T.border, ...style }} />
);

const Label = ({ children }) => (
  <div style={{ fontSize: 11, color: T.textDim, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{children}</div>
);

const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 24 }}>
    <h2 style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: '-0.02em' }}>{children}</h2>
    {sub && <p style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>{sub}</p>}
  </div>
);

// ─────────────────────────────────────────────
// NAV ITEMS
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  { id:'dashboard', label:'Dashboard', icon:'⬛' },
  { id:'planning', label:'Planning', icon:'📅' },
  { id:'messages', label:'Messages', icon:'💬' },
  { id:'shop', label:'Boutique', icon:'🛍️' },
  { id:'payments', label:'Paiements', icon:'💳' },
  { id:'health', label:'Santé', icon:'❤️' },
  { id:'nutrition', label:'Nutrition', icon:'🥗' },
];

// SVG Icons
const Icons = {
  dashboard: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/></svg>,
  planning: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  messages: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  shop: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  payments: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  health: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  nutrition: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 6v6l4 2"/></svg>,
  logout: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  send: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  plus: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  minus: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  x: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  bell: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  chevL: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevR: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  scale: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M3 9l9-6 9 6M3 15l9 6 9-6"/></svg>,
  trend: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 900);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: T.bg,
      fontFamily: T.fontBody,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* BG accent */}
      <div style={{
        position: 'absolute', top: '-15%', right: '-10%',
        width: 600, height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${T.orangeGlow} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%',
        width: 500, height: 500,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Left panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 80px',
        position: 'relative',
      }}>
        <div className="fade-up">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 16px', borderRadius: 100,
            background: T.orangeGlow, border: `1px solid ${T.borderOrange}`,
            marginBottom: 40,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.orange }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: T.orangeLight, letterSpacing: '0.06em' }}>ESPACE MEMBRE</span>
          </div>
          <h1 style={{
            fontFamily: T.font,
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: 16,
          }}>
            BODY<br />
            <span style={{ color: T.orange }}>DREAM</span>
          </h1>
          <p style={{ fontSize: 16, color: T.textMuted, lineHeight: 1.7, maxWidth: 340, marginBottom: 48 }}>
            Ton espace fitness personnel. Suivi, planning, nutrition et boutique — tout en un.
          </p>
        </div>

        <div className="fade-up-1" style={{ maxWidth: 380 }}>
          <div style={{ marginBottom: 16 }}>
            <Label>Adresse e-mail</Label>
            <Input
              type="email"
              placeholder="loulou@bodydream.dz"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 28 }}>
            <Label>Mot de passe</Label>
            <Input
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 14,
              border: 'none',
              background: loading ? T.bgSurface : `linear-gradient(135deg, ${T.orange}, ${T.orangeLight})`,
              color: loading ? T.textMuted : '#fff',
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? 'default' : 'pointer',
              fontFamily: T.fontBody,
              letterSpacing: '0.02em',
              boxShadow: loading ? 'none' : `0 8px 32px ${T.orangeGlow}`,
              transition: 'all 0.3s',
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter →'}
          </button>
          <p style={{ textAlign: 'center', fontSize: 12, color: T.textDim, marginTop: 16 }}>
            Mode démo — tous les champs sont optionnels
          </p>
        </div>
      </div>

      {/* Right panel — decorative stats */}
      <div className="fade-up-2" style={{
        width: 380,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 16,
        padding: '60px 48px',
        borderLeft: `1px solid ${T.border}`,
      }}>
        {[
          { label: 'Membres actifs', value: '2 480', delta: '+12%', color: T.orange },
          { label: 'Séances cette semaine', value: '6 820', delta: '+8%', color: T.green },
          { label: 'Satisfaction globale', value: '98.4%', delta: '+0.3%', color: T.blue },
        ].map((stat, i) => (
          <div key={i} style={{
            padding: '20px 22px',
            borderRadius: 16,
            background: T.bgCard,
            border: `1px solid ${T.border}`,
          }}>
            <div style={{ fontSize: 12, color: T.textDim, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
              {stat.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: T.font, fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }}>{stat.value}</span>
              <span style={{ fontSize: 13, color: stat.color, fontWeight: 600 }}>{stat.delta}</span>
            </div>
          </div>
        ))}

        <div style={{ padding: '20px 22px', borderRadius: 16, background: T.orangeGlow2, border: `1px solid ${T.borderOrange}` }}>
          <div style={{ fontSize: 12, color: T.textDim, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
            Prochaine séance
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: T.text }}>Full Body — 09:00</div>
          <div style={{ fontSize: 13, color: T.textMuted, marginTop: 2 }}>Coach Ahmed · Salle 3</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
function Sidebar({ activeTab, setActiveTab, cartCount, onLogout }) {
  const iconMap = { dashboard: Icons.dashboard, planning: Icons.planning, messages: Icons.messages, shop: Icons.shop, payments: Icons.payments, health: Icons.health, nutrition: Icons.nutrition };

  return (
    <aside style={{
      width: 230,
      background: T.bgCard,
      borderRight: `1px solid ${T.border}`,
      display: 'flex',
      flexDirection: 'column',
      padding: '28px 16px',
      position: 'fixed',
      height: '100vh',
      top: 0,
      left: 0,
      zIndex: 100,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '4px 10px 28px', borderBottom: `1px solid ${T.border}`, marginBottom: 20 }}>
        <div style={{
          fontFamily: T.font,
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: '0.04em',
          color: T.orange,
        }}>BODY DREAM</div>
        <div style={{ fontSize: 11, color: T.textDim, letterSpacing: '0.04em', marginTop: 2 }}>PERFORMANCE CENTER</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(item => {
          const active = activeTab === item.id;
          const Icon = iconMap[item.id];
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                borderRadius: 12,
                border: 'none',
                background: active ? T.orangeGlow : 'transparent',
                color: active ? T.orangeLight : T.textMuted,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                fontFamily: T.fontBody,
                transition: 'all 0.15s',
                textAlign: 'left',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = T.text; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.textMuted; }}}
            >
              <span style={{ color: active ? T.orange : 'inherit', display: 'flex', alignItems: 'center' }}>
                {Icon && Icon(18)}
              </span>
              {item.label}
              {item.id === 'shop' && cartCount > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: T.orange,
                  color: '#fff',
                  borderRadius: 100,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 7px',
                  minWidth: 18,
                  textAlign: 'center',
                }}>{cartCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 12,
            border: `1px solid rgba(239,68,68,0.2)`,
            background: 'rgba(239,68,68,0.06)',
            color: T.red, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: T.fontBody,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
        >
          {Icons.logout(16)} Déconnexion
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: T.bgSurface }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: `linear-gradient(135deg, ${T.orange}, ${T.orangeLight})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: T.font, fontWeight: 700, fontSize: 14,
            flexShrink: 0,
          }}>L</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Loulou</div>
            <div style={{ fontSize: 11, color: T.textDim }}>Premium</div>
          </div>
          <Badge color="orange" style={{ marginLeft: 'auto' }}>PRO</Badge>
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────
function TopBar({ tab }) {
  const titles = {
    dashboard: { h: 'Bonjour, Loulou', s: 'Bienvenue chez Body Dream — prêt à performer ?' },
    planning: { h: 'Planning', s: 'Réserve et gère tes séances.' },
    messages: { h: 'Messagerie', s: 'Échange avec tes coachs.' },
    shop: { h: 'Boutique', s: 'Compléments, matériel & accessoires.' },
    payments: { h: 'Paiements', s: 'Abonnement et historique.' },
    health: { h: 'Santé & IMC', s: 'Suis ton évolution physique.' },
    nutrition: { h: 'Nutrition Pro', s: 'Optimise ta nutrition, sculpte ton corps.' },
  };
  const info = titles[tab] || titles.dashboard;

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 32, paddingBottom: 24,
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div className="slide-in" style={{ animation: 'slideIn 0.3s ease both' }}>
        <h1 style={{ fontFamily: T.font, fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>{info.h}</h1>
        <p style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>{info.s}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button style={{
          width: 40, height: 40, borderRadius: 12,
          border: `1px solid ${T.border}`,
          background: 'transparent',
          color: T.textMuted,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s',
          position: 'relative',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderOrange; e.currentTarget.style.color = T.orange; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
        >
          {Icons.bell(18)}
          <span style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: '50%', background: T.orange, border: `2px solid ${T.bgCard}` }} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
function Dashboard({ data, healthData }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const imc = healthData.height ? (healthData.weight / ((healthData.height / 100) ** 2)).toFixed(1) : '—';

  const stats = [
    { label: 'Jours restants', value: data.daysLeft, unit: 'jours', sub: 'Premium actif', color: T.orange },
    { label: 'Séances réservées', value: data.sessions, unit: '', sub: 'Ce mois', color: T.green },
    { label: 'IMC actuel', value: imc, unit: '', sub: 'Calculé auto', color: T.blue },
    { label: 'Panier', value: data.cartCount, unit: 'articles', sub: 'En attente', color: '#A855F7' },
  ];

  return (
    <div>
      {/* Hero slider */}
      <div className="fade-up" style={{
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 24,
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        position: 'relative',
        height: 180,
      }}>
        {SLIDES.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center',
            padding: '28px 32px',
            opacity: slide === i ? 1 : 0,
            transition: 'opacity 0.7s ease',
          }}>
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: 300, height: 300,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${s.color}18 0%, transparent 65%)`,
              transform: 'translate(30%, -30%)',
            }} />
            <div>
              <Badge color={s.color === T.green ? 'green' : s.color === T.blue ? 'blue' : 'orange'}>
                {s.tag}
              </Badge>
              <h2 style={{ fontFamily: T.font, fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', margin: '10px 0 6px', color: s.color }}>{s.label}</h2>
              <p style={{ fontSize: 14, color: T.textMuted }}>{s.detail}</p>
            </div>
          </div>
        ))}

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: 18, right: 24, display: 'flex', gap: 6 }}>
          {SLIDES.map((s, i) => (
            <div
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: i === slide ? 24 : 7, height: 7, borderRadius: 100,
                background: i === slide ? SLIDES[slide].color : T.border,
                cursor: 'pointer', transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {stats.map((stat, i) => (
          <Card key={i} style={{
            padding: '20px 22px',
            cursor: 'default',
            transition: 'border-color 0.2s, transform 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = stat.color + '40'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ fontSize: 11, color: T.textDim, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>
              {stat.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: T.font, fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em', color: stat.color, lineHeight: 1 }}>{stat.value}</span>
              {stat.unit && <span style={{ fontSize: 12, color: T.textDim }}>{stat.unit}</span>}
            </div>
            <div style={{ fontSize: 12, color: T.textDim, marginTop: 8 }}>{stat.sub}</div>
          </Card>
        ))}
      </div>

      {/* Quick access */}
      <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Card>
          <div style={{ fontSize: 12, color: T.textDim, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>Prochaines séances</div>
          {(SESSIONS[new Date().getDay()] || []).map((s, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0',
              borderBottom: i < (SESSIONS[new Date().getDay()]?.length - 1) ? `1px solid ${T.border}` : 'none',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>Coach {s.coach} · {s.type}</div>
              </div>
              <div style={{
                fontFamily: T.font,
                fontSize: 16, fontWeight: 700, color: T.orange,
              }}>{s.time}</div>
            </div>
          ))}
          {!SESSIONS[new Date().getDay()] && (
            <p style={{ fontSize: 13, color: T.textDim, textAlign: 'center', padding: '20px 0' }}>Aucune séance aujourd'hui · Repos 🌙</p>
          )}
        </Card>

        <Card>
          <div style={{ fontSize: 12, color: T.textDim, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>Abonnement</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: T.font, fontSize: 24, fontWeight: 700 }}>Premium</div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>Expire le 28/04/2026</div>
            </div>
            <Badge color="orange">ACTIF</Badge>
          </div>
          <ProgressBar value={23} max={30} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: T.textDim }}>7 jours écoulés</span>
            <span style={{ fontSize: 11, color: T.textDim }}>23 jours restants</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PLANNING
// ─────────────────────────────────────────────
function Planning({ data, onBook, onCancel }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekDates = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay() + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  };

  const weekDates = getWeekDates();
  const isBooked = (d, t) => data.bookings.some(b => b.day === d && b.time === t);
  const getBookId = (d, t) => data.bookings.find(b => b.day === d && b.time === t)?.id;

  const sessionColors = { 'Musculation': T.orange, 'CrossFit': T.red, 'Pilates': '#A855F7', 'Zumba': T.green, 'Yoga': T.blue };

  return (
    <div>
      {/* Week nav */}
      <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <button onClick={() => setWeekOffset(w => w - 1)} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${T.border}`, background: 'transparent', color: T.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderOrange; e.currentTarget.style.color = T.orange; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}>
          {Icons.chevL(16)}
        </button>
        <span style={{ fontFamily: T.font, fontWeight: 700, fontSize: 16 }}>
          {weekDates[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} — {weekDates[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
        </span>
        <button onClick={() => setWeekOffset(w => w + 1)} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${T.border}`, background: 'transparent', color: T.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderOrange; e.currentTarget.style.color = T.orange; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}>
          {Icons.chevR(16)}
        </button>
      </div>

      <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
        {weekDates.map((date, i) => {
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <div key={i} style={{
              borderRadius: 16,
              background: T.bgCard,
              border: `1px solid ${isToday ? T.borderOrange : T.border}`,
              overflow: 'hidden',
              boxShadow: isToday ? `0 0 20px ${T.orangeGlow2}` : 'none',
            }}>
              {/* Day header */}
              <div style={{
                padding: '12px 10px',
                borderBottom: `1px solid ${T.border}`,
                textAlign: 'center',
                background: isToday ? T.orangeGlow2 : 'transparent',
              }}>
                <div style={{ fontSize: 10, color: T.textDim, letterSpacing: '0.08em', fontWeight: 600, textTransform: 'uppercase' }}>{DAY_NAMES[i]}</div>
                <div style={{
                  fontFamily: T.font, fontSize: 20, fontWeight: 700,
                  color: isToday ? T.orange : T.text,
                  marginTop: 2,
                }}>{date.getDate()}</div>
                {isToday && <div style={{ width: 5, height: 5, borderRadius: '50%', background: T.orange, margin: '4px auto 0' }} />}
              </div>

              {/* Sessions */}
              <div style={{ padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: 6, minHeight: 80 }}>
                {(SESSIONS[i] || []).map((s, j) => {
                  const booked = isBooked(i, s.time);
                  const sColor = sessionColors[s.type] || T.orange;
                  return (
                    <div
                      key={j}
                      onClick={() => booked ? onCancel(getBookId(i, s.time)) : onBook(i, s.time, s.type, s.coach, s.name)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 10,
                        cursor: 'pointer',
                        background: booked ? `${sColor}15` : T.bgSurface,
                        border: `1px solid ${booked ? sColor + '40' : T.border}`,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = sColor + '60'; e.currentTarget.style.background = `${sColor}18`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = booked ? sColor + '40' : T.border; e.currentTarget.style.background = booked ? `${sColor}15` : T.bgSurface; }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: sColor }}>{s.time}</div>
                      <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2, lineHeight: 1.3 }}>{s.type}</div>
                      {booked && <div style={{ fontSize: 9, color: T.green, fontWeight: 700, marginTop: 4, letterSpacing: '0.04em' }}>✓ RÉSERVÉ</div>}
                    </div>
                  );
                })}
                {(!SESSIONS[i] || SESSIONS[i].length === 0) && (
                  <div style={{ textAlign: 'center', fontSize: 10, color: T.textDim, paddingTop: 16 }}>Repos</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bookings list */}
      {data.bookings.length > 0 && (
        <Card className="fade-up-2" style={{ marginTop: 20 }}>
          <Label>Mes réservations</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
            {data.bookings.map(b => (
              <div key={b.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                borderRadius: 12,
                background: T.bgSurface,
                border: `1px solid ${T.border}`,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>{DAY_NAMES[b.day]} · {b.time} · Coach {b.coach}</div>
                </div>
                <button
                  onClick={() => onCancel(b.id)}
                  style={{ background: 'transparent', border: 'none', color: T.textDim, cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', transition: '0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = T.red}
                  onMouseLeave={e => e.currentTarget.style.color = T.textDim}
                >
                  {Icons.x(14)}
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────────
const INIT_MSGS = [
  { id:1, sender:'coach', text:'Salut Loulou ! Prêt pour ta séance chez Body Dream ? 💪', time:'09:30' },
  { id:2, sender:'user', text:'Toujours motivé ! On attaque fort aujourd\'hui 🔥', time:'09:35' },
  { id:3, sender:'coach', text:'C\'est l\'esprit Body Dream ! 💥', time:'09:36' },
];

function Messages() {
  const [activeChat, setActiveChat] = useState('coach');
  const [messages, setMessages] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem('bd_messages') || '[]'); return s.length > 0 ? s : INIT_MSGS; } catch { return INIT_MSGS; }
  });
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { localStorage.setItem('bd_messages', JSON.stringify(messages)); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    setMessages(p => [...p, { id: Date.now(), sender: 'user', text: input.trim(), time: t }]);
    setInput('');
    const replies = ['Super travail ! 💪', 'Continue les efforts, t\'es sur la bonne voie.', 'Body Dream, c\'est la victoire ! 🔥', 'Pense à bien t\'hydrater 💧', 'Excellent niveau, Loulou !'];
    setTimeout(() => {
      setMessages(p => [...p, { id: Date.now() + 1, sender: 'coach', text: replies[Math.floor(Math.random() * replies.length)], time: t }]);
    }, 1200);
  };

  const coachInitials = { coach: 'A', admin: 'AD' };
  const coachNames = { coach: 'Coach Ahmed', admin: 'Administration' };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 148px)', borderRadius: 20, overflow: 'hidden', border: `1px solid ${T.border}` }}>
      {/* Sidebar contacts */}
      <div style={{ width: 220, background: T.bgCard, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, color: T.textDim, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Conversations</div>
        </div>
        {['coach', 'admin'].map(role => (
          <button
            key={role}
            onClick={() => setActiveChat(role)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              border: 'none',
              background: activeChat === role ? T.orangeGlow2 : 'transparent',
              borderLeft: activeChat === role ? `2px solid ${T.orange}` : '2px solid transparent',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: T.fontBody,
              transition: '0.15s',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: activeChat === role ? `linear-gradient(135deg, ${T.orange}, ${T.orangeLight})` : T.bgSurface,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: activeChat === role ? '#fff' : T.textMuted,
              flexShrink: 0,
            }}>{coachInitials[role]}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: activeChat === role ? T.text : T.textMuted }}>{coachNames[role]}</div>
              <div style={{ fontSize: 11, color: T.textDim }}>En ligne</div>
            </div>
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.bg }}>
        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 12, background: T.bgCard }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: `linear-gradient(135deg, ${T.orange}, ${T.orangeLight})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff',
          }}>{coachInitials[activeChat]}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{coachNames[activeChat]}</div>
            <div style={{ fontSize: 11, color: T.green, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.green, display: 'inline-block' }} />
              En ligne
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.filter(() => true).map(m => (
            <div key={m.id} style={{
              display: 'flex',
              flexDirection: m.sender === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-end',
              gap: 10,
            }}>
              {m.sender !== 'user' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${T.orange}, ${T.orangeLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {coachInitials[activeChat]}
                </div>
              )}
              <div style={{
                maxWidth: '68%',
                padding: '12px 16px',
                borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: m.sender === 'user' ? `linear-gradient(135deg, ${T.orange}, ${T.orangeLight})` : T.bgCard,
                border: m.sender === 'user' ? 'none' : `1px solid ${T.border}`,
                fontSize: 14,
                lineHeight: 1.55,
                color: T.text,
                boxShadow: m.sender === 'user' ? `0 4px 16px ${T.orangeGlow}` : 'none',
              }}>
                {m.text}
                <div style={{ fontSize: 10, opacity: 0.55, marginTop: 5, textAlign: m.sender === 'user' ? 'right' : 'left' }}>{m.time}</div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '14px 16px', borderTop: `1px solid ${T.border}`, background: T.bgCard, display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Tape ton message..."
            style={{
              flex: 1, padding: '12px 18px',
              borderRadius: 100,
              border: `1px solid ${T.border}`,
              background: T.bgInput,
              color: T.text, fontSize: 14,
              outline: 'none', fontFamily: T.fontBody,
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = T.borderOrange}
            onBlur={e => e.target.style.borderColor = T.border}
          />
          <button
            onClick={send}
            style={{
              width: 42, height: 42, borderRadius: '50%',
              border: 'none',
              background: `linear-gradient(135deg, ${T.orange}, ${T.orangeLight})`,
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: `0 4px 16px ${T.orangeGlow}`,
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {Icons.send(16)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SHOP
// ─────────────────────────────────────────────
function Shop({ cart, setCart }) {
  const [cat, setCat] = useState('all');
  const [showCheckout, setShowCheckout] = useState(false);

  const addToCart = p => setCart(prev => {
    const e = prev.find(i => i.id === p.id);
    if (e) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
    return [...prev, { ...p, qty: 1 }];
  });

  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const remove = id => setCart(prev => prev.filter(i => i.id !== id));
  const filtered = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const cats = [
    { key: 'all', label: 'Tout' },
    { key: 'nutrition', label: 'Nutrition' },
    { key: 'equipment', label: 'Matériel' },
    { key: 'accessories', label: 'Accessoires' },
  ];

  return (
    <div>
      {/* Filter pills */}
      <div className="fade-up" style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {cats.map(c => (
          <Pill key={c.key} active={cat === c.key} onClick={() => setCat(c.key)} size="sm">{c.label}</Pill>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {/* Products */}
        <div className="fade-up-1" style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {filtered.map(p => (
              <Card key={p.id} style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderOrange; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  height: 120,
                  background: T.bgSurface,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 48,
                  borderBottom: `1px solid ${T.border}`,
                }}>{p.emoji}</div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 14 }}>{p.desc}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.orange }}>{p.price.toLocaleString()} DA</span>
                    <button
                      onClick={() => addToCart(p)}
                      style={{
                        width: 30, height: 30, borderRadius: 8,
                        border: `1px solid ${T.borderOrange}`,
                        background: T.orangeGlow2,
                        color: T.orange, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: '0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = T.orange; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = T.orangeGlow2; e.currentTarget.style.color = T.orange; }}
                    >
                      {Icons.plus(14)}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="fade-up-2" style={{ width: 280, flexShrink: 0 }}>
          <Card style={{ position: 'sticky', top: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Panier</span>
              <Badge color="orange">{cart.reduce((s, i) => s + i.qty, 0)} articles</Badge>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: T.textDim, fontSize: 13 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🛍️</div>
                Panier vide
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, maxHeight: 360, overflowY: 'auto' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ padding: '10px 12px', borderRadius: 12, background: T.bgSurface, border: `1px solid ${T.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, flex: 1, marginRight: 8 }}>{item.name}</div>
                        <button onClick={() => remove(item.id)} style={{ background: 'transparent', border: 'none', color: T.textDim, cursor: 'pointer', padding: 2, display: 'flex', transition: '0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.color = T.red}
                          onMouseLeave={e => e.currentTarget.style.color = T.textDim}
                        >{Icons.trash(13)}</button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: T.orange, fontWeight: 700 }}>{(item.price * item.qty).toLocaleString()} DA</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => updateQty(item.id, -1)} style={{ width: 24, height: 24, borderRadius: 6, border: `1px solid ${T.border}`, background: 'transparent', color: T.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderOrange; e.currentTarget.style.color = T.orange; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}>
                            {Icons.minus(12)}
                          </button>
                          <span style={{ fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} style={{ width: 24, height: 24, borderRadius: 6, border: `1px solid ${T.border}`, background: 'transparent', color: T.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderOrange; e.currentTarget.style.color = T.orange; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}>
                            {Icons.plus(12)}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Divider style={{ marginBottom: 14 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: 13, color: T.textMuted }}>Total</span>
                  <span style={{ fontFamily: T.font, fontSize: 20, fontWeight: 700, color: T.orange }}>{total.toLocaleString()} DA</span>
                </div>
                <Btn onClick={() => setShowCheckout(true)} style={{ width: '100%', justifyContent: 'center' }}>
                  Commander →
                </Btn>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Checkout modal */}
      {showCheckout && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
          animation: 'fadeIn 0.2s ease',
        }} onClick={() => setShowCheckout(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: 420,
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 24,
            padding: '28px 32px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: T.font, fontSize: 20, fontWeight: 700 }}>Paiement sécurisé</h3>
              <button onClick={() => setShowCheckout(false)} style={{ background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer', display: 'flex' }}
                onMouseEnter={e => e.currentTarget.style.color = T.text}
                onMouseLeave={e => e.currentTarget.style.color = T.textMuted}
              >{Icons.x()}</button>
            </div>

            <div style={{ textAlign: 'center', padding: '20px 0', marginBottom: 24, borderRadius: 14, background: T.bgSurface }}>
              <div style={{ fontSize: 12, color: T.textDim, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Montant total</div>
              <div style={{ fontFamily: T.font, fontSize: 36, fontWeight: 800, color: T.orange }}>{total.toLocaleString()} DA</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input placeholder="Numéro de carte" />
              <div style={{ display: 'flex', gap: 12 }}>
                <Input placeholder="MM / AA" />
                <Input placeholder="CVV" type="password" />
              </div>
              <Btn onClick={() => { setShowCheckout(false); setCart([]); alert('🎉 Commande confirmée ! Merci et bienvenue chez Body Dream.'); }} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                Confirmer le paiement
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────
function Payments({ sessions }) {
  return (
    <div>
      <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Abonnement', value: 'Premium', sub: 'Expire le 28/04/2026', color: T.orange },
          { label: 'Séances ce mois', value: `${sessions} / 20`, sub: `${20 - sessions} restantes`, color: T.green },
          { label: 'Total dépensé', value: '9 800 DA', sub: 'Ce trimestre', color: T.blue },
        ].map((s, i) => (
          <Card key={i} style={{ padding: '22px 24px' }}>
            <Label>{s.label}</Label>
            <div style={{ fontFamily: T.font, fontSize: 28, fontWeight: 700, color: s.color, letterSpacing: '-0.01em' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: T.textDim, marginTop: 6 }}>{s.sub}</div>
            {s.label === 'Séances ce mois' && <ProgressBar value={sessions} max={20} color={T.green} style={{ marginTop: 12 }} />}
          </Card>
        ))}
      </div>

      <Card className="fade-up-1">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontFamily: T.font, fontSize: 18, fontWeight: 700 }}>Historique des paiements</h3>
            <p style={{ fontSize: 13, color: T.textMuted, marginTop: 3 }}>Toutes tes transactions</p>
          </div>
          <Badge color="green">3 paiements</Badge>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PAYMENT_HISTORY.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 18px',
              borderRadius: 14,
              background: T.bgSurface,
              border: `1px solid ${T.border}`,
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.borderHover}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: T.orangeGlow, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: T.orange, fontSize: 16,
                }}>💳</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{p.type}</div>
                  <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{p.date}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.text }}>{p.amount}</span>
                <Badge color="green">{p.status}</Badge>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <Btn variant="ghost" style={{ width: '100%', justifyContent: 'center' }}>
            Renouveler mon abonnement →
          </Btn>
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// HEALTH
// ─────────────────────────────────────────────
function Health({ healthData, setHealthData }) {
  const [imcResult, setImcResult] = useState(0);
  const [newWeight, setNewWeight] = useState('');

  const calcIMC = useCallback(() => {
    if (!healthData.height || !healthData.weight) return;
    const h = healthData.height / 100;
    setImcResult(+(healthData.weight / (h * h)).toFixed(1));
  }, [healthData]);

  const addWeight = () => {
    const w = parseFloat(newWeight);
    if (!w) return;
    const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    setHealthData(p => ({ ...p, weight: w, history: [...p.history, { date: today, value: w }] }));
    setNewWeight('');
  };

  const imcCategory = imcResult < 18.5 ? { label: 'Insuffisance pondérale', color: T.blue } : imcResult < 25 ? { label: 'Poids normal ✓', color: T.green } : imcResult < 30 ? { label: 'Surpoids', color: '#F59E0B' } : { label: 'Obésité', color: T.red };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* IMC Calculator */}
      <Card className="fade-up">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: T.orangeGlow, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.orange }}>
            {Icons.scale(22)}
          </div>
          <div>
            <h3 style={{ fontFamily: T.font, fontSize: 17, fontWeight: 700 }}>Calculateur IMC</h3>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 1 }}>Indice de masse corporelle</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <Label>Taille</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Input
                type="number"
                value={healthData.height}
                onChange={e => setHealthData(p => ({ ...p, height: parseFloat(e.target.value) || 0 }))}
              />
              <span style={{ fontSize: 14, color: T.textMuted, flexShrink: 0 }}>cm</span>
            </div>
          </div>
          <div>
            <Label>Poids actuel</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Input
                type="number"
                value={healthData.weight}
                onChange={e => setHealthData(p => ({ ...p, weight: parseFloat(e.target.value) || 0 }))}
              />
              <span style={{ fontSize: 14, color: T.textMuted, flexShrink: 0 }}>kg</span>
            </div>
          </div>
          <Btn onClick={calcIMC} style={{ width: '100%', justifyContent: 'center' }}>Calculer mon IMC</Btn>
        </div>

        {imcResult > 0 && (
          <div style={{
            marginTop: 24, textAlign: 'center',
            padding: '24px 20px', borderRadius: 16,
            background: T.bgSurface, border: `1px solid ${T.border}`,
            animation: 'fadeUp 0.35s ease both',
          }}>
            <div style={{ fontSize: 12, color: T.textDim, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>Ton IMC</div>
            <div style={{ fontFamily: T.font, fontSize: 64, fontWeight: 800, color: imcCategory.color, lineHeight: 1, letterSpacing: '-0.03em' }}>{imcResult}</div>
            <div style={{ marginTop: 10 }}>
              <Badge color={imcResult < 25 && imcResult >= 18.5 ? 'green' : imcResult < 18.5 ? 'blue' : 'orange'}>{imcCategory.label}</Badge>
            </div>
          </div>
        )}
      </Card>

      {/* Weight tracking */}
      <Card className="fade-up-1">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.blue }}>
            {Icons.trend(22)}
          </div>
          <div>
            <h3 style={{ fontFamily: T.font, fontSize: 17, fontWeight: 700 }}>Suivi du poids</h3>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 1 }}>Historique de progression</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <Input
            type="number"
            placeholder="Nouveau poids (kg)"
            value={newWeight}
            onChange={e => setNewWeight(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addWeight()}
            style={{ flex: 1 }}
          />
          <Btn onClick={addWeight} style={{ flexShrink: 0, padding: '11px 18px' }}>+ Ajouter</Btn>
        </div>

        {/* Chart */}
        <div style={{ marginBottom: 8 }}>
          <Label>Évolution</Label>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: 130, gap: 6 }}>
          {healthData.history.length === 0 ? (
            <div style={{ width: '100%', textAlign: 'center', color: T.textDim, fontSize: 12, paddingTop: 40 }}>Aucune donnée — ajoute ton premier poids</div>
          ) : (() => {
            const hist = healthData.history.slice(-8);
            const maxV = Math.max(...hist.map(h => h.value)) + 5;
            const minV = Math.min(...hist.map(h => h.value)) - 5;
            return hist.map((entry, i) => {
              const pct = ((entry.value - minV) / (maxV - minV)) * 100;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 10, color: T.textDim }}>{entry.value}</div>
                  <div style={{ width: '100%', height: `${pct}%`, background: `linear-gradient(to top, ${T.orange}, ${T.orangeLight})`, borderRadius: '6px 6px 0 0', minHeight: 4, transition: 'height 0.5s' }} />
                  <div style={{ fontSize: 9, color: T.textDim, textAlign: 'center' }}>{entry.date}</div>
                </div>
              );
            });
          })()}
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// NUTRITION
// ─────────────────────────────────────────────
function Nutrition() {
  const [goal, setGoal] = useState(() => localStorage.getItem('bd_nutr_goal') || 'maintien');
  const [meals, setMeals] = useState(() => { try { return JSON.parse(localStorage.getItem('bd_meals') || '[]'); } catch { return []; } });
  const [water, setWater] = useState(() => parseInt(localStorage.getItem('bd_water') || '0'));
  const [showAdd, setShowAdd] = useState(false);
  const [selFood, setSelFood] = useState('');
  const [foodQty, setFoodQty] = useState(100);
  const [mealType, setMealType] = useState('Petit-déjeuner');

  useEffect(() => { localStorage.setItem('bd_nutr_goal', goal); }, [goal]);
  useEffect(() => { localStorage.setItem('bd_meals', JSON.stringify(meals)); }, [meals]);
  useEffect(() => { localStorage.setItem('bd_water', water.toString()); }, [water]);

  const totals = meals.reduce((a, m) => ({ cal: a.cal + m.cal, prot: a.prot + m.prot, gluc: a.gluc + m.gluc, lip: a.lip + m.lip }), { cal: 0, prot: 0, gluc: 0, lip: 0 });
  const target = TARGETS[goal];
  const waterTarget = 2500;

  const addMeal = () => {
    if (!selFood) return;
    const food = FOOD_DB.find(f => f.id === selFood);
    const r = foodQty / 100;
    setMeals(p => [...p, {
      id: Date.now(), type: mealType, name: food.name, qty: foodQty,
      cal: Math.round(food.cal * r),
      prot: +(food.prot * r).toFixed(1),
      gluc: +(food.gluc * r).toFixed(1),
      lip: +(food.lip * r).toFixed(1),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setShowAdd(false); setSelFood(''); setFoodQty(100);
  };

  const macros = [
    { label: 'Protéines', val: totals.prot, max: target.prot, color: '#22C55E', unit: 'g' },
    { label: 'Glucides', val: totals.gluc, max: target.gluc, color: T.orange, unit: 'g' },
    { label: 'Lipides', val: totals.lip, max: target.lip, color: '#A855F7', unit: 'g' },
  ];

  const goalLabels = { masse: '💪 Prise de masse', seche: '🔥 Sèche', maintien: '⚖️ Maintien' };

  return (
    <div>
      {/* Goal selector */}
      <div className="fade-up" style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {Object.keys(TARGETS).map(g => (
          <Pill key={g} active={goal === g} onClick={() => setGoal(g)}>{goalLabels[g]}</Pill>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        {/* Macros panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card className="fade-up-1">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: T.font, fontSize: 17, fontWeight: 700 }}>Répartition macros</h3>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, color: totals.cal > target.cal ? T.red : T.orange, lineHeight: 1 }}>{totals.cal}</div>
                <div style={{ fontSize: 11, color: T.textDim }}>/ {target.cal} kcal</div>
              </div>
            </div>

            {/* Donut */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <svg width={160} height={160} viewBox="0 0 160 160">
                {(() => {
                  const pct = Math.min(1, totals.cal / target.cal);
                  const r = 68; const cx = 80; const cy = 80;
                  const circ = 2 * Math.PI * r;
                  return (
                    <>
                      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.bgSurface} strokeWidth={16} />
                      <circle cx={cx} cy={cy} r={r} fill="none"
                        stroke={pct > 1 ? T.red : T.orange}
                        strokeWidth={16}
                        strokeDasharray={`${pct * circ} ${circ}`}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${cx} ${cy})`}
                        style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(0.16,1,0.3,1)' }}
                      />
                      <text x={cx} y={cy - 6} textAnchor="middle" style={{ fontFamily: T.font, fontSize: 24, fontWeight: 700, fill: T.text }}>{totals.cal}</text>
                      <text x={cx} y={cy + 14} textAnchor="middle" style={{ fontFamily: T.fontBody, fontSize: 11, fill: T.textDim }}>kcal</text>
                    </>
                  );
                })()}
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {macros.map((m, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{m.label}</span>
                    <span style={{ fontSize: 13, color: m.color, fontWeight: 700 }}>{m.val}{m.unit} / {m.max}{m.unit}</span>
                  </div>
                  <ProgressBar value={m.val} max={m.max} color={m.color} height={6} />
                </div>
              ))}
            </div>
          </Card>

          {/* Water */}
          <Card className="fade-up-2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700 }}>💧 Hydratation</h3>
              <span style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: water >= waterTarget ? T.green : T.blue }}>
                {water} <span style={{ fontSize: 12, fontWeight: 400, color: T.textDim }}>/ {waterTarget} ml</span>
              </span>
            </div>
            <ProgressBar value={water} max={waterTarget} color={water >= waterTarget ? T.green : T.blue} height={8} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
              <button
                onClick={() => setWater(p => Math.max(0, p - 250))}
                style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${T.border}`, background: 'transparent', color: T.textMuted, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderOrange; e.currentTarget.style.color = T.orange; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
              >−</button>
              <div style={{ textAlign: 'center', display: 'flex', gap: 6 }}>
                {[250, 500].map(v => (
                  <button key={v} onClick={() => setWater(p => Math.min(waterTarget, p + v))} style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${T.border}`, background: 'transparent', color: T.textMuted, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: T.fontBody, transition: '0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.orangeGlow2; e.currentTarget.style.color = T.orange; e.currentTarget.style.borderColor = T.borderOrange; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.textMuted; e.currentTarget.style.borderColor = T.border; }}>
                    +{v}ml
                  </button>
                ))}
              </div>
              <button
                onClick={() => setWater(p => Math.min(waterTarget, p + 250))}
                style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${T.border}`, background: 'transparent', color: T.textMuted, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderOrange; e.currentTarget.style.color = T.orange; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
              >+</button>
            </div>
            {water >= waterTarget && (
              <div style={{ marginTop: 12, textAlign: 'center', fontSize: 12, color: T.green, fontWeight: 600 }}>✓ Objectif hydratation atteint !</div>
            )}
          </Card>
        </div>

        {/* Journal */}
        <Card className="fade-up-1">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontFamily: T.font, fontSize: 17, fontWeight: 700 }}>Journal du jour</h3>
            <Btn variant="ghost" onClick={() => setShowAdd(true)} style={{ padding: '8px 14px', fontSize: 13 }}>
              + Ajouter
            </Btn>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 420, overflowY: 'auto' }}>
            {meals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: T.textDim, fontSize: 13 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🍽️</div>
                Aucun repas enregistré aujourd'hui
              </div>
            ) : meals.slice().reverse().map(meal => (
              <div key={meal.id} style={{
                padding: '12px 14px', borderRadius: 12,
                background: T.bgSurface, border: `1px solid ${T.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = T.borderHover}
                onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
              >
                <div style={{ flex: 1, marginRight: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{meal.name} <span style={{ color: T.textDim, fontWeight: 400 }}>({meal.qty}g)</span></div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>
                    {meal.type} · P:{meal.prot}g G:{meal.gluc}g L:{meal.lip}g · {meal.time}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.orange }}>{meal.cal} kcal</span>
                  <button onClick={() => setMeals(p => p.filter(m => m.id !== meal.id))} style={{ background: 'transparent', border: 'none', color: T.textDim, cursor: 'pointer', display: 'flex', transition: '0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = T.red}
                    onMouseLeave={e => e.currentTarget.style.color = T.textDim}
                  >{Icons.x(14)}</button>
                </div>
              </div>
            ))}
          </div>

          {/* Conseil */}
          <div style={{ marginTop: 18, padding: '14px 16px', borderRadius: 12, background: T.orangeGlow2, border: `1px solid ${T.borderOrange}` }}>
            <div style={{ fontSize: 12, color: T.orange, fontWeight: 700, marginBottom: 4 }}>💡 Conseil</div>
            <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>
              {totals.cal < target.cal * 0.5 ? 'Tu es en dessous de 50% de ton objectif. Ajoute une collation riche en protéines.' : totals.cal > target.cal ? 'Objectif calorique atteint ! Reste hydraté et privilégie les fibres pour la satiété.' : 'Bonne progression ! Continue ainsi pour optimiser tes résultats.'}
            </div>
          </div>
        </Card>
      </div>

      {/* Add meal modal */}
      {showAdd && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
          animation: 'fadeIn 0.2s ease',
        }} onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: 440,
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 24,
            padding: '28px 32px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: T.font, fontSize: 20, fontWeight: 700 }}>Ajouter un aliment</h3>
              <button onClick={() => setShowAdd(false)} style={{ background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer', display: 'flex' }}>{Icons.x()}</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <Label>Type de repas</Label>
                <select value={mealType} onChange={e => setMealType(e.target.value)} style={{
                  width: '100%', padding: '12px 16px',
                  borderRadius: 12, border: `1px solid ${T.border}`,
                  background: T.bgInput, color: T.text,
                  fontSize: 14, outline: 'none', fontFamily: T.fontBody,
                  cursor: 'pointer',
                }}>
                  <option value="Petit-déjeuner">🌅 Petit-déjeuner</option>
                  <option value="Déjeuner">🍽️ Déjeuner</option>
                  <option value="Collation">🥤 Collation</option>
                  <option value="Dîner">🌙 Dîner</option>
                </select>
              </div>
              <div>
                <Label>Aliment</Label>
                <select value={selFood} onChange={e => setSelFood(e.target.value)} style={{
                  width: '100%', padding: '12px 16px',
                  borderRadius: 12, border: `1px solid ${T.border}`,
                  background: T.bgInput, color: T.text,
                  fontSize: 14, outline: 'none', fontFamily: T.fontBody,
                  cursor: 'pointer',
                }}>
                  <option value="">Sélectionner un aliment...</option>
                  {FOOD_DB.map(f => <option key={f.id} value={f.id}>{f.name} ({f.cal} kcal/100g)</option>)}
                </select>
              </div>
              <div>
                <Label>Quantité (g)</Label>
                <Input type="number" value={foodQty} onChange={e => setFoodQty(Number(e.target.value))} />
              </div>

              {selFood && (() => {
                const food = FOOD_DB.find(f => f.id === selFood);
                const r = foodQty / 100;
                return (
                  <div style={{ padding: '14px 16px', borderRadius: 12, background: T.bgSurface, border: `1px solid ${T.borderOrange}` }}>
                    <div style={{ fontSize: 11, color: T.orange, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                      Estimation pour {foodQty}g
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[
                        { label: 'Calories', value: `${Math.round(food.cal * r)} kcal`, color: T.orange },
                        { label: 'Protéines', value: `${+(food.prot * r).toFixed(1)}g`, color: T.green },
                        { label: 'Glucides', value: `${+(food.gluc * r).toFixed(1)}g`, color: T.blue },
                        { label: 'Lipides', value: `${+(food.lip * r).toFixed(1)}g`, color: '#A855F7' },
                      ].map((n, i) => (
                        <div key={i} style={{ padding: '10px 12px', borderRadius: 10, background: T.bgCard }}>
                          <div style={{ fontSize: 11, color: T.textDim, marginBottom: 3 }}>{n.label}</div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: n.color }}>{n.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <Btn onClick={addMeal} disabled={!selFood} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
                Enregistrer le repas
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('bd_auth') === 'true');
  const [tab, setTab] = useState('dashboard');

  const [healthData, setHealthData] = useState(() => {
    try {
      if (!localStorage.getItem('bd_auth')) return { height: 175, weight: 75, history: [] };
      return {
        height: parseFloat(localStorage.getItem('bd_height') || '175'),
        weight: parseFloat(localStorage.getItem('bd_weight') || '75'),
        history: JSON.parse(localStorage.getItem('bd_weights') || '[]'),
      };
    } catch { return { height: 175, weight: 75, history: [] }; }
  });

  const [data, setData] = useState(() => {
    try {
      const bookings = JSON.parse(localStorage.getItem('bd_bookings') || '[]');
      return { daysLeft: 23, sessions: bookings.length, cartCount: 0, bookings };
    } catch { return { daysLeft: 23, sessions: 0, cartCount: 0, bookings: [] }; }
  });

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bd_cart') || '[]'); } catch { return []; }
  });

  // Persist
  useEffect(() => {
    if (authed) {
      localStorage.setItem('bd_auth', 'true');
      localStorage.setItem('bd_height', healthData.height);
      localStorage.setItem('bd_weight', healthData.weight);
      localStorage.setItem('bd_weights', JSON.stringify(healthData.history));
    }
  }, [authed, healthData]);

  useEffect(() => {
    if (authed) {
      localStorage.setItem('bd_cart', JSON.stringify(cart));
      setData(p => ({ ...p, cartCount: cart.reduce((s, i) => s + i.qty, 0) }));
    }
  }, [cart, authed]);

  const handleBook = (d, t, type, coach, name) => {
    const b = { day: d, time: t, type, coach, name, id: Date.now() };
    const updated = [...data.bookings, b];
    localStorage.setItem('bd_bookings', JSON.stringify(updated));
    setData(p => ({ ...p, bookings: updated, sessions: updated.length }));
  };

  const handleCancel = id => {
    const updated = data.bookings.filter(b => b.id !== id);
    localStorage.setItem('bd_bookings', JSON.stringify(updated));
    setData(p => ({ ...p, bookings: updated, sessions: updated.length }));
  };

  const handleLogout = () => {
    Object.keys(localStorage).filter(k => k.startsWith('bd_')).forEach(k => localStorage.removeItem(k));
    setAuthed(false);
    setData({ daysLeft: 23, sessions: 0, cartCount: 0, bookings: [] });
    setCart([]);
    setHealthData({ height: 175, weight: 75, history: [] });
  };

  if (!authed) {
    return (
      <>
        <style>{GS}</style>
        <LoginPage onLogin={() => { localStorage.setItem('bd_auth', 'true'); setAuthed(true); }} />
      </>
    );
  }

  const renderContent = () => {
    switch (tab) {
      case 'dashboard': return <Dashboard data={data} healthData={healthData} />;
      case 'planning': return <Planning data={data} onBook={handleBook} onCancel={handleCancel} />;
      case 'messages': return <Messages />;
      case 'shop': return <Shop cart={cart} setCart={setCart} />;
      case 'payments': return <Payments sessions={data.sessions} />;
      case 'health': return <Health healthData={healthData} setHealthData={setHealthData} />;
      case 'nutrition': return <Nutrition />;
      default: return null;
    }
  };

  return (
    <>
      <style>{GS}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: T.bg, fontFamily: T.fontBody }}>
        <Sidebar activeTab={tab} setActiveTab={setTab} cartCount={data.cartCount} onLogout={handleLogout} />
        <main style={{ marginLeft: 230, flex: 1, padding: '32px 40px', maxWidth: 'calc(100vw - 230px)', overflowX: 'hidden' }}>
          <TopBar tab={tab} />
          <div key={tab} style={{ animation: 'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both' }}>
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
}
