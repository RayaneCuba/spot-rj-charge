
import { MapPin, Menu, X, ElectricCar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";

export function Header() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <ElectricCar className="h-6 w-6" />
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
                <div className="flex items-center justify-between border-t pt-4 mt-2">
                  <span className="text-sm text-muted-foreground">Tema</span>
                  <ThemeToggle />
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
