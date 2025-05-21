
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import FAQ from "./pages/FAQ";
import NotifyPage from "./pages/NotifyPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { trackPageVisit } from "./config/environment";

const queryClient = new QueryClient();

// Componente para rastrear visitas de página
const PageTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Rastrear a visita toda vez que a rota muda
    trackPageVisit(location.pathname);
  }, [location]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/notify" element={<NotifyPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Rotas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              {/* Adicione outras rotas protegidas aqui */}
            </Route>
            
            {/* Rota de fallback para páginas não encontradas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <PageTracker />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
