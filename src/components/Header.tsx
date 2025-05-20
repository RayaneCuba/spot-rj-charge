
import { MapPin, Menu, X, Car, User, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, signInAsVisitor, isVisitor } = useAuth();
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const handleLogin = () => {
    navigate("/login");
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sessão encerrada com sucesso");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };
  
  const handleDashboardClick = () => {
    navigate("/dashboard");
    if (menuOpen) setMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    if (menuOpen) setMenuOpen(false);
  };

  const handleVisitorMode = () => {
    signInAsVisitor();
    navigate("/dashboard");
    if (menuOpen) setMenuOpen(false);
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Car className="h-6 w-6" />
          <span className={isMobile ? "hidden" : "block font-montserrat"}>ElectroSpot</span>
        </Link>
        
        {isMobile ? (
          <>
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle Menu">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            {menuOpen && (
              <div className="absolute top-16 left-0 w-full bg-background border-b shadow-lg py-4 px-6 flex flex-col gap-4 animate-fade-in">
                <Link 
                  to="/faq" 
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Perguntas Frequentes
                </Link>
                <Link
                  to="/notify"
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Receber Atualizações
                </Link>
                
                {user && (
                  <>
                    <button
                      onClick={handleDashboardClick}
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-left"
                    >
                      <User className="h-4 w-4" /> Meu Dashboard
                    </button>
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-left"
                    >
                      <User className="h-4 w-4" /> Perfil
                    </button>
                  </>
                )}
                
                {!user && (
                  <button
                    onClick={handleVisitorMode}
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-left"
                  >
                    <LogIn className="h-4 w-4" /> Modo Visitante
                  </button>
                )}
                
                <div className="flex items-center justify-between border-t pt-4 mt-2">
                  <span className="text-sm text-muted-foreground">Tema</span>
                  <ThemeToggle />
                </div>
                
                <div className="pt-2">
                  {user ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleLogout}
                      className="w-full"
                    >
                      Sair da conta
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={handleLogin}
                      className="w-full"
                    >
                      <User className="mr-2 h-4 w-4" /> Entrar
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <nav className="flex items-center gap-6">
            <Link to="/faq" className="text-sm font-montserrat font-medium hover:text-primary transition-colors">
              Perguntas Frequentes
            </Link>
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="font-montserrat"
                  >
                    <User className="mr-2 h-4 w-4" /> 
                    {isVisitor ? "Visitante" : "Minha Conta"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleVisitorMode}
                  className="font-montserrat"
                >
                  <LogIn className="mr-2 h-4 w-4" /> Modo Visitante
                </Button>
                
                <Button 
                  onClick={handleLogin}
                  className="bg-electric-green hover:bg-electric-green/90 text-white font-montserrat"
                >
                  <User className="mr-2 h-4 w-4" /> Entrar
                </Button>
              </div>
            )}
            
            <Button asChild size="default" className="bg-electric-green hover:bg-electric-green/90 text-white font-montserrat">
              <Link to="/notify">
                <MapPin className="mr-2 h-4 w-4" />
                Receber Atualizações
              </Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
