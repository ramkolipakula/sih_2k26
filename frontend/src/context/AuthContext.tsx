import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'USER' | 'ADMIN';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Read from localStorage to persist mock role
  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem('mock_role') as Role) || 'USER';
  });

  const setRole = (newRole: Role) => {
    localStorage.setItem('mock_role', newRole);
    setRoleState(newRole);
  };

  return (
    <AuthContext.Provider value={{ role, setRole, isAdmin: role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
