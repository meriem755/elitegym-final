/* ═══════════════════════════════════════════════
   FITADMIN PRO - DUAL THEME (Light/Dark)
   ═══════════════════════════════════════════════ */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  /* === MODE CLAIR (défaut) === */
  --bg: #f8faf9;
  --card: #ffffff;
  --card2: #f1f5f9;
  --border: rgba(26, 60, 46, 0.12);
  --text: #0f2419;
  --muted: #5a7a69;
  --accent: #2d6a4f;
  --accent2: #e74c3c;
  --green: #40916c;
  --blue: #3498db;
  --orange: #f39c12;
  --purple: #8e44ad;
  --sw: 240px;
  --radius: 12px;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  --trans: all 0.2s ease;
}

/* === MODE SOMBRE === */
html.dark {
  --bg: #0A0A0F;
  --card: #13131A;
  --card2: #1C1C26;
  --border: #2A2A38;
  --text: #F0F0F8;
  --muted: #7A7A96;
  --accent: #E8FF3C;
  --accent2: #FF4B4B;
  --green: #3DFFA0;
  --blue: #4B9EFF;
  --orange: #FF8A3D;
  --purple: #9D7BFF;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
  line-height: 1.5;
  transition: background 0.3s, color 0.3s;
}

a { text-decoration: none; color: inherit; }
button { cursor: pointer; font-family: inherit; border: none; background: none; }
input, select, textarea { font-family: inherit; }

/* ═══════════════════════════════════════════════
   LAYOUT
   ═══════════════════════════════════════════════ */
.app-layout { 
  display: flex;
  min-height: 100vh;
  background: var(--bg);
}

/* ═══════════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════════ */
.sidebar {
  background: var(--card);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0;
  height: 100vh;
  width: var(--sw);
  z-index: 100;
  overflow-y: auto;
  transition: background 0.3s, border-color 0.3s;
}

.logo { padding: 24px 20px; border-bottom: 1px solid var(--border); }
.logo-row { display: flex; align-items: center; gap: 10px; }
.logo-icon {
  width: 36px; height: 36px;
  background: var(--accent);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.logo-icon svg { width: 20px; height: 20px; }
html.dark .logo-icon svg { stroke: #000; }
.logo-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 20px;
  letter-spacing: 1px;
  color: var(--accent);
}
.logo-sub {
  font-size: 10px;
  color: var(--muted);
  font-weight: 300;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid var(--border);
  margin-top: auto;
}
.admin-card {
  display: flex; align-items: center; gap: 12px;
  padding: 8px;
  border-radius: 8px;
  background: var(--card2);
}
.av {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blue), var(--accent));
  display: flex; align-items: center; justify-content: center;
  font-weight: 600; font-size: 14px;
  color: #fff;
  flex-shrink: 0;
}
html.dark .av { color: #000; }

.admin-name { font-size: 13px; font-weight: 500; color: var(--text); }
.admin-role { font-size: 11px; color: var(--accent); letter-spacing: 1px; text-transform: uppercase; font-weight: 500; }

.nav-section { padding: 16px 20px 8px; }
.nav-label {
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 500;
  padding: 0 20px;
  margin-bottom: 4px;
}
.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 20px;
  cursor: pointer;
  transition: var(--trans);
  border-left: 3px solid transparent;
  color: var(--muted);
  font-size: 13px;
  font-weight: 400;
  width: 100%;
  text-align: left;
  background: none;
}
.nav-item:hover {
  background: var(--card2);
  color: var(--text);
  border-left-color: var(--border);
}
.nav-item.active {
  background: rgba(45, 106, 79, 0.08);
  color: var(--accent);
  border-left-color: var(--accent);
  font-weight: 500;
}
html.dark .nav-item.active { background: rgba(232, 255, 60, 0.08); }
.nav-item svg { width: 16px; height: 16px; flex-shrink: 0; }
.nav-badge {
  margin-left: auto;
  background: var(--accent2);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 20px;
}

