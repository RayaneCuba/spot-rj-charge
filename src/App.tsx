
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorProvider } from "@/context/ErrorContext";
import { lazy, useEffect, Suspense } from "react";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { initializeErrorMonitoring, trackPerformance } from "@/lib/performance-monitoring";
import { trackPageVisit } from "./config/environment";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotifyPage = lazy(() => import("./pages/NotifyPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Configure the QueryClient with default error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 60000,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Componente para rastrear visitas de página
const PageTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Rastrear a visita toda vez que a rota muda
    trackPageVisit(location.pathname);
    
    // Medir o tempo de carregamento da página
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      trackPerformance(`pageView.${location.pathname}`, duration);
    };
  }, [location]);
  
  return null;
};

// Inicializar monitoramento de erros
initializeErrorMonitoring();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageTracker />
            <Routes>
              {/* Rotas públicas */}
              <Route 
                path="/" 
                element={
                  <AsyncBoundary loadingMessage="Carregando página inicial..." loadingSize="large">
                    <Index />
                  </AsyncBoundary>
                } 
              />
              <Route 
                path="/faq" 
                element={
                  <AsyncBoundary loadingMessage="Carregando FAQ...">
                    <FAQ />
                  </AsyncBoundary>
                } 
              />
              <Route 
                path="/notify" 
                element={
                  <AsyncBoundary>
                    <NotifyPage />
                  </AsyncBoundary>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <AsyncBoundary>
                    <Login />
                  </AsyncBoundary>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <AsyncBoundary>
                    <Signup />
                  </AsyncBoundary>
                } 
              />
              
              {/* Rotas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route 
                  path="/dashboard" 
                  element={
                    <AsyncBoundary>
                      <Dashboard />
                    </AsyncBoundary>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <AsyncBoundary>
                      <Profile />
                    </AsyncBoundary>
                  } 
                />
                {/* Adicione outras rotas protegidas aqui */}
              </Route>
              
              {/* Rota de fallback para páginas não encontradas */}
              <Route 
                path="*" 
                element={
                  <AsyncBoundary>
                    <NotFound />
                  </AsyncBoundary>
                } 
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ErrorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
