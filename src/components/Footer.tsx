
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span className="font-bold text-lg text-primary">ElectroSpot</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Mapa
            </Link>
            <Link to="/faq" className="hover:text-primary transition-colors">
              Perguntas Frequentes
            </Link>
            <Link to="/notify" className="hover:text-primary transition-colors">
              Receber Atualizações
            </Link>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © 2024 ElectroSpot. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