/* ═══════════════════════════════════════════════
   MAIN & TOPBAR
   ═══════════════════════════════════════════════ */
.main {
  margin-left: var(--sw);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg);
  transition: background 0.3s;
  width: calc(100% - var(--sw));
  flex: 1;
}

.topbar {
  padding: 18px 28px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--card);
  position: sticky; top: 0; z-index: 50;
  transition: background 0.3s, border-color 0.3s;
}
.page-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 26px;
  letter-spacing: 1px;
  color: var(--text);
}
.page-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }
.topbar-right { display: flex; align-items: center; gap: 12px; }

/* BUTTONS */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--trans);
  font-family: 'DM Sans', sans-serif;
}
.btn svg { width: 13px; height: 13px; }
.btn-outline {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
}
.btn-outline:hover { background: var(--card2); border-color: var(--muted); }
.btn-primary {
  background: var(--accent);
  color: #fff;
  border: 1px solid var(--accent);
  font-weight: 600;
}
html.dark .btn-primary { color: #000; }
.btn-primary:hover { filter: brightness(0.95); }
.btn-danger { background: rgba(231, 76, 60, 0.1); color: var(--accent2); border: 1px solid rgba(231, 76, 60, 0.3); }
.btn-danger:hover { background: rgba(231, 76, 60, 0.2); }

.icon-btn {
  width: 36px; height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--card2);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  color: var(--text);
  transition: var(--trans);
}
.icon-btn:hover { background: var(--border); }
.notif-dot {
  width: 8px; height: 8px;
  background: var(--accent2);
  border-radius: 50%;
  position: absolute; top: 7px; right: 7px;
  border: 2px solid var(--card);
}

.search-box, .tb-search {
  display: flex; align-items: center; gap: 7px;
  background: var(--card2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
}
.search-box svg, .tb-search svg { width: 13px; height: 13px; color: var(--muted); }
.search-box input, .tb-search input {
  border: none; background: none; outline: none;
  font-size: 12px; color: var(--text);
  width: 160px;
}
.search-box input::placeholder, .tb-search input::placeholder { color: var(--muted); }

/* ═══════════════════════════════════════════════
   CONTENT
   ═══════════════════════════════════════════════ */
.content {
  padding: 24px 28px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 100%;
}
.view { display: none; }
.view.active { display: block; }

.ph { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 10px; }
.ph-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 24px;
  letter-spacing: 1px;
  color: var(--text);
}
.ph-actions { display: flex; gap: 8px; flex-wrap: wrap; }

/* ═══════════════════════════════════════════════
   KPI / STATS
   ═══════════════════════════════════════════════ */
.stats-grid, .kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 8px;
}
.stat-card, .kpi-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s, background 0.3s;
}
.stat-card:hover, .kpi-card:hover { border-color: var(--accent); }
.stat-card::before, .kpi-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0;
  height: 3px;
  border-radius: var(--radius) var(--radius) 0 0;
}
.stat-card::before, .kpi-card.accent::before { background: var(--accent); }
.stat-card.c-amber::before, .kpi-card.red::before { background: var(--accent2); }
.stat-card.c-blue::before, .kpi-card.green::before { background: var(--green); }
.stat-card.c-purple::before, .kpi-card.blue::before { background: var(--blue); }

.stat-lbl, .kpi-label {
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 500;
}
.stat-val, .kpi-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 38px;
  letter-spacing: 1px;
  line-height: 1;
  margin: 8px 0 4px;
  color: var(--text);
}
.stat-sub, .kpi-trend {
  font-size: 11px;
  display: flex; align-items: center; gap: 4px;
  color: var(--muted);
}
.txt-up, .kpi-trend.up { color: var(--green); }
.txt-dn, .kpi-trend.down { color: var(--accent2); }

