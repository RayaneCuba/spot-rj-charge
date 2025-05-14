
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Bell, ChevronDown } from "lucide-react";

export function HeroSection() {
  const scrollToMap = () => {
    const mapElement = document.getElementById('charging-map');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-dark-blue to-secondary">
      <div className="absolute inset-0 bg-[url('/hero-background.jpg')] bg-cover bg-center opacity-20"></div>
      <div className="container relative px-4 py-16 md:py-24 lg:py-32 flex flex-col items-center">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-8 w-8 text-electric-green" />
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl text-white">
              ElectroSpot
            </h1>
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-montserrat font-bold text-white">
            Estamos no Rio! Encontre eletropostos perto de você.
          </h2>
          
          <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg border border-white/20 max-w-lg mx-auto">
            <div className="flex items-center gap-2 text-white">
              <span className="text-2xl">🚗</span>
              <p className="text-sm md:text-base">
                Neste momento, estamos atendendo somente o estado do Rio de Janeiro, nas regiões com eletropostos ativos.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
            <Button 
              onClick={scrollToMap} 
              size="lg" 
              className="bg-electric-green hover:bg-electric-green/90 text-white font-medium"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Ver no Mapa
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
            >
              <Link to="/notify">
                <Bell className="mr-2 h-5 w-5" />
                Quero ser notificado
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-16 animate-bounce">
          <Button 
            variant="ghost" 
            onClick={scrollToMap} 
            className="text-white rounded-full p-2"
          >
            <ChevronDown className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  );
}
