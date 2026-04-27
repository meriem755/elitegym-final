import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

/* ═══════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════ */
function Navbar({ theme, toggleTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={nav.bar}>
      <div style={nav.inner}>
        <a href="#accueil" style={nav.brand}>
          <span style={nav.dot} />
          ÉLITE GYM
        </a>

        <ul style={nav.links}>
          {['accueil', 'cours', 'tarifs', 'coachs', 'contact'].map((s) => (
            <li key={s}>
              <a href={`#${s}`} style={nav.link}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            </li>
          ))}
        </ul>

        <div style={nav.actions}>
          <button onClick={toggleTheme} style={nav.themeBtn} title="Changer le thème">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'var(--text2)', fontSize: '0.84rem' }}>{user.prenom}</span>
              <button onClick={handleLogout} style={nav.loginBtn}>Déconnexion</button>
            </div>
          ) : (
            <Link to="/login" style={nav.loginBtn}>👤 Connexion</Link>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} style={nav.burger}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={nav.mobileMenu}>
          {['accueil', 'cours', 'tarifs', 'coachs', 'contact'].map((s) => (
            <a key={s} href={`#${s}`} style={nav.mobileLink} onClick={() => setMenuOpen(false)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </a>
          ))}
          {!user && (
            <Link to="/login" style={{ ...nav.mobileLink, color: 'var(--accent)' }}
              onClick={() => setMenuOpen(false)}>
              Connexion
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════ */
const SLIDES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1920&q=80',
];
const STATS = [
  { num: 1200, label: 'Membres Actifs' },
  { num: 15,   label: 'Coachs Certifiés' },
  { num: 48,   label: 'Cours / Semaine' },
  { num: 7,    label: "Ans d'Expérience" },
];

function Hero() {
  const [slide, setSlide] = useState(0);
  const [counts, setCounts] = useState(STATS.map(() => 0));

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const timers = STATS.map((stat, i) => {
      const step = Math.ceil(stat.num / 60);
      return setInterval(() => {
        setCounts((prev) => {
          const next = [...prev];
          next[i] = Math.min(next[i] + step, stat.num);
          return next;
        });
      }, 30);
    });
    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <section id="accueil" style={hero.section}>
      {SLIDES.map((src, i) => (
        <div key={i} style={{ ...hero.slide, backgroundImage: `url(${src})`, opacity: i === slide ? 1 : 0 }} />
      ))}
      <div style={hero.overlay} />

      <div style={hero.content}>
        <div style={hero.tag}><span style={hero.tagDot} />Salle de Sport — Algérie</div>
        <h1 style={hero.title}>
          <span style={{ display: 'block' }}>FORGEZ</span>
          <span style={{ display: 'block', color: 'var(--accent2)' }}>VOTRE</span>
          <span style={{ display: 'block' }}>LÉGENDE</span>
        </h1>
        <p style={hero.sub}>
          Équipements dernière génération, coachs certifiés, programmes sur mesure.
          Rejoignez une communauté de passionnés.
        </p>
        <div style={hero.ctas}>
          <a href="#tarifs" style={hero.btnPrimary}>Voir les abonnements →</a>
          <a href="#cours"  style={hero.btnOutline}>Nos cours ▶</a>
        </div>
      </div>

      <div style={hero.dots}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} style={{
            ...hero.dot,
            height: i === slide ? 36 : 18,
            background: i === slide ? 'var(--accent)' : 'rgba(255,255,255,0.2)',
          }} />
        ))}
      </div>

      <div style={hero.statsBar}>
        {STATS.map((s, i) => (
          <div key={i} style={hero.statItem}>
            <div style={hero.statNum}>{counts[i].toLocaleString()}+</div>
            <div style={hero.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   MARQUEE
═══════════════════════════════════════════════════ */
const DISCIPLINES = [
  'MUSCULATION','CARDIO','CROSSFIT','YOGA','BOXE',
  'SPINNING','ZUMBA','STRETCHING','NUTRITION','COACHING',
];
function Marquee() {
  const items = [...DISCIPLINES, ...DISCIPLINES];
  return (
    <div style={mq.wrap}>
      <div style={mq.track}>
        {items.map((d, i) => <span key={i} style={mq.item}>• {d}</span>)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SCHEDULE
═══════════════════════════════════════════════════ */
const DAYS = [
  { key: 'lun', label: 'Lundi' },
  { key: 'mar', label: 'Mardi' },
  { key: 'mer', label: 'Mercredi' },
  { key: 'jeu', label: 'Jeudi' },
  { key: 'ven', label: 'Vendredi' },
  { key: 'sam', label: 'Samedi' },
];

function Schedule() {
  const [activeDay, setActiveDay] = useState('lun');
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // ✅ On passe le code court ('lun') — api.js fait le mapping vers 'Monday'
        const res = await api.getCours(activeDay);
        setCours(res.success ? (res.data || []) : []);
      } catch {
        setCours([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeDay]);

  return (
    <section id="cours" style={sc.section}>
      <div style={sc.container}>
        <div style={sc.header}>
          <div>
            <div style={sectionLabel}>Planning des Cours</div>
            <h2 style={sectionTitle}>Votre semaine <span style={{ color: 'var(--accent)' }}>sportive</span></h2>
          </div>
          <p style={sectionSub}>Des séances adaptées à tous les niveaux, encadrées par nos coachs certifiés.</p>
        </div>

        <div style={sc.tabs}>
          {DAYS.map((d) => (
            <button key={d.key} onClick={() => setActiveDay(d.key)} style={{
              ...sc.tab,
              background:   activeDay === d.key ? 'var(--accent)' : 'var(--bg3)',
              color:        activeDay === d.key ? '#fff' : 'var(--text2)',
              borderColor:  activeDay === d.key ? 'var(--accent)' : 'var(--border)',
            }}>
              {d.label}
            </button>
          ))}
        </div>

        <div style={sc.card}>
          {loading ? (
            <div style={sc.empty}>Chargement...</div>
          ) : cours.length === 0 ? (
            <div style={sc.empty}>Aucun cours prévu ce jour</div>
          ) : (
            cours.map((c) => {
              // ✅ Compatible avec les deux formats (API normalisé ou brut BDD)
              const heure = c.time || c.heure_debut?.toString().substring(0, 5) || '00:00';
              const nom   = c.name || c.type_cours || 'Cours';
              const coach = c.coach
                || (c.coach_prenom ? `${c.coach_prenom} ${c.coach_nom?.charAt(0)}.` : 'Coach');
              const places = c.spots ?? c.places_restantes ?? 0;
              const complet = c.full || places <= 0;

              return (
                <div key={c.id || c.id_cours} style={sc.item}>
                  <div style={sc.time}>{heure}</div>
                  <div style={{ flex: 1 }}>
                    <div style={sc.name}>{nom}</div>
                    <div style={sc.coach}>👤 {coach}</div>
                    {c.salle && <div style={{ ...sc.coach, fontSize: '0.7rem' }}>📍 {c.salle}</div>}
                  </div>
                  <span style={{
                    ...sc.badge,
                    background: complet ? 'rgba(239,68,68,0.13)' : 'rgba(59,130,246,0.13)',
                    color:      complet ? '#ef4444'              : 'var(--accent)',
                  }}>
                    {complet ? 'Complet' : `${places} places`}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PRICING
═══════════════════════════════════════════════════ */
const PLANS_FALLBACK = [
  {
    name: 'Mensuel', price: '2 500', unit: 'DZD',
    period: '/ mois · sans engagement', featured: false,
    features: ['Accès à toute la salle', '5 cours collectifs / mois', 'Vestiaires & douches', 'Application membre'],
    disabled: ['Coaching personnel', 'Suivi nutritionnel'],
  },
  {
    name: 'Trimestriel', price: '6 500', unit: 'DZD',
    period: '/ trimestre · économisez 13 %', featured: true,
    features: ['Accès illimité 7j/7', 'Cours collectifs illimités', 'Vestiaires & douches', 'Application membre', '2 séances coaching / mois'],
    disabled: ['Suivi nutritionnel'],
  },
  {
    name: 'Annuel', price: '22 000', unit: 'DZD',
    period: '/ an · économisez 27 %', featured: false,
    features: ['Accès illimité 7j/7', 'Cours collectifs illimités', 'Vestiaires & douches', 'Application membre', 'Coaching personnel inclus', 'Suivi nutritionnel inclus'],
    disabled: [],
  },
];

function Pricing() {
  const [plans] = useState(PLANS_FALLBACK);

  return (
    <section id="tarifs" style={{ padding: '5rem 1rem', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={sectionLabel}>Nos Abonnements</div>
          <h2 style={sectionTitle}>Des tarifs <span style={{ color: 'var(--accent)' }}>transparents</span></h2>
          <p style={{ ...sectionSub, margin: '0.5rem auto 0', textAlign: 'center' }}>
            Sans frais cachés. Engagez-vous à votre rythme.
          </p>
        </div>

        <div style={pr.grid}>
          {plans.map((p) => (
            <div key={p.name} style={{
              ...pr.card,
              borderColor: p.featured ? 'var(--accent)' : 'var(--border)',
              background:  p.featured
                ? 'linear-gradient(145deg,var(--card) 0%,rgba(59,130,246,0.06) 100%)'
                : 'var(--card)',
            }}>
              {p.featured && <div style={pr.badge}>POPULAIRE</div>}
              <div style={pr.name}>{p.name}</div>
              <div style={pr.price}>{p.price} <span style={pr.unit}>{p.unit}</span></div>
              <div style={pr.period}>{p.period}</div>
              <ul style={pr.features}>
                {p.features.map((f, i) => <li key={i} style={pr.feat}>✓ {f}</li>)}
                {p.disabled.map((f, i) => <li key={`d${i}`} style={{ ...pr.feat, opacity: 0.4 }}>✗ {f}</li>)}
              </ul>
              <a href="#contact" style={p.featured ? pr.btnPrimary : pr.btnOutline}>Choisir</a>
            </div>
          ))}
        </div>

        <div style={pr.notice}>
          <div style={pr.noticeIcon}>👤</div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Nouveau membre ?</div>
            <div style={{ color: 'var(--text2)', fontSize: '0.86rem', lineHeight: 1.65 }}>
              L'inscription se fait uniquement en salle. Rendez-vous à l'accueil muni de votre
              pièce d'identité — notre équipe créera votre compte et vous remettra votre badge d'accès.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   COACHES
═══════════════════════════════════════════════════ */
const COACHES_FALLBACK = [
  { id:1, name:'Karim Benali',    initials:'KB', spec:'Musculation & Force',   bio:"Coach certifié avec 8 ans d'expérience.",  gradient:'linear-gradient(135deg,#030c22,#09204a)' },
  { id:2, name:'Youcef Amrani',   initials:'YA', spec:'CrossFit & HIIT',       bio:'Spécialiste CrossFit, ancien athlète national.', gradient:'linear-gradient(135deg,#0a1a0a,#0d3b0d)' },
  { id:3, name:'Samia Mansouri',  initials:'SM', spec:'Yoga & Bien-être',      bio:'Instructrice certifiée yoga et pilates.',  gradient:'linear-gradient(135deg,#1a0a1a,#3b0d3b)' },
  { id:4, name:'Nadia Rahmani',   initials:'NR', spec:'Cardio & Zumba',        bio:'Formatrice Zumba, cours dynamiques garantis.', gradient:'linear-gradient(135deg,#1a0a05,#3b1a05)' },
  { id:5, name:'Amine Djerbi',    initials:'AD', spec:'Boxe & Arts Martiaux',  bio:'Ancien champion régional de boxe.',        gradient:'linear-gradient(135deg,#0a0a1a,#1a1a3b)' },
];

function Coaches() {
  const [coaches, setCoaches] = useState(COACHES_FALLBACK);

  useEffect(() => {
    api.getCoaches()
      .then((r) => { if (r.success && r.data?.length) setCoaches(r.data); })
      .catch(() => {});
  }, []);

  return (
    <section id="coachs" style={{ padding: '5rem 1rem', background: 'var(--bg2)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem' }}>
          <div style={sectionLabel}>Notre Équipe</div>
          <h2 style={sectionTitle}>Des coachs <span style={{ color: 'var(--accent)' }}>certifiés</span></h2>
        </div>
        <div style={co.grid}>
          {coaches.map((c) => (
            <div key={c.id} style={co.card}>
              <div style={{ ...co.photo, background: c.gradient || 'linear-gradient(135deg,#030c22,#09204a)' }}>
                <span style={co.initials}>{c.initials || c.name?.substring(0,2).toUpperCase()}</span>
              </div>
              <div style={co.body}>
                <div style={co.name}>{c.name}</div>
                <div style={co.spec}>{c.spec || c.specialite}</div>
                <div style={co.bio}>{c.bio}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════════ */
function Contact() {
  const infos = [
    { icon:'📍', label:'Adresse',  value:'12 Rue de la République, Alger Centre, 16000' },
    { icon:'📞', label:'Téléphone', value:'+213 (0) 21 XX XX XX' },
    { icon:'✉️', label:'Email',    value:'contact@elitegym.dz' },
    { icon:'🕐', label:'Horaires', value:'Lun – Ven : 06h00 – 22h00\nSam – Dim : 08h00 – 20h00' },
  ];
  return (
    <section id="contact" style={{ padding: '5rem 1rem', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem' }}>
          <div style={sectionLabel}>Nous Trouver</div>
          <h2 style={sectionTitle}>Venez nous <span style={{ color: 'var(--accent)' }}>rendre visite</span></h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'1.5rem' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {infos.map((info) => (
              <div key={info.label} style={ct.item}>
                <div style={ct.icon}>{info.icon}</div>
                <div>
                  <div style={ct.label}>{info.label}</div>
                  <div style={ct.value}>{info.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={ct.map}>
            <div style={ct.mapGrid} />
            <div style={ct.mapPin} />
            <div style={{ position:'relative', zIndex:2, textAlign:'center' }}>
              <div style={{ fontSize:'2rem', marginBottom:8 }}>📍</div>
              <div style={{ fontWeight:700, color:'var(--text)' }}>ÉLITE GYM</div>
              <div style={{ fontSize:'0.82rem', color:'var(--text2)' }}>12 Rue de la République, Alger</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={ft.wrap}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 1rem' }}>
        <div style={ft.grid}>
          <div>
            <div style={ft.brand}>ÉLITE GYM</div>
            <p style={ft.desc}>La référence du fitness professionnel en Algérie. Plus de 7 ans d'expertise.</p>
          </div>
          <div>
            <div style={ft.heading}>Navigation</div>
            {['accueil','cours','tarifs','coachs','contact'].map((s) => (
              <a key={s} href={`#${s}`} style={ft.link}>{s.charAt(0).toUpperCase()+s.slice(1)}</a>
            ))}
          </div>
          <div>
            <div style={ft.heading}>Horaires</div>
            {[['Lun – Ven','06:00 – 22:00'],['Samedi','08:00 – 20:00'],['Dimanche','08:00 – 18:00']].map(([j,h]) => (
              <div key={j} style={{ display:'flex', justifyContent:'space-between', gap:16, fontSize:'0.84rem', lineHeight:2.1 }}>
                <span style={{ color:'var(--text2)' }}>{j}</span>
                <span style={{ color:'var(--text)', fontWeight:600 }}>{h}</span>
              </div>
            ))}
          </div>
        </div>
        <hr style={{ borderColor:'var(--border)', margin:'2rem 0 1rem' }} />
        <div style={{ display:'flex', justifyContent:'space-between', color:'var(--text3)', fontSize:'0.79rem', flexWrap:'wrap', gap:8 }}>
          <span>© 2026 ÉLITE GYM — Tous droits réservés</span>
          <div style={{ display:'flex', gap:16 }}>
            <a href="#" style={ft.link}>Mentions légales</a>
            <a href="#" style={ft.link}>Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   HOME PAGE (assemblage)
═══════════════════════════════════════════════════ */
export default function HomePage() {
  const [theme, setTheme] = useState(() => localStorage.getItem('eg-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('eg-theme', theme);
  }, [theme]);

  return (
    <>
      <Navbar theme={theme} toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
      <Hero />
      <Marquee />
      <Schedule />
      <Pricing />
      <Coaches />
      <Contact />
      <Footer />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   STYLES PARTAGÉS
═══════════════════════════════════════════════════ */
const sectionLabel = {
  color:'var(--accent)', fontSize:'0.71rem', fontWeight:700,
  letterSpacing:3, textTransform:'uppercase', marginBottom:'0.7rem',
  display:'flex', alignItems:'center', gap:10,
};
const sectionTitle = {
  fontFamily:"'Bebas Neue', sans-serif",
  fontSize:'clamp(1.9rem, 3.8vw, 3rem)',
  letterSpacing:'1.5px', lineHeight:1.06, marginBottom:'0.5rem', color:'var(--text)',
};
const sectionSub = { color:'var(--text2)', fontSize:'0.93rem', lineHeight:1.75, maxWidth:540 };

const nav = {
  bar:{ height:70, background:'rgba(8,9,12,0.88)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)', position:'fixed', width:'100%', top:0, zIndex:1000 },
  inner:{ maxWidth:1200, margin:'0 auto', padding:'0 1rem', height:'100%', display:'flex', alignItems:'center', gap:'1.5rem' },
  brand:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'1.9rem', letterSpacing:3, color:'var(--text)', textDecoration:'none', display:'flex', alignItems:'center', gap:10 },
  dot:{ width:10, height:10, borderRadius:'50%', background:'var(--accent)', display:'inline-block' },
  links:{ display:'flex', gap:4, listStyle:'none', padding:0, margin:'0 auto', flexWrap:'wrap' },
  link:{ color:'var(--text2)', fontWeight:600, fontSize:'0.84rem', letterSpacing:'0.5px', textTransform:'uppercase', padding:'0.5rem 1rem', textDecoration:'none' },
  actions:{ display:'flex', alignItems:'center', gap:8, flexShrink:0 },
  themeBtn:{ background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text)', width:38, height:38, borderRadius:'50%', cursor:'pointer', fontSize:'1rem' },
  loginBtn:{ background:'var(--accent)', color:'#fff', fontWeight:700, fontSize:'0.82rem', letterSpacing:1, textTransform:'uppercase', border:'none', padding:'0.48rem 1.3rem', borderRadius:7, cursor:'pointer', textDecoration:'none', display:'inline-block' },
  burger:{ background:'none', border:'none', color:'var(--text)', fontSize:'1.5rem', cursor:'pointer' },
  mobileMenu:{ display:'flex', flexDirection:'column', padding:'1rem', background:'var(--bg2)', borderTop:'1px solid var(--border)' },
  mobileLink:{ color:'var(--text2)', padding:'0.7rem 0', textDecoration:'none', fontSize:'0.9rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', borderBottom:'1px solid var(--border)' },
};

const hero = {
  section:{ minHeight:'100vh', position:'relative', display:'flex', alignItems:'center', overflow:'hidden', paddingTop:70 },
  slide:{ position:'absolute', inset:0, backgroundSize:'cover', backgroundPosition:'center', transition:'opacity 1.4s ease' },
  overlay:{ position:'absolute', inset:0, background:'linear-gradient(130deg,rgba(8,9,12,0.90) 0%,rgba(8,9,12,0.5) 55%,rgba(8,9,12,0.75) 100%)' },
  content:{ position:'relative', zIndex:2, padding:'2rem 1rem 10rem', maxWidth:1200, margin:'0 auto', width:'100%' },
  tag:{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(59,130,246,0.12)', border:'1px solid rgba(59,130,246,0.28)', color:'var(--accent2)', fontSize:'0.75rem', fontWeight:700, letterSpacing:2, textTransform:'uppercase', padding:'0.38rem 1rem', borderRadius:99, marginBottom:'1.5rem' },
  tagDot:{ width:6, height:6, background:'var(--accent)', borderRadius:'50%', display:'inline-block' },
  title:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(3.2rem,7.5vw,6.8rem)', lineHeight:0.94, letterSpacing:2, marginBottom:'1.2rem', color:'var(--text)' },
  sub:{ color:'var(--text2)', fontSize:'1.05rem', maxWidth:500, lineHeight:1.75, marginBottom:'2rem' },
  ctas:{ display:'flex', flexWrap:'wrap', gap:'1rem' },
  btnPrimary:{ background:'var(--accent)', color:'#fff', fontWeight:700, fontSize:'0.9rem', letterSpacing:'1.2px', textTransform:'uppercase', border:'none', padding:'0.8rem 2rem', borderRadius:8, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:9 },
  btnOutline:{ background:'transparent', color:'var(--text)', border:'1px solid var(--border)', fontWeight:600, fontSize:'0.9rem', letterSpacing:1, textTransform:'uppercase', padding:'0.8rem 2rem', borderRadius:8, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:9 },
  dots:{ position:'absolute', bottom:100, right:28, zIndex:10, display:'flex', flexDirection:'column', gap:7 },
  dot:{ width:3, border:'none', borderRadius:99, cursor:'pointer', transition:'all 0.3s' },
  statsBar:{ position:'absolute', bottom:0, left:0, right:0, zIndex:3, background:'rgba(8,9,12,0.6)', backdropFilter:'blur(16px)', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', flexWrap:'wrap', justifyContent:'center', padding:'0.9rem 1rem' },
  statItem:{ flex:'1 1 120px', minWidth:90, maxWidth:200, textAlign:'center', padding:'0.5rem 0.6rem' },
  statNum:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'1.9rem', color:'var(--accent2)', letterSpacing:2, lineHeight:1 },
  statLabel:{ color:'var(--text2)', fontSize:'0.68rem', fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginTop:'0.12rem' },
};

const mq = {
  wrap:{ background:'var(--accent)', padding:'0.62rem 0', overflow:'hidden', whiteSpace:'nowrap' },
  track:{ display:'inline-flex', gap:'3rem', animation:'marqueeScroll 22s linear infinite' },
  item:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'0.92rem', letterSpacing:3, color:'#fff' },
};

const sc = {
  section:{ background:'var(--bg2)', padding:'5rem 1rem' },
  container:{ maxWidth:1100, margin:'0 auto' },
  header:{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'1rem', marginBottom:'1.5rem' },
  tabs:{ display:'flex', gap:'0.4rem', overflowX:'auto', paddingBottom:'0.4rem', marginBottom:'1.4rem' },
  tab:{ border:'1px solid var(--border)', fontSize:'0.78rem', fontWeight:700, letterSpacing:1, textTransform:'uppercase', padding:'0.46rem 1rem', borderRadius:6, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, transition:'all 0.25s' },
  card:{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12 },
  item:{ display:'flex', alignItems:'center', gap:'1.1rem', padding:'1.05rem 1.3rem', borderLeft:'3px solid var(--border)', borderBottom:'1px solid var(--border)' },
  time:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'1.2rem', letterSpacing:1, color:'var(--accent)', minWidth:68 },
  name:{ fontWeight:700, fontSize:'0.91rem', marginBottom:'0.1rem', color:'var(--text)' },
  coach:{ color:'var(--text3)', fontSize:'0.78rem' },
  badge:{ marginLeft:'auto', flexShrink:0, fontSize:'0.68rem', fontWeight:800, letterSpacing:1, textTransform:'uppercase', padding:'0.26rem 0.7rem', borderRadius:99 },
  empty:{ padding:'2rem', textAlign:'center', color:'var(--text2)' },
};

const pr = {
  grid:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1.5rem', marginBottom:'2rem' },
  card:{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:'2rem', position:'relative', display:'flex', flexDirection:'column' },
  badge:{ position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)', background:'var(--accent)', color:'#fff', fontSize:'0.66rem', fontWeight:800, letterSpacing:2, padding:'0.28rem 0.85rem', borderRadius:99, whiteSpace:'nowrap' },
  name:{ fontSize:'0.74rem', fontWeight:800, letterSpacing:'2.5px', textTransform:'uppercase', color:'var(--text3)', marginBottom:'0.8rem' },
  price:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'3.2rem', letterSpacing:1, lineHeight:1, marginBottom:'0.18rem', color:'var(--text)' },
  unit:{ fontSize:'1.05rem', fontFamily:'inherit', color:'var(--text3)' },
  period:{ color:'var(--text3)', fontSize:'0.79rem', marginBottom:'1.3rem' },
  features:{ listStyle:'none', padding:0, margin:'0 0 1.5rem', flex:1 },
  feat:{ display:'flex', alignItems:'center', gap:'0.65rem', padding:'0.43rem 0', fontSize:'0.85rem', color:'var(--text2)', borderBottom:'1px solid var(--border)' },
  btnPrimary:{ display:'block', textAlign:'center', background:'var(--accent)', color:'#fff', fontWeight:700, padding:'0.75rem', borderRadius:8, textDecoration:'none', fontSize:'0.9rem' },
  btnOutline:{ display:'block', textAlign:'center', background:'transparent', color:'var(--text)', border:'1px solid var(--border)', fontWeight:600, padding:'0.75rem', borderRadius:8, textDecoration:'none', fontSize:'0.9rem' },
  notice:{ background:'rgba(59,130,246,0.07)', border:'1px solid rgba(59,130,246,0.16)', borderRadius:12, padding:'1.75rem', display:'flex', alignItems:'flex-start', gap:'1.2rem', flexWrap:'wrap' },
  noticeIcon:{ width:50, height:50, borderRadius:11, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.35rem', color:'#fff', flexShrink:0 },
};

const co = {
  grid:{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.5rem' },
  card:{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' },
  photo:{ height:195, display:'flex', alignItems:'center', justifyContent:'center' },
  initials:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'4.2rem', letterSpacing:2, color:'rgba(255,255,255,0.22)' },
  body:{ padding:'1.35rem' },
  name:{ fontWeight:700, fontSize:'1.03rem', marginBottom:'0.18rem', color:'var(--text)' },
  spec:{ color:'var(--accent)', fontSize:'0.76rem', fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:'0.65rem' },
  bio:{ color:'var(--text2)', fontSize:'0.82rem', lineHeight:1.6 },
};

const ct = {
  item:{ display:'flex', alignItems:'flex-start', gap:'1.1rem', padding:'1.35rem', background:'var(--card)', border:'1px solid var(--border)', borderRadius:12 },
  icon:{ width:44, height:44, borderRadius:10, background:'rgba(59,130,246,0.11)', border:'1px solid rgba(59,130,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.05rem', flexShrink:0 },
  label:{ fontSize:'0.7rem', fontWeight:800, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--text3)', marginBottom:'0.25rem' },
  value:{ fontWeight:600, fontSize:'0.9rem', color:'var(--text)', lineHeight:1.5, whiteSpace:'pre-line' },
  map:{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:12, minHeight:330, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'0.8rem', position:'relative', overflow:'hidden' },
  mapGrid:{ position:'absolute', inset:0, backgroundImage:'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)', backgroundSize:'38px 38px' },
  mapPin:{ position:'absolute', top:'50%', left:'50%', width:18, height:18, background:'var(--accent)', borderRadius:'50%', transform:'translate(-50%,-50%)', zIndex:2 },
};

const ft = {
  wrap:{ background:'var(--bg2)', borderTop:'1px solid var(--border)', padding:'3rem 0 1.5rem' },
  grid:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'2rem', padding:'0 1rem 1.5rem' },
  brand:{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'1.5rem', letterSpacing:3, color:'var(--text)', marginBottom:'0.65rem' },
  desc:{ color:'var(--text2)', fontSize:'0.84rem', lineHeight:1.72, maxWidth:270 },
  heading:{ fontSize:'0.7rem', fontWeight:800, letterSpacing:2, textTransform:'uppercase', color:'var(--text3)', marginBottom:'0.85rem' },
  link:{ display:'block', color:'var(--text2)', fontSize:'0.85rem', textDecoration:'none', padding:'0.26rem 0' },
};