.stat-ico, .kpi-icon {
  position: absolute; right: 16px; top: 16px;
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.stat-ico, .kpi-icon.accent { background: rgba(45, 106, 79, 0.1); color: var(--accent); }
html.dark .stat-ico, html.dark .kpi-icon.accent { background: rgba(232, 255, 60, 0.1); }
.stat-card.c-red .stat-ico, .kpi-icon.red { background: rgba(231, 76, 60, 0.1); color: var(--accent2); }
.stat-card.c-blue .stat-ico, .kpi-icon.green { background: rgba(64, 145, 108, 0.1); color: var(--green); }
html.dark .stat-card.c-blue .stat-ico, html.dark .kpi-icon.green { background: rgba(61, 255, 160, 0.1); }
.stat-card.c-purple .stat-ico, .kpi-icon.blue { background: rgba(52, 152, 219, 0.1); color: var(--blue); }
html.dark .stat-card.c-purple .stat-ico, html.dark .kpi-icon.blue { background: rgba(75, 158, 255, 0.1); }

/* ═══════════════════════════════════════════════
   CARDS
   ═══════════════════════════════════════════════ */
.card, .panel {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 16px;
  transition: background 0.3s, border-color 0.3s;
}
.card-hd, .panel-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.card-ttl, .panel-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--text);
}
.card-act, .panel-action {
  font-size: 11px;
  color: var(--accent);
  cursor: pointer;
}
.card-act:hover, .panel-action:hover { opacity: 0.8; }

/* ═══════════════════════════════════════════════
   TABLES
   ═══════════════════════════════════════════════ */
.tbl-wrap { overflow-x: auto; }
.tbl { width: 100%; border-collapse: collapse; }
.tbl th {
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 500;
  padding: 0 0 12px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}
.tbl td {
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  vertical-align: middle;
  color: var(--text);
}
.tbl tr:last-child td { border-bottom: none; }
.tbl tr:hover td { background: var(--card2); }

.mi { display: flex; align-items: center; gap: 9px; }
.mav {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--card2);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 600;
  color: var(--accent);
  flex-shrink: 0;
}
.mn { font-weight: 500; font-size: 12.5px; color: var(--text); }
.me { font-size: 11px; color: var(--muted); }
.td-muted { color: var(--muted); }

/* ═══════════════════════════════════════════════
   BADGES
   ═══════════════════════════════════════════════ */
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.b-active, .badge.b-active { background: rgba(64, 145, 108, 0.12); color: var(--green); }
html.dark .b-active { background: rgba(61, 255, 160, 0.12); }
.b-expired, .badge.b-expired { background: rgba(231, 76, 60, 0.12); color: var(--accent2); }
.b-pending, .badge.b-pending { background: rgba(243, 156, 18, 0.12); color: var(--orange); }
.b-suspended { background: rgba(122, 122, 150, 0.12); color: var(--muted); }
.b-premium { background: rgba(142, 68, 173, 0.12); color: var(--purple); }
html.dark .b-premium { background: rgba(157, 123, 255, 0.12); color: var(--purple); }
.b-standard { background: rgba(52, 152, 219, 0.12); color: var(--blue); }
html.dark .b-standard { background: rgba(75, 158, 255, 0.12); color: var(--blue); }
.b-basic { background: rgba(45, 106, 79, 0.12); color: var(--accent); }
html.dark .b-basic { background: rgba(232, 255, 60, 0.12); color: var(--accent); }

.badge-cardio { background: rgba(231, 76, 60, 0.15); color: var(--accent2); }
.badge-yoga { background: rgba(52, 152, 219, 0.15); color: var(--blue); }
.badge-force { background: rgba(45, 106, 79, 0.15); color: var(--accent); }
.badge-hiit { background: rgba(243, 156, 18, 0.15); color: var(--orange); }
.badge-box { background: rgba(64, 145, 108, 0.15); color: var(--green); }

/* ═══════════════════════════════════════════════
   ACTIONS
   ═══════════════════════════════════════════════ */
