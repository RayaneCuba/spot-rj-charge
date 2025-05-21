
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

// Hook para usar a autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  
  return context;
}
