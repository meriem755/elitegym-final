// ⚠️ IMPORTANT : Ne garde AUCUN import vers "./components/..."
// Seul React est nécessaire (optionnel avec Vite + React 17+)
import React from 'react';

// ================= ALERTS =================
function Alerts() {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">ALERTES</span>
      </div>
      <div className="alert-list">
        <div className="alert-item warn">
          <div className="alert-text">Tapis roulant en panne</div>
        </div>
        <div className="alert-item info">
          <div className="alert-text">4 nouveaux inscrits</div>
        </div>
        <div className="alert-item success">
          <div className="alert-text">Objectif atteint 🎉</div>
        </div>
      </div>
    </div>
  );
}

// ================= GOALS =================
function Goals() {
  const goals = [
    { icon: "🎯", name: "Sessions réalisées", value: 74, color: "var(--accent)" },
    { icon: "📈", name: "Nouveaux inscrits", value: 60, color: "var(--green)" },
    { icon: "⭐", name: "Note satisfaction", value: 96, color: "var(--blue)" },
    { icon: "🏆", name: "Présence membres", value: 87, color: "var(--orange)" },
    { icon: "💪", name: "Progrès suivis", value: 43, color: "var(--accent2)" },
  ];

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">MES OBJECTIFS DU MOIS</span>
      </div>
      <div className="goal-list">
        {goals.map((goal, index) => (
          <div className="goal-item" key={index}>
            <div className="goal-icon" style={{ background: `${goal.color}22` }}>
              {goal.icon}
            </div>
            <div className="goal-info">
              <div className="goal-name">{goal.name}</div>
              <div className="goal-track">
                <div className="goal-fill" style={{ width: `${goal.value}%`, background: goal.color }} />
              </div>
            </div>
            <div className="goal-pct" style={{ color: goal.color }}>{goal.value}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ================= KPI =================
function KPI() {
  return (
    <div className="kpi-grid">
      <div className="kpi-card accent">
        <div className="kpi-label">Membres actifs</div>
        <div className="kpi-value">247</div>
      </div>
      <div className="kpi-card green">
        <div className="kpi-label">Sessions aujourd'hui</div>
        <div className="kpi-value">8</div>
      </div>
      <div className="kpi-card red">
        <div className="kpi-label">Taux de présence</div>
        <div className="kpi-value">87%</div>
      </div>
      <div className="kpi-card blue">
        <div className="kpi-label">Satisfaction</div>
        <div className="kpi-value">4.8</div>
      </div>
    </div>
  );
}

// ================= MEMBERS =================
function Members() {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">TOP MEMBRES</span>
      </div>
      <div className="member-list">
        <div className="member-row">
          <div className="m-av a">LB</div>
          <div className="m-name">Lina Boukhari</div>
        </div>
        <div className="member-row">
          <div className="m-av b">SM</div>
          <div className="m-name">Samir Mekki</div>
        </div>
        <div className="member-row">
          <div className="m-av c">RB</div>
          <div className="m-name">Rania Belhadj</div>
        </div>
      </div>
    </div>
  );
}

// ================= PLANNING =================
function Planning() {
  const sessions = [
    { name: "Cardio HIIT", time: "07:00 – 08:00", room: "Salle A", members: ["LB", "SM", "KA"], more: 9, status: "Terminé", type: "done" },
    { name: "Yoga Flow", time: "09:30 – 10:30", room: "Salle C", members: ["FZ", "MH"], more: 6, status: "Terminé", type: "done" },
    { name: "Musculation", time: "12:00 – 13:00", room: "Salle B", members: ["RB", "NA"], more: 14, status: "Complet", type: "full" },
    { name: "CrossFit", time: "17:00 – 18:00", room: "Salle A", members: ["AT"], more: 7, status: "En cours", type: "live" },
    { name: "Boxe", time: "19:30 – 20:30", room: "Ring", members: ["YM"], more: 5, status: "À venir", type: "soon" },
  ];

  const getStatusClass = (type) => {
    if (type === "done") return "pill-ok";
    if (type === "full") return "pill-full";
    if (type === "live") return "pill-wait";
    return "";
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">PLANNING DU JOUR</span>
        <a className="panel-action">Voir semaine →</a>
      </div>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Session</th>
            <th>Horaire</th>
            <th>Salle</th>
            <th>Participants</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => (
            <tr key={i}>
              <td><span className="session-badge badge-cardio">{s.name}</span></td>
              <td className="session-time">{s.time}</td>
              <td><span className="session-room">{s.room}</span></td>
              <td>
                <div className="members-pile">
                  {s.members.map((m, idx) => (
                    <div key={idx} className="m-avatar" style={{ background: "var(--card2)", color: "var(--text)" }}>
                      {m}
                    </div>
                  ))}
                  <div className="m-count">+{s.more}</div>
                </div>
              </td>
              <td><span className={`status-pill ${getStatusClass(s.type)}`}>{s.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ================= SIDEBAR =================
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🏋️</div>
        <div>
          <div className="logo-text">FitPro</div>
          <div className="logo-sub">Sports Manager</div>
        </div>
      </div>
      <nav className="nav">
        <div className="nav-section">Espace Coach</div>
        <div className="nav-item active">Tableau de bord</div>
        <div className="nav-item">Planning</div>
        <div className="nav-item">Membres</div>
        <div className="nav-item">Performances</div>
        <div className="nav-item">Programmes</div>
        <div className="nav-section">Gestion</div>
        <div className="nav-item">Salles & équipements</div>
        <div className="nav-item">Messagerie</div>
        <div className="nav-item">Paramètres</div>
      </nav>
    </aside>
  );
}

// ================= STATS =================
function Stats() {
  const data = [
    { day: "Lun", value: 60 },
    { day: "Mar", value: 80 },
    { day: "Mer", value: 55 },
    { day: "Jeu", value: 90 },
    { day: "Ven", value: 75 },
    { day: "Sam", value: 40 },
    { day: "Dim", value: 30 },
  ];

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">FRÉQUENTATION / SEMAINE</span>
      </div>
      <div className="bars">
        {data.map((item, index) => (
          <div key={index} className="bar" style={{
            height: `${item.value}%`,
            background: item.day === "Ven" ? "var(--accent)" : "var(--card2)",
            border: item.day === "Ven" ? "none" : "1px solid var(--border)",
          }} />
        ))}
      </div>
      <div className="bar-labels">
        {data.map((item, index) => (
          <span key={index} className="bar-lbl" style={{ color: item.day === "Ven" ? "var(--accent)" : "" }}>
            {item.day}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
        <div>
          <div style={{ fontSize: "10px", color: "var(--muted)" }}>Pic</div>
          <div style={{ fontSize: "18px", fontWeight: "600" }}>Jeudi</div>
        </div>
        <div>
          <div style={{ fontSize: "10px", color: "var(--muted)" }}>Moy/jour</div>
          <div style={{ fontSize: "18px", fontWeight: "600" }}>34 <span style={{ fontSize: "12px" }}>membres</span></div>
        </div>
        <div>
          <div style={{ fontSize: "10px", color: "var(--muted)" }}>Total</div>
          <div style={{ fontSize: "18px", fontWeight: "600" }}>241 <span style={{ fontSize: "12px" }}>visites</span></div>
        </div>
      </div>
    </div>
  );
}

// ================= TOPBAR =================
function Topbar() {
  return (
    <div className="topbar">
      <div>
        <div className="page-title">Tableau de bord</div>
        <div className="page-sub">Jeudi 17 Avril 2026</div>
      </div>
      <div className="topbar-right">
        <button className="topbar-btn">📄 Rapport</button>
        <button className="topbar-btn primary">➕ Nouvelle session</button>
      </div>
    </div>
  );
}

// ================= APP (LAYOUT PRINCIPAL) =================
function App() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content">
          <KPI />
          <div className="row-2">
            <Planning />
            <Members />
          </div>
          <div className="row-3">
            <Stats />
            <Goals />
            <Alerts />
          </div>
        </div>
      </div>
    </div>
  );
}

// ⚠️ UN SEUL EXPORT À LA FIN !
export default App;
