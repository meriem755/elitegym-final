// ─── BASE URL ─────────────────────────────────────────────────
const BASE = 'http://localhost:3000/api';

const api = {

  // ══════════════════════════════════════════════════════════════
  // AUTH
  // ══════════════════════════════════════════════════════════════

  /**
   * Connexion par numéro de téléphone + mot de passe.
   * Le backend reçoit { telephone, mot_de_passe }.
   */
  async login(telephone, mot_de_passe) {
    // Nettoyage du numéro (espaces et tirets tolérés à la saisie)
    const tel = telephone.replace(/[\s\-]/g, '');

    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ telephone: tel, mot_de_passe }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Erreur de connexion');

    // Stockage local du token et des infos utilisateur
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data; // { success, token, user, redirect }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: () => localStorage.getItem('token'),

  getUser: () => {
    const s = localStorage.getItem('user');
    return s ? JSON.parse(s) : null;
  },

  isLoggedIn: () => !!localStorage.getItem('token'),

  // ══════════════════════════════════════════════════════════════
  // REQUÊTE AUTHENTIFIÉE (réutilisable par les coéquipiers)
  // ══════════════════════════════════════════════════════════════
  async authFetch(endpoint, options = {}) {
    const token = api.getToken();
    if (!token) throw new Error('Token manquant — veuillez vous connecter');

    const res = await fetch(`${BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      credentials: 'include',
    });

    if (res.status === 401 || res.status === 403) {
      api.logout();
      window.location.href = '/login';
      throw new Error('Session expirée');
    }
    return res.json();
  },

  // ══════════════════════════════════════════════════════════════
  // DONNÉES PUBLIQUES (pas besoin d'être connecté)
  // ══════════════════════════════════════════════════════════════

  /** Planning des cours par jour (lun, mar, mer, jeu, ven, sam, dim) */
  async getCours(jourCourt) {
    const jourMap = {
      lun: 'Monday', mar: 'Tuesday', mer: 'Wednesday',
      jeu: 'Thursday', ven: 'Friday', sam: 'Saturday', dim: 'Sunday',
    };
    const jour = jourMap[jourCourt?.toLowerCase()] || jourCourt;
    const res = await fetch(`${BASE}/cours?jour=${jour}`);
    return res.json();
  },

  async getFormules() {
    const res = await fetch(`${BASE}/formules`);
    return res.json();
  },

  async getCoaches() {
    const res = await fetch(`${BASE}/coaches`);
    return res.json();
  },

  // ══════════════════════════════════════════════════════════════
  // DONNÉES PROTÉGÉES (pour les coéquipiers)
  // ══════════════════════════════════════════════════════════════

  async getMesReservations() {
    return api.authFetch('/reservations');
  },

  async reserverCours(id_cours) {
    return api.authFetch('/reservations', {
      method: 'POST',
      body: JSON.stringify({ id_cours }),
    });
  },
};

export default api;