.act-row { display: flex; gap: 5px; }
.abt {
  width: 26px; height: 26px;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--card2);
  transition: var(--trans);
  color: var(--text);
}
.abt:hover { background: var(--border); }
.abt.danger:hover { background: rgba(231, 76, 60, 0.15); color: var(--accent2); }
.abt.warn:hover { background: rgba(243, 156, 18, 0.15); color: var(--orange); }
.abt svg { width: 12px; height: 12px; }

/* ═══════════════════════════════════════════════
   TOOLBAR
   ═══════════════════════════════════════════════ */
.toolbar {
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.sel {
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 7px;
  font-size: 12px;
  background: var(--card2);
  color: var(--text);
  outline: none;
  font-family: 'DM Sans', sans-serif;
}
.sel:focus { border-color: var(--accent); }

/* ═══════════════════════════════════════════════
   MODALS
   ═══════════════════════════════════════════════ */
.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}
html.dark .overlay { background: rgba(0, 0, 0, 0.75); }
.overlay.open { display: flex; }
.modal {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 26px;
  width: 520px;
  max-width: 96vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow);
  animation: up 0.2s ease;
  transition: background 0.3s, border-color 0.3s;
}
.modal-lg { width: 680px; }
@keyframes up { from { transform: translateY(18px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.modal-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 20px;
  letter-spacing: 1px;
  color: var(--text);
  margin-bottom: 18px;
}
.fg { margin-bottom: 12px; }
.fg label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 5px;
}
.fi, .fs, .fta {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 9px 11px;
  font-size: 12.5px;
  font-family: 'DM Sans', sans-serif;
  color: var(--text);
  background: var(--card2);
  outline: none;
  transition: border-color 0.2s;
}
.fi:focus, .fs:focus, .fta:focus { border-color: var(--accent); }
.fta { resize: vertical; min-height: 70px; }
.fr { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.fr3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.modal-footer {
  display: flex; gap: 8px;
  justify-content: flex-end;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

/* ═══════════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════════ */
.toast {
  position: fixed;
  bottom: 22px; right: 22px;
  z-index: 9999;
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 11px 18px;
  border-radius: 9px;
  font-size: 12.5px;
  box-shadow: var(--shadow);
  transform: translateY(60px);
  opacity: 0;
  transition: all 0.3s;
  pointer-events: none;
  max-width: 320px;
}
.toast.show { transform: translateY(0); opacity: 1; }
.toast.err { border-left: 3px solid var(--accent2); }
.toast.warn { border-left: 3px solid var(--orange); }

/* ═══════════════════════════════════════════════
   PROGRESS
   ═══════════════════════════════════════════════ */
.prog-row { padding: 10px 0; display: flex; flex-direction: column; gap: 12px; }
.prog-hd { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 11.5px; }
.prog-lbl { font-weight: 500; color: var(--text); }
.prog-bar { height: 5px; background: var(--card2); border-radius: 3px; overflow: hidden; }
.prog-fill { height: 100%; background: var(--accent); border-radius: 3px; transition: width 0.5s; }
.fill-amber { background: var(--orange); }
.fill-red { background: var(--accent2); }
.fill-blue { background: var(--blue); }

.two-col { display: grid; grid-template-columns: 1fr 360px; gap: 16px; }
.three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.qa-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }

.qa-btn {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 10px;
  cursor: pointer;
  transition: var(--trans);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--text);
}
.qa-btn:hover { background: var(--card2); border-color: var(--accent); }
.qa-ico {
  width: 36px; height: 36px;
  border-radius: 9px;
  background: rgba(45, 106, 79, 0.1);
  display: flex; align-items: center; justify-content: center;
}
html.dark .qa-ico { background: rgba(232, 255, 60, 0.1); }
.qa-ico svg { width: 16px; height: 16px; color: var(--accent); }

/* ═══════════════════════════════════════════════
   PLANNING
   ═══════════════════════════════════════════════ */
.planning-grid {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  gap: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}
.pg-hd {
  background: var(--card2);
  padding: 8px 6px;
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--muted);
  text-align: center;
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
}
.pg-hd:last-child { border-right: none; }
.pg-time {
  background: var(--card2);
  padding: 8px 6px;
  font-size: 10.5px;
  color: var(--muted);
  text-align: center;
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
}
.pg-cell {
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
  min-height: 52px;
  padding: 3px;
  background: var(--card);
}
.pg-cell:last-child { border-right: none; }
.pg-event {
  background: rgba(45, 106, 79, 0.1);
  border-left: 3px solid var(--accent);
  border-radius: 4px;
  padding: 3px 5px;
  font-size: 10px;
  margin-bottom: 2px;
  cursor: pointer;
  transition: var(--trans);
}
html.dark .pg-event { background: rgba(232, 255, 60, 0.1); }
.pg-event:hover { filter: brightness(0.95); }
.pg-event.full { background: rgba(231, 76, 60, 0.15); border-left-color: var(--accent2); }
.pg-event.full:hover { filter: brightness(0.9); }
.pg-event-name { font-weight: 600; color: var(--text); }
.pg-event-coach { opacity: 0.75; font-size: 9px; }

