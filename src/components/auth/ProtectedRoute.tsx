
import { useEffect, useState } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { AuthFallback } from './AuthFallback';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  // Verificar autenticação
  useEffect(() => {
    // Quando o loading do auth terminar, desativar estado de checking
    if (!loading) {
      // Pequeno delay para evitar flash de conteúdo
      const timer = setTimeout(() => setIsChecking(false), 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);
  
  // Mostrar componente de fallback durante verificação
  if (loading || isChecking) {
    return <AuthFallback />;
  }
  
  // Redirecionar para login se não estiver autenticado
  if (!user) {
    // Salvar a URL atual para redirecionamento pós-login
    const currentPath = location.pathname + location.search + location.hash;
    return <Navigate to={`/login?redirect=${encodeURIComponent(currentPath)}`} replace />;
  }
  
  // Se estiver autenticado, renderizar o conteúdo da rota
  return <Outlet />;
}
