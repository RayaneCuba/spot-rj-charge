
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const isMobile = useIsMobile();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <MapPin className="h-5 w-5" />
          <span className={isMobile ? "hidden" : "block"}>ElectroSpot</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link to="/faq" className="text-sm font-medium hover:text-primary transition-colors">
            FAQ
          </Link>
          <ThemeToggle />
          <Button asChild size={isMobile ? "sm" : "default"} className="bg-primary text-primary-foreground">
            <Link to="/notify">
              Receber Atualizações
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
