import { useState, useEffect } from 'react'
import './App.css'

// ============================================================================
// 📦 DONNÉES & CONSTANTES GLOBALES
// ============================================================================

const initialAbonnements = [
  { id: 1, membre: 'Sonia Aït', plan: 'Premium', debut: '2026-01-01', fin: '2026-06-30', status: 'Actif' },
  { id: 2, membre: 'Mohamed Kaci', plan: 'Standard', debut: '2025-11-01', fin: '2026-03-02', status: 'Expiré' },
  { id: 3, membre: 'Lina Bouzid', plan: 'Premium', debut: '2026-03-15', fin: '2026-09-15', status: 'Actif' },
  { id: 4, membre: 'Yacine Hadj', plan: 'Basique', debut: '2026-04-01', fin: '2026-05-01', status: 'En attente' },
  { id: 5, membre: 'Rania Mansouri', plan: 'Premium', debut: '2026-02-01', fin: '2026-12-01', status: 'Actif' },
]

const initialMembers = [
  { id: 1, prenom: 'Sonia', nom: 'Aït', email: 'sonia@mail.com', phone: '0550 001 001', plan: 'Premium', status: 'Actif', expiration: '2026-06-30' },
  { id: 2, prenom: 'Mohamed', nom: 'Kaci', email: 'm.kaci@mail.com', phone: '0550 002 002', plan: 'Standard', status: 'Expiré', expiration: '2026-03-02' },
  { id: 3, prenom: 'Lina', nom: 'Bouzid', email: 'lina@mail.com', phone: '0550 003 003', plan: 'Premium', status: 'Actif', expiration: '2026-09-15' },
  { id: 4, prenom: 'Yacine', nom: 'Hadj', email: 'y.hadj@mail.com', phone: '0550 004 004', plan: 'Basique', status: 'En attente', expiration: '2026-05-01' },
  { id: 5, prenom: 'Rania', nom: 'Mansouri', email: 'rania@mail.com', phone: '0550 005 005', plan: 'Premium', status: 'Actif', expiration: '2026-12-01' },
]

const initialPaiements = [
  { id: 1, membre: 'Sonia Aït', amount: 3500, plan: 'Premium', date: '2026-04-01', method: 'CIB', ref: 'CIB-2026-001', status: 'Validé' },
  { id: 2, membre: 'Lina Bouzid', amount: 3500, plan: 'Premium', date: '2026-04-03', method: 'Espèces', ref: '-', status: 'Validé' },
  { id: 3, membre: 'Amine Beloufa', amount: 2500, plan: 'Standard', date: '2026-04-05', method: 'Virement', ref: 'VIR-0042', status: 'Validé' },
  { id: 4, membre: 'Mohamed Kaci', amount: 2500, plan: 'Standard', date: '2026-03-28', method: 'Espèces', ref: '-', status: 'En attente' },
]

const initialCours = [
  { id: 1, name: 'CrossFit', coach: 'Bilal Meziane', day: 'Lundi', time: '07:00', max: 20, spots: 18, salle: 'Studio cours' },
  { id: 2, name: 'Yoga Flow', coach: 'Nadia Hamdi', day: 'Lundi', time: '09:30', max: 15, spots: 12, salle: 'Studio cours' },
  { id: 3, name: 'Zumba', coach: 'Samia Kerbal', day: 'Mercredi', time: '18:00', max: 25, spots: 25, salle: 'Studio cours' },
  { id: 4, name: 'Musculation', coach: 'Riad Boudiaf', day: 'Jeudi', time: '20:00', max: 20, spots: 8, salle: 'Salle muscu' },
  { id: 5, name: 'Cardio HIIT', coach: 'Bilal Meziane', day: 'Vendredi', time: '08:00', max: 18, spots: 14, salle: 'Salle cardio' },
  { id: 6, name: 'Stretching', coach: 'Nadia Hamdi', day: 'Samedi', time: '10:00', max: 12, spots: 6, salle: 'Studio cours' },
]

const defaultSettings = {
  gymName: 'FitCenter Sétif', phone: '0550 000 000', email: 'contact@fitcenter.dz', address: 'Rue Didouche Mourad, Sétif',
  priceBasic: 1500, priceStandard: 2500, pricePremium: 3500,
  notifExp: true, notifPay: true, weeklyReport: false, twoFA: false, autoAudit: true
}

const JOURS = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
const HEURES = ['07:00','08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00']
const COACHS = ['Bilal Meziane','Nadia Hamdi','Samia Kerbal','Riad Boudiaf']
const SALLES = ['Studio cours','Salle muscu','Salle cardio','Piscine']
const MEMBRES_LIST = ['Sonia Aït','Mohamed Kaci','Lina Bouzid','Yacine Hadj','Rania Mansouri','Amine Beloufa']

// ============================================================================
// 🧰 UTILITAIRES
// ============================================================================