/* ═══════════════════════════════════════════════
   AUDIT
   ═══════════════════════════════════════════════ */
.audit-item {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid var(--border);
}
.audit-item:last-child { border-bottom: none; }
.audit-icon {
  width: 30px; height: 30px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.audit-icon svg { width: 13px; height: 13px; }
.ai-create { background: rgba(45, 106, 79, 0.1); color: var(--accent); }
html.dark .ai-create { background: rgba(232, 255, 60, 0.1); }
.ai-edit { background: rgba(52, 152, 219, 0.1); color: var(--blue); }
html.dark .ai-edit { background: rgba(75, 158, 255, 0.1); }
.ai-delete { background: rgba(231, 76, 60, 0.1); color: var(--accent2); }
.ai-login { background: rgba(142, 68, 173, 0.1); color: var(--purple); }
html.dark .ai-login { background: rgba(157, 123, 255, 0.1); }
.ai-pay { background: rgba(243, 156, 18, 0.1); color: var(--orange); }
.audit-txt { flex: 1; }
.audit-action { font-size: 12.5px; font-weight: 500; color: var(--text); }
.audit-meta { font-size: 11px; color: var(--muted); margin-top: 2px; }
.audit-time { font-size: 11px; color: var(--muted); white-space: nowrap; }

/* ═══════════════════════════════════════════════
   PARAMS
   ═══════════════════════════════════════════════ */
.param-section { margin-bottom: 20px; }
.param-section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.param-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}
.param-row:last-child { border-bottom: none; }
.param-lbl { font-size: 12.5px; font-weight: 500; color: var(--text); }
.param-desc { font-size: 11px; color: var(--muted); margin-top: 2px; }
.toggle { position: relative; width: 38px; height: 20px; flex-shrink: 0; }
.toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
.toggle-slider {
  position: absolute; inset: 0;
  background: var(--border);
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;
}
.toggle-slider::before {
  content: '';
  position: absolute;
  left: 2px; top: 2px;
  width: 16px; height: 16px;
  background: #fff;
  border-radius: 50%;
  transition: 0.3s;
}
.toggle input:checked + .toggle-slider { background: var(--accent); }
.toggle input:checked + .toggle-slider::before { transform: translateX(18px); }
html.dark .toggle-slider::before { background: var(--card2); }
html.dark .toggle input:checked + .toggle-slider::before { background: #000; }

/* ═══════════════════════════════════════════════
   EMPTY
   ═══════════════════════════════════════════════ */
.empty { text-align: center; padding: 36px 16px; color: var(--muted); }
.empty svg { width: 44px; height: 44px; fill: var(--border); margin-bottom: 10px; }
.empty p { font-size: 13px; }

/* ═══════════════════════════════════════════════
   MEMBER LIST
   ═══════════════════════════════════════════════ */
.member-list { display: flex; flex-direction: column; gap: 10px; }
.member-row {
  display: flex; align-items: center; gap: 12px;
  padding: 10px;
  border-radius: 8px;
  background: var(--card2);
  transition: var(--trans);
  cursor: pointer;
}
.member-row:hover { background: var(--border); }
.m-av {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600;
  flex-shrink: 0;
}
.m-av.a { background: linear-gradient(135deg, rgba(52,152,219,0.2), rgba(45,106,79,0.2)); color: var(--accent); }
.m-av.b { background: linear-gradient(135deg, rgba(231,76,60,0.2), rgba(243,156,18,0.2)); color: var(--orange); }
.m-av.c { background: linear-gradient(135deg, rgba(64,145,108,0.2), rgba(52,152,219,0.2)); color: var(--green); }
.m-av.d { background: linear-gradient(135deg, rgba(45,106,79,0.2), rgba(231,76,60,0.2)); color: var(--accent2); }
.m-name { font-size: 13px; font-weight: 500; flex: 1; color: var(--text); }
.m-prog { font-size: 11px; color: var(--muted); }
.prog-bar-wrap {
  width: 64px; height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}
.prog-bar { height: 4px; border-radius: 2px; background: var(--accent); }

/* ═══════════════════════════════════════════════
   ALERTS
   ═══════════════════════════════════════════════ */
.alert-list { display: flex; flex-direction: column; gap: 8px; }
.alert-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background: var(--card2);
  border-left: 3px solid;
}
.alert-item.warn { border-left-color: var(--orange); }
.alert-item.info { border-left-color: var(--blue); }
.alert-item.success { border-left-color: var(--green); }
.alert-text { font-size: 12px; line-height: 1.5; color: var(--text); }
.alert-time { font-size: 10px; color: var(--muted); margin-top: 2px; }

