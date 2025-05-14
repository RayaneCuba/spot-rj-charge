
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FAQSection } from "@/components/FAQSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Bell } from "lucide-react";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-light-gray dark:bg-dark-blue/30">
        <section className="container py-12 md:py-16">
          <FAQSection />
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-montserrat font-medium mb-4">Ainda está com dúvidas?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to="/">
                  <MapPin className="mr-2 h-5 w-5" />
                  Ver mapa de cobertura
                </Link>
              </Button>
              <Button asChild className="bg-electric-green hover:bg-electric-green/90 text-white">
                <Link to="/notify">
                  <Bell className="mr-2 h-5 w-5" />
                  Receber atualizações
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
