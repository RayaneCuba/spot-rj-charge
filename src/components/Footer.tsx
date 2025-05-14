
import { Link } from "react-router-dom";
import { ElectricCar, Instagram, Mail, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Você receberá atualizações sobre novas regiões de cobertura.",
      });
      setEmail("");
    }
  };
  
  return (
    <footer className="border-t bg-secondary text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ElectricCar className="h-6 w-6 text-electric-green" />
              <span className="font-montserrat font-bold text-xl text-white">ElectroSpot</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Encontre eletropostos no Rio de Janeiro e fique atualizado sobre a expansão da nossa rede.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Instagram" className="hover:text-electric-green transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:contato@electrospot.com" aria-label="Email" className="hover:text-electric-green transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="tel:+552199999999" aria-label="Telefone" className="hover:text-electric-green transition-colors">
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-montserrat font-semibold text-lg mb-4">Links rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-electric-green transition-colors text-sm">
                  Mapa de eletropostos
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-electric-green transition-colors text-sm">
                  Perguntas frequentes
                </Link>
              </li>
              <li>
                <Link to="/notify" className="text-gray-300 hover:text-electric-green transition-colors text-sm">
                  Receber atualizações
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-montserrat font-semibold text-lg mb-4">Informações</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-electric-green transition-colors text-sm flex items-center gap-1">
                  Política de Privacidade
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-electric-green transition-colors text-sm flex items-center gap-1">
                  Termos de uso
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-electric-green transition-colors text-sm flex items-center gap-1">
                  Contato
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-montserrat font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-sm text-gray-300 mb-4">
              Cadastre-se para receber novidades sobre a expansão da nossa rede.
            </p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                required
              />
              <Button type="submit" className="w-full bg-electric-green hover:bg-electric-green/90 text-white">
                Inscrever-se
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center text-gray-400">
          <p>© 2024 ElectroSpot. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