/* ═══════════════════════════════════════════════
   GOALS
   ═══════════════════════════════════════════════ */
.goal-list { display: flex; flex-direction: column; gap: 12px; }
.goal-item { display: flex; align-items: center; gap: 12px; }
.goal-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}
.goal-info { flex: 1; }
.goal-name { font-size: 12px; font-weight: 500; margin-bottom: 4px; color: var(--text); }
.goal-track { height: 5px; background: var(--border); border-radius: 3px; overflow: hidden; }
.goal-fill { height: 5px; border-radius: 3px; transition: width 0.6s; }
.goal-pct { font-size: 11px; font-weight: 600; min-width: 34px; text-align: right; }

/* ═══════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════ */
@media (max-width: 1200px) {
  .stats-grid, .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .two-col { grid-template-columns: 1fr; }
  .three-col { grid-template-columns: 1fr 1fr; }
  .qa-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 900px) {
  .app-layout { grid-template-columns: 1fr; }
  .sidebar { display: none; }
  .main { margin-left: 0; width: 100%; }
  .stats-grid, .kpi-grid { grid-template-columns: 1fr 1fr; }
  .three-col { grid-template-columns: 1fr; }
  .qa-grid { grid-template-columns: repeat(2, 1fr); }
  .ph { flex-direction: column; align-items: flex-start; gap: 12px; }
  .ph-actions { width: 100%; justify-content: flex-end; }
}
@media (max-width: 600px) {
  .stats-grid, .kpi-grid, .qa-grid { grid-template-columns: 1fr; }
  .fr, .fr3 { grid-template-columns: 1fr; }
  .topbar { padding: 14px 16px; flex-wrap: wrap; gap: 10px; }
  .search-box, .tb-search { width: 100%; }
  .search-box input, .tb-search input { width: 100%; }
  .content { padding: 16px; }
  .modal { width: 96vw; padding: 20px; }
}

/* ═══════════════════════════════════════════════
   UTILS
   ═══════════════════════════════════════════════ */
.status-dot {
  width: 8px; height: 8px;
  background: var(--green);
  border-radius: 50%;
  margin-left: auto;
  flex-shrink: 0;
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--muted); }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
