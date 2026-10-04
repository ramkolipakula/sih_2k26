import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'ADMIN' | 'MANAGEMENT' | 'GEOLOGIST' | 'MINING_ENGINEER' | 'REPORTING_OFFICER' | 'REVIEWER';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem('mock_role') as Role) || 'GEOLOGIST';
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