const calculateFin = (debut, duree) => {
  if (!debut) return ''
  const d = new Date(debut); d.setMonth(d.getMonth() + parseInt(duree))
  return d.toISOString().split('T')[0]
}
const getBadgeClass = (s) => ({ 'Actif':'b-active','Expiré':'b-expired','En attente':'b-pending','Suspendu':'b-suspended' }[s] || 'b-pending')
const getPlanBadge = (p) => `b-${p.toLowerCase()}`
const getAuditIcon = (t) => ({
  create:'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  edit:'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  delete:'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2',
  login:'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  pay:'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z'
}[t] || '')

// ============================================================================
// 🧭 SIDEBAR
// ============================================================================

function Sidebar({ activeView, setActiveView, darkMode, toggleDarkMode }) {
  const cls = (v) => `nav-item ${activeView===v?'active':''}`
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-row">
          <div className="logo-icon"><svg viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z"/></svg></div>
          <div><div className="logo-title">FitAdmin Pro</div><div className="logo-sub">Admin</div></div>
        </div>
      </div>
      <nav className="nav-section">
        <div className="nav-label">Principal</div>
        <button className={cls('dashboard')} onClick={()=>setActiveView('dashboard')}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg><span>Tableau de bord</span></button>
        <button className={cls('membres')} onClick={()=>setActiveView('membres')}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg><span>Membres</span></button>
        <button className={cls('abonnements')} onClick={()=>setActiveView('abonnements')}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg><span>Abonnements</span></button>
        <button className={cls('paiements')} onClick={()=>setActiveView('paiements')}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg><span>Paiements</span></button>
        <button className={cls('planning')} onClick={()=>setActiveView('planning')}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg><span>Planning Cours</span></button>
        <div className="nav-label" style={{marginTop:'14px'}}>Administration</div>
        <button className={cls('audit')} onClick={()=>setActiveView('audit')}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-2 7l-2.5-2.5 1.41-1.41L10 13.17l3.59-3.58L15 11l-4 4z"/></svg><span>Journal d'audit</span></button>
        <button className={cls('parametres')} onClick={()=>setActiveView('parametres')}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg><span>Paramètres</span></button>
      </nav>
      <div className="sidebar-footer">
        <button onClick={toggleDarkMode} className="nav-item" style={{justifyContent:'center',gap:'8px'}}>
          <span style={{fontSize:'14px'}}>{darkMode?'☀️':'🌙'}</span><span>{darkMode?'Mode Clair':'Mode Sombre'}</span>
        </button>
      </div>
    </aside>
  )
}

// ============================================================================
// 📊 DASHBOARD
// ============================================================================

