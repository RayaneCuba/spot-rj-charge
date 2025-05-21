
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Car } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Extrair URL de redirecionamento dos parâmetros da query
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (!loading && user) {
      navigate(redirectUrl);
    }
  }, [user, loading, navigate, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    try {
      setIsLoading(true);
      await signIn(email, password);
      navigate(redirectUrl);
    } catch (error) {
      // Erro já tratado no hook
      console.error("Erro de login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Se estiver carregando ou verificando autenticação, não mostrar o formulário ainda
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-xl">Verificando sessão...</div>
        </div>
      </div>
    );
  }

  // Se já estiver logado, não mostrar nada durante o redirecionamento
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Car className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
            <CardDescription>
              Faça login com sua conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu.email@exemplo.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-electric-green hover:bg-electric-green/90"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Ainda não tem uma conta?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
