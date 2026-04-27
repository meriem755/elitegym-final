import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

/**
 * Correspondance rôle (BDD) → route React.
 * Doit correspondre exactement aux valeurs dans la colonne `role`
 * de la table `utilisateur`.
 */
export const ROLE_ROUTES = {
  membre:         '/membre',
  coach:          '/coach',
  administrateur: '/admin',
  receptionniste: '/reception',
  gerant:         '/gerant',
};

export function AuthProvider({ children }) {
  // Initialisation depuis localStorage (session persistante)
  const [user, setUser] = useState(() => api.getUser());

  /**
   * login(telephone, motDePasse)
   * Appelle api.login, met à jour le state React, retourne le résultat complet.
   */
  const login = async (telephone, motDePasse) => {
    const result = await api.login(telephone, motDePasse); // { user, token, redirect }
    setUser(result.user);
    return result;
  };

  /** Déconnecte l'utilisateur et vide le state */
  const logout = () => {
    api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook à utiliser dans n'importe quel composant */
export const useAuth = () => useContext(AuthContext);