function Dashboard({ setActiveView, navigateWithModal }) {
  const stats = [
    { label:'Membres actifs', value:'42', sub:'↑ +3 cette semaine', color:'', icon:'👥' },
    { label:'Revenus du mois', value:'85 400 DA', sub:'↑ +12% vs mois dernier', color:'c-amber', icon:'💰' },
    { label:'Expirés / Suspendus', value:'5', sub:'⚠ 2 à renouveler', color:'c-red', icon:'⏰' },
    { label:"Cours aujourd'hui", value:'8', sub:'Sur 12 prévus cette semaine', color:'c-blue', icon:'📅' },
  ]
  const actions = [
    { label:'Nouveau membre', icon:'👤', target:'membres', modal:'membre' },
    { label:'Nouvel abonnement', icon:'📝', target:'abonnements', modal:'abo' },
    { label:'Enregistrer paiement', icon:'💳', target:'paiements', modal:'paiement' },
    { label:'Créer un cours', icon:'🏋️', target:'planning', modal:'cours' },
  ]
  const recent = [
    { name:'Sonia Aït', email:'sonia@mail.com', initials:'SA', plan:'Premium', status:'Actif', exp:'30 juin 2026' },
    { name:'Mohamed Kaci', email:'m.kaci@mail.com', initials:'MK', plan:'Standard', status:'Expiré', exp:'2 mars 2026' },
    { name:'Lina Bouzid', email:'lina@mail.com', initials:'LB', plan:'Premium', status:'Actif', exp:'15 sept 2026' },
  ]
  return (
    <div className="view active">
      <div className="stats-grid">
        {stats.map((s,i)=><div key={i} className={`stat-card ${s.color}`}><div className="stat-lbl">{s.label}</div><div className="stat-val">{s.value}</div><div className="stat-sub">{s.sub}</div><div className="stat-ico"><span style={{fontSize:'20px'}}>{s.icon}</span></div></div>)}
      </div>
      <div className="qa-grid">
        {actions.map((a,i)=><button key={i} className="qa-btn" onClick={()=>navigateWithModal(a.target,a.modal)} style={{cursor:'pointer'}}><div className="qa-ico"><span style={{fontSize:'18px'}}>{a.icon}</span></div>{a.label}</button>)}
      </div>
      <div className="card">
        <div className="card-hd"><div className="card-ttl">Membres récents</div><div className="card-act" onClick={()=>setActiveView('membres')} style={{cursor:'pointer'}}>Voir tout →</div></div>
        <div className="tbl-wrap">
          <table className="tbl"><thead><tr><th>Membre</th><th>Plan</th><th>Statut</th><th>Expiration</th></tr></thead>
          <tbody>{recent.map((m,i)=><tr key={i}><td><div className="mi"><div className="mav">{m.initials}</div><div><div className="mn">{m.name}</div><div className="me">{m.email}</div></div></div></td><td><span className={`badge ${getPlanBadge(m.plan)}`}>{m.plan}</span></td><td><span className={`badge ${getBadgeClass(m.status)}`}>{m.status}</span></td><td className={m.status==='Expiré'?'txt-dn':'td-muted'}>{m.exp}</td></tr>)}</tbody></table>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 👥 MEMBRES
// ============================================================================

function Membres({ defaultModal, setDefaultModal, addLog }) {
  const [members, setMembers] = useState(()=>{const s=localStorage.getItem('fitadmin_membres');return s?JSON.parse(s):initialMembers})
  const [search,setSearch]=useState(''),[isModalOpen,setIsModalOpen]=useState(false),[editing,setEditing]=useState(null)
  const [form,setForm]=useState({prenom:'',nom:'',email:'',phone:'',plan:'Basique',status:'Actif'})
  useEffect(()=>localStorage.setItem('fitadmin_membres',JSON.stringify(members)),[members])
  useEffect(()=>{if(defaultModal==='membre'){setIsModalOpen(true);setDefaultModal(null)}},[defaultModal,setDefaultModal])
  const filtered=members.filter(m=>`${m.prenom} ${m.nom} ${m.email}`.toLowerCase().includes(search.toLowerCase()))
  const handleChange=e=>setForm({...form,[e.target.name]:e.target.value})
  const openModal=m=>{if(m){setEditing(m);setForm(m)}else{setEditing(null);setForm({prenom:'',nom:'',email:'',phone:'',plan:'Basique',status:'Actif'})};setIsModalOpen(true)}
  const close=()=>{setIsModalOpen(false);setEditing(null)}
  const submit=e=>{e.preventDefault();if(!form.prenom||!form.nom||!form.email)return alert('Champs obligatoires');if(editing){setMembers(members.map(x=>x.id===editing.id?{...x,...form}:x));addLog('edit',`Membre modifié: ${form.prenom} ${form.nom}`)}else{setMembers([...members,{id:Date.now(),...form,expiration:'2026-12-31'}]);addLog('create',`Nouveau membre: ${form.prenom} ${form.nom}`)};close()}
  const del=id=>{if(window.confirm('Supprimer ?')){const m=members.find(x=>x.id===id);setMembers(members.filter(x=>x.id!==id));addLog('delete',`Supprimé: ${m?.prenom} ${m?.nom}`)}}
  return (
    <div className="view active">
      <div className="ph"><div className="ph-title">Gestion des membres</div><button className="btn btn-primary" onClick={()=>openModal()}>➕ Nouveau membre</button></div>
      <div className="card">
        <div className="toolbar"><div className="tb-search"><svg viewBox="0 0 24 24" fill="none" stroke="#5a7a69" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input type="text" placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)}/></div></div>
        <div className="tbl-wrap">
          <table className="tbl"><thead><tr><th>Membre</th><th>Plan</th><th>Statut</th><th>Expiration</th><th>Actions</th></tr></thead>
          <tbody>{filtered.length===0?<tr><td colSpan="5" style={{textAlign:'center',padding:'24px',color:'var(--muted)'}}>Aucun membre trouvé</td></tr>:filtered.map(m=>(<tr key={m.id}><td><div className="mi"><div className="mav">{m.prenom[0]}{m.nom[0]}</div><div><div className="mn">{m.prenom} {m.nom}</div><div className="me">{m.email}</div></div></div></td><td><span className={`badge ${getPlanBadge(m.plan)}`}>{m.plan}</span></td><td><span className={`badge ${getBadgeClass(m.status)}`}>{m.status}</span></td><td className="td-muted">{m.expiration}</td><td><div className="act-row"><button className="abt" onClick={()=>openModal(m)}>✏️</button><button className="abt danger" onClick={()=>del(m.id)}>🗑️</button></div></td></tr>))}</tbody></table>
        </div>
      </div>
      {isModalOpen&&<div className="overlay open" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-title">{editing?'Modifier':'Nouveau membre'}</div><form onSubmit={submit}><div className="fr"><div className="fg"><label>Prénom *</label><input className="fi" name="prenom" value={form.prenom} onChange={handleChange} required/></div><div className="fg"><label>Nom *</label><input className="fi" name="nom" value={form.nom} onChange={handleChange} required/></div></div><div className="fg"><label>Email *</label><input className="fi" name="email" type="email" value={form.email} onChange={handleChange} required/></div><div className="fr"><div className="fg"><label>Téléphone</label><input className="fi" name="phone" value={form.phone} onChange={handleChange}/></div><div className="fg"><label>Plan</label><select className="fi" name="plan" value={form.plan} onChange={handleChange}><option>Basique</option><option>Standard</option><option>Premium</option></select></div></div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={close}>Annuler</button><button type="submit" className="btn btn-primary">Enregistrer</button></div></form></div></div>}
    </div>
  )
}

// ============================================================================
// 📝 ABONNEMENTS
// ============================================================================

function Abonnements({ defaultModal, setDefaultModal }) {
  const [abos,setAbos]=useState(()=>{const s=localStorage.getItem('fitadmin_abos');return s?JSON.parse(s):initialAbonnements})
  const [search,setSearch]=useState(''),[open,setOpen]=useState(false),[edit,setEdit]=useState(null)
  const [form,setForm]=useState({membre:'',plan:'Basique',duree:1,debut:new Date().toISOString().split('T')[0],status:'Actif'})
  useEffect(()=>localStorage.setItem('fitadmin_abos',JSON.stringify(abos)),[abos])
  useEffect(()=>{if(defaultModal==='abo'){setOpen(true);setDefaultModal(null)}},[defaultModal,setDefaultModal])
  const change=e=>{const {name,value}=e.target;const u={...form,[name]:value};if(name==='debut'||name==='duree')u.fin=calculateFin(u.debut,u.duree);setForm(u)}
  const filtered=abos.filter(a=>`${a.membre} ${a.plan}`.toLowerCase().includes(search.toLowerCase()))
  const openModal=a=>{if(a){setEdit(a);setForm({...a,duree:1})}else{setEdit(null);setForm({membre:'',plan:'Basique',duree:1,debut:new Date().toISOString().split('T')[0],status:'Actif',fin:calculateFin(new Date().toISOString().split('T')[0],1)})};setOpen(true)}
  const submit=e=>{e.preventDefault();if(!form.membre)return alert('Sélectionne un membre');const nb={id:edit?edit.id:Date.now(),...form,fin:calculateFin(form.debut,form.duree)};if(edit)setAbos(abos.map(x=>x.id===edit.id?nb:x));else setAbos([...abos,nb]);setOpen(false)}
  const del=id=>{if(window.confirm('Supprimer ?'))setAbos(abos.filter(a=>a.id!==id))}
  return (
    <div className="view active">
      <div className="ph"><div className="ph-title">Gestion des abonnements</div><button className="btn btn-primary" onClick={()=>openModal()}>➕ Nouvel abonnement</button></div>
      <div className="stats-grid" style={{marginBottom:'20px'}}><div className="stat-card"><div className="stat-lbl">Actifs</div><div className="stat-val">{abos.filter(a=>a.status==='Actif').length}</div></div><div className="stat-card c-amber"><div className="stat-lbl">En attente</div><div className="stat-val">{abos.filter(a=>a.status==='En attente').length}</div></div><div className="stat-card c-red"><div className="stat-lbl">Expirés</div><div className="stat-val">{abos.filter(a=>a.status==='Expiré').length}</div></div></div>
      <div className="card">
        <div className="toolbar"><div className="tb-search"><svg viewBox="0 0 24 24" fill="none" stroke="#5a7a69" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input type="text" placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)}/></div></div>
        <div className="tbl-wrap">
          <table className="tbl"><thead><tr><th>Membre</th><th>Plan</th><th>Début</th><th>Fin</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map(a=>(<tr key={a.id}><td className="mn">{a.membre}</td><td><span className={`badge ${getPlanBadge(a.plan)}`}>{a.plan}</span></td><td className="td-muted">{a.debut}</td><td className="td-muted">{a.fin}</td><td><span className={`badge ${getBadgeClass(a.status)}`}>{a.status}</span></td><td><div className="act-row"><button className="abt" onClick={()=>openModal(a)}>✏️</button><button className="abt danger" onClick={()=>del(a.id)}>🗑️</button></div></td></tr>))}</tbody></table>
        </div>
      </div>
      {open&&<div className="overlay open" onClick={()=>setOpen(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-title">{edit?'Modifier':'Nouvel abonnement'}</div><form onSubmit={submit}><div className="fg"><label>Membre *</label><select className="fi" name="membre" value={form.membre} onChange={change} required><option value="">-- Sélectionner --</option>{MEMBRES_LIST.map(m=><option key={m}>{m}</option>)}</select></div><div className="fr"><div className="fg"><label>Plan</label><select className="fi" name="plan" value={form.plan} onChange={change}><option>Basique</option><option>Standard</option><option>Premium</option></select></div><div className="fg"><label>Durée (mois)</label><select className="fi" name="duree" value={form.duree} onChange={change}><option value="1">1 mois</option><option value="3">3 mois</option><option value="6">6 mois</option><option value="12">12 mois</option></select></div></div><div className="fr"><div className="fg"><label>Date début *</label><input className="fi" name="debut" type="date" value={form.debut} onChange={change} required/></div><div className="fg"><label>Date fin (auto)</label><input className="fi" value={calculateFin(form.debut,form.duree)} readOnly style={{background:'#eee'}}/></div></div><div className="fg"><label>Statut</label><select className="fi" name="status" value={form.status} onChange={change}><option>Actif</option><option>En attente</option><option>Suspendu</option></select></div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={()=>setOpen(false)}>Annuler</button><button type="submit" className="btn btn-primary">Enregistrer</button></div></form></div></div>}
    </div>
  )
}

// ============================================================================
// 💳 PAIEMENTS
// ============================================================================

function Paiements({ defaultModal, setDefaultModal, addLog }) {
  const [pays,setPays]=useState(()=>{const s=localStorage.getItem('fitadmin_paiements');return s?JSON.parse(s):initialPaiements})
  const [search,setSearch]=useState(''),[open,setOpen]=useState(false)
  const [form,setForm]=useState({membre:'',amount:'',plan:'Basique',method:'Espèces',ref:'',status:'Validé'})
  useEffect(()=>localStorage.setItem('fitadmin_paiements',JSON.stringify(pays)),[pays])
  useEffect(()=>{if(defaultModal==='paiement'){setOpen(true);setDefaultModal(null)}},[defaultModal,setDefaultModal])
  const total=pays.reduce((a,c)=>a+c.amount,0),mois=pays.filter(p=>p.date.startsWith('2026-04')).reduce((a,c)=>a+c.amount,0),att=pays.filter(p=>p.status==='En attente').length
  const change=e=>setForm({...form,[e.target.name]:e.target.value})
  const submit=e=>{e.preventDefault();if(!form.membre||!form.amount)return alert('Membre et montant requis');const nb={id:Date.now(),...form,amount:parseInt(form.amount),date:new Date().toISOString().split('T')[0]};setPays([nb,...pays]);addLog('pay',`Paiement: ${form.amount} DA - ${form.membre} (${form.method})`);setOpen(false);setForm({membre:'',amount:'',plan:'Basique',method:'Espèces',ref:'',status:'Validé'})}
  const del=id=>{if(window.confirm('Annuler ?'))setPays(pays.filter(p=>p.id!==id))}
  return (
    <div className="view active">
      <div className="ph"><div className="ph-title">Contrôle des paiements</div><button className="btn btn-primary" onClick={()=>setOpen(true)}>➕ Enregistrer paiement</button></div>
      <div className="stats-grid" style={{marginBottom:'24px'}}><div className="stat-card"><div className="stat-lbl">Total encaissé</div><div className="stat-val">{total.toLocaleString()} DA</div></div><div className="stat-card c-amber"><div className="stat-lbl">Ce mois (Avril)</div><div className="stat-val">{mois.toLocaleString()} DA</div></div><div className="stat-card c-red"><div className="stat-lbl">En attente</div><div className="stat-val">{att}</div></div></div>
      <div className="card">
        <div className="toolbar"><div className="tb-search"><svg viewBox="0 0 24 24" fill="none" stroke="#5a7a69" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input type="text" placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)}/></div></div>
        <div className="tbl-wrap">
          <table className="tbl"><thead><tr><th>Membre</th><th>Montant</th><th>Plan</th><th>Date</th><th>Méthode</th><th>Réf</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>{pays.filter(p=>p.membre.toLowerCase().includes(search.toLowerCase())).map(p=>(<tr key={p.id}><td className="mn">{p.membre}</td><td><strong>{p.amount.toLocaleString()} DA</strong></td><td><span className={`badge ${getPlanBadge(p.plan)}`}>{p.plan}</span></td><td className="td-muted">{p.date}</td><td className="td-muted">{p.method}</td><td className="td-muted" style={{fontSize:'11px'}}>{p.ref||'—'}</td><td><span className={`badge ${p.status==='Validé'?'b-active':'b-pending'}`}>{p.status}</span></td><td><button className="abt danger" onClick={()=>del(p.id)}>🗑️</button></td></tr>))}</tbody></table>
        </div>
      </div>
      {open&&<div className="overlay open" onClick={()=>setOpen(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-title">Nouveau Paiement</div><form onSubmit={submit}><div className="fg"><label>Membre *</label><select className="fi" name="membre" value={form.membre} onChange={change} required><option value="">-- Sélectionner --</option>{MEMBRES_LIST.map(m=><option key={m}>{m}</option>)}</select></div><div className="fr"><div className="fg"><label>Montant (DA) *</label><input className="fi" name="amount" type="number" placeholder="0" value={form.amount} onChange={change} required/></div><div className="fg"><label>Plan</label><select className="fi" name="plan" value={form.plan} onChange={change}><option>Basique</option><option>Standard</option><option>Premium</option></select></div></div><div className="fr"><div className="fg"><label>Méthode</label><select className="fi" name="method" value={form.method} onChange={change}><option>Espèces</option><option>Virement</option><option>CIB</option><option>Chèque</option></select></div><div className="fg"><label>Référence</label><input className="fi" name="ref" value={form.ref} onChange={change}/></div></div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={()=>setOpen(false)}>Annuler</button><button type="submit" className="btn btn-primary">Valider</button></div></form></div></div>}
    </div>
  )
}

// ============================================================================
// 📅 PLANNING
// ============================================================================

function Planning({ defaultModal, setDefaultModal }) {
  const [cours,setCours]=useState(()=>{const s=localStorage.getItem('fitadmin_planning');return s?JSON.parse(s):initialCours})
  const [open,setOpen]=useState(false),[edit,setEdit]=useState(null)
  const [form,setForm]=useState({name:'',coach:'',day:'Lundi',time:'08:00',max:20,spots:0,salle:'Studio cours'})
  useEffect(()=>localStorage.setItem('fitadmin_planning',JSON.stringify(cours)),[cours])
  useEffect(()=>{if(defaultModal==='cours'){setOpen(true);setDefaultModal(null)}},[defaultModal,setDefaultModal])
  const change=e=>setForm({...form,[e.target.name]:e.target.value})
  const openModal=c=>{if(c){setEdit(c);setForm(c)}else{setEdit(null);setForm({name:'',coach:'',day:'Lundi',time:'08:00',max:20,spots:0,salle:'Studio cours'})};setOpen(true)}
  const submit=e=>{e.preventDefault();if(!form.name||!form.coach)return alert('Nom et coach requis');const nb={id:edit?edit.id:Date.now(),...form,spots:parseInt(form.spots),max:parseInt(form.max)};if(edit)setCours(cours.map(c=>c.id===edit.id?nb:c));else setCours([...cours,nb]);setOpen(false)}
  const del=id=>{if(window.confirm('Supprimer ?'))setCours(cours.filter(c=>c.id!==id))}
  return (
    <div className="view active">
      <div className="ph"><div className="ph-title">Planning des cours</div><button className="btn btn-primary" onClick={()=>openModal()}>➕ Créer un cours</button></div>
      <div className="card" style={{marginBottom:'20px'}}>
        <div className="card-hd"><div className="card-ttl">Vue hebdomadaire</div></div>
        <div style={{overflowX:'auto',padding:'14px'}}>
          <div className="planning-grid">
            <div className="pg-hd">Heure</div>
            {JOURS.map(j=><div key={`hd-${j}`} className="pg-hd">{j}</div>)}
            {HEURES.map(h=>{const cells=JOURS.map(j=>{const slot=cours.filter(c=>c.day===j&&c.time===h);return(<div key={`cell-${j}-${h}`} className="pg-cell">{slot.map(c=>{const full=c.spots>=c.max;return<div key={c.id} className={`pg-event${full?' full':''}`} onClick={()=>openModal(c)}><div className="pg-event-name">{c.name}</div><div className="pg-event-coach">{c.coach.split(' ')[0]}</div></div>})}</div>)});return[<div key={`time-${h}`} className="pg-time">{h}</div>,...cells]})}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-hd"><div className="card-ttl">Liste des cours</div></div>
        <div className="tbl-wrap">
          <table className="tbl"><thead><tr><th>Cours</th><th>Coach</th><th>Jour</th><th>Heure</th><th>Salle</th><th>Capacité</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>{cours.map(c=>{const pct=Math.round((c.spots/c.max)*100),full=c.spots>=c.max;return(<tr key={c.id}><td><div className="mn">{c.name}</div></td><td className="td-muted">{c.coach}</td><td className="td-muted">{c.day}</td><td className="td-muted">{c.time}</td><td className="td-muted">{c.salle}</td><td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div className="prog-bar" style={{width:'60px'}}><div className={`prog-fill${full?' fill-red':''}`} style={{width:`${pct}%`}}></div></div><span style={{fontSize:'11.5px',color:full?'var(--red)':'var(--muted)'}}>{c.spots}/{c.max}</span></div></td><td><span className={`badge ${full?'b-expired':'b-active'}`}>{full?'Complet':'Disponible'}</span></td><td><div className="act-row"><button className="abt" onClick={()=>openModal(c)}>✏️</button><button className="abt danger" onClick={()=>del(c.id)}>🗑️</button></div></td></tr>)})}</tbody></table>
        </div>
      </div>
      {open&&<div className="overlay open" onClick={()=>setOpen(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-title">{edit?'Modifier':'Nouveau cours'}</div><form onSubmit={submit}><div className="fr"><div className="fg"><label>Nom *</label><input className="fi" name="name" value={form.name} onChange={change} required/></div><div className="fg"><label>Coach *</label><select className="fi" name="coach" value={form.coach} onChange={change} required><option value="">-- Choisir --</option>{COACHS.map(c=><option key={c}>{c}</option>)}</select></div></div><div className="fr"><div className="fg"><label>Jour</label><select className="fi" name="day" value={form.day} onChange={change}>{JOURS.map(j=><option key={j}>{j}</option>)}</select></div><div className="fg"><label>Heure</label><input className="fi" name="time" type="time" value={form.time} onChange={change}/></div></div><div className="fr"><div className="fg"><label>Capacité max</label><input className="fi" name="max" type="number" min="1" value={form.max} onChange={change}/></div><div className="fg"><label>Inscrits</label><input className="fi" name="spots" type="number" min="0" value={form.spots} onChange={change}/></div></div><div className="fg"><label>Salle</label><select className="fi" name="salle" value={form.salle} onChange={change}>{SALLES.map(s=><option key={s}>{s}</option>)}</select></div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={()=>setOpen(false)}>Annuler</button><button type="submit" className="btn btn-primary">Enregistrer</button></div></form></div></div>}
    </div>
  )
}

// ============================================================================
// 📋 AUDIT
// ============================================================================

function Audit({ logs }) {
  const [search,setSearch]=useState(''),[filter,setFilter]=useState('')
  const filtered=logs.filter(l=>l.desc.toLowerCase().includes(search.toLowerCase())&&(filter?l.type===filter:true))
  const iconCls=t=>({create:'ai-create',edit:'ai-edit',delete:'ai-delete',login:'ai-login',pay:'ai-pay'}[t]||'ai-edit')
  return (
    <div className="view active">
      <div className="ph"><div className="ph-title">Journal d'audit</div><span style={{color:'var(--muted)',fontSize:'12.5px'}}>{logs.length} entrées</span></div>
      <div className="card">
        <div className="toolbar">
          <div className="tb-search"><svg viewBox="0 0 24 24" fill="none" stroke="#5a7a69" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input type="text" placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          <select className="sel" value={filter} onChange={e=>setFilter(e.target.value)}><option value="">Toutes actions</option><option value="create">Création</option><option value="edit">Modification</option><option value="delete">Suppression</option><option value="login">Connexion</option><option value="pay">Paiement</option></select>
        </div>
        <div style={{maxHeight:'600px',overflowY:'auto'}}>
          {filtered.length===0?<div className="empty"><p>Aucune entrée trouvée</p></div>:filtered.map(l=>(<div key={l.id} className="audit-item"><div className={`audit-icon ${iconCls(l.type)}`}><svg viewBox="0 0 24 24" fill="currentColor"><path d={getAuditIcon(l.type)}/></svg></div><div className="audit-txt"><div className="audit-action">{l.desc}</div><div className="audit-meta">Par {l.user||'Système'} • {l.type.toUpperCase()}</div></div><div className="audit-time">{l.time}</div></div>))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ⚙️ PARAMÈTRES
// ============================================================================

function Parametres() {
  const [settings,setSettings]=useState(()=>{const s=localStorage.getItem('fitadmin_settings');return s?{...defaultSettings,...JSON.parse(s)}:defaultSettings})
  useEffect(()=>localStorage.setItem('fitadmin_settings',JSON.stringify(settings)),[settings])
  const change=e=>{const {name,value,type,checked}=e.target;setSettings(p=>({...p,[name]:type==='checkbox'?checked:value}))}
  const save=()=>{localStorage.setItem('fitadmin_settings',JSON.stringify(settings));alert('Paramètres sauvegardés !')}
  const reset=()=>{if(window.confirm('Restaurer les défauts ?'))setSettings(defaultSettings)}
  const Toggle=({name,checked,onChange})=><label className="toggle"><input type="checkbox" name={name} checked={checked} onChange={onChange}/><span className="toggle-slider"></span></label>
  return (
    <div className="view active">
      <div className="ph"><div className="ph-title">Paramètres généraux</div><div className="ph-actions"><button className="btn btn-outline" onClick={reset}>↺ Restaurer défauts</button><button className="btn btn-primary" onClick={save}>💾 Sauvegarder</button></div></div>
      <div className="card" style={{padding:'24px'}}>
        <div className="param-section"><div className="param-section-title">Informations de la salle</div><div className="fr" style={{marginBottom:'16px'}}><div className="fg"><label>Nom de la salle</label><input className="fi" name="gymName" value={settings.gymName} onChange={change}/></div><div className="fg"><label>Téléphone</label><input className="fi" name="phone" value={settings.phone} onChange={change}/></div></div><div className="fr"><div className="fg"><label>Email contact</label><input className="fi" name="email" value={settings.email} onChange={change}/></div><div className="fg"><label>Adresse</label><input className="fi" name="address" value={settings.address} onChange={change}/></div></div></div>
        <div className="param-section"><div className="param-section-title">Tarifs des formules (DA)</div><div className="fr3"><div className="fg"><label>Basique / mois</label><input className="fi" name="priceBasic" type="number" value={settings.priceBasic} onChange={change}/></div><div className="fg"><label>Standard / mois</label><input className="fi" name="priceStandard" type="number" value={settings.priceStandard} onChange={change}/></div><div className="fg"><label>Premium / mois</label><input className="fi" name="pricePremium" type="number" value={settings.pricePremium} onChange={change}/></div></div></div>
        <div className="param-section"><div className="param-section-title">Notifications & Alertes</div><div className="param-row"><div><div className="param-lbl">Alerte expiration J-7</div><div className="param-desc">Notifier 7 jours avant expiration</div></div><Toggle name="notifExp" checked={settings.notifExp} onChange={change}/></div><div className="param-row"><div><div className="param-lbl">Alerte paiement manqué</div><div className="param-desc">Notifier en cas de retard</div></div><Toggle name="notifPay" checked={settings.notifPay} onChange={change}/></div><div className="param-row"><div><div className="param-lbl">Rapport hebdomadaire auto</div><div className="param-desc">Générer le rapport chaque lundi</div></div><Toggle name="weeklyReport" checked={settings.weeklyReport} onChange={change}/></div></div>
        <div className="param-section"><div className="param-section-title">Sécurité</div><div className="param-row"><div><div className="param-lbl">Double authentification</div><div className="param-desc">Activer la 2FA pour tous les admins</div></div><Toggle name="twoFA" checked={settings.twoFA} onChange={change}/></div><div className="param-row"><div><div className="param-lbl">Journal d'audit automatique</div><div className="param-desc">Enregistrer toutes les actions</div></div><Toggle name="autoAudit" checked={settings.autoAudit} onChange={change}/></div></div>
      </div>
    </div>
  )
}

// ============================================================================
// 🚀 APP PRINCIPALE
// ============================================================================

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')
  const [defaultModal, setDefaultModal] = useState(null)
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('fitadmin_audit')
    return saved ? JSON.parse(saved) : [
      { id: 1, type: 'login', desc: 'Connexion administrateur: Karim A.', time: new Date().toLocaleString('fr-DZ'), user: 'Karim A.' }
    ]
  })

  useEffect(() => { localStorage.setItem('fitadmin_audit', JSON.stringify(auditLogs)) }, [auditLogs])
  useEffect(() => {
    if (darkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark') }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light') }
  }, [darkMode])

  const addLog = (type, desc) => {
    const newLog = { id: Date.now(), type, desc, time: new Date().toLocaleString('fr-DZ'), user: 'Karim A.' }
    setAuditLogs(prev => [newLog, ...prev])
  }

  const toggleDarkMode = () => setDarkMode(prev => !prev)
  const navigateWithModal = (view, modal) => { setDefaultModal(modal); setActiveView(view) }

  return (
    <div className="app-layout">
      <Sidebar activeView={activeView} setActiveView={setActiveView} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="main">
        <div className="content">
          {activeView === 'dashboard' && <Dashboard setActiveView={setActiveView} navigateWithModal={navigateWithModal} />}
          {activeView === 'membres' && <Membres defaultModal={defaultModal} setDefaultModal={setDefaultModal} addLog={addLog} />}
          {activeView === 'abonnements' && <Abonnements defaultModal={defaultModal} setDefaultModal={setDefaultModal} />}
          {activeView === 'paiements' && <Paiements defaultModal={defaultModal} setDefaultModal={setDefaultModal} addLog={addLog} />}
          {activeView === 'planning' && <Planning defaultModal={defaultModal} setDefaultModal={setDefaultModal} />}
          {activeView === 'audit' && <Audit logs={auditLogs} />}
          {activeView === 'parametres' && <Parametres />}
          {!['dashboard','membres','abonnements','paiements','planning','audit','parametres'].includes(activeView) && (
            <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
              <h2 style={{ color: 'var(--text)', marginBottom: '10px' }}>Module "{activeView.charAt(0).toUpperCase() + activeView.slice(1)}"</h2>
              <p style={{ color: 'var(--muted)' }}>Ce module est en cours de développement pour le PFE.</p>
              <button className="btn btn-primary" onClick={() => setActiveView('dashboard')} style={{ marginTop: '20px' }}>Retour au tableau de bord</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
