
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NotificationForm } from "@/components/NotificationForm";
import { MissionBadge } from "@/components/MissionBadge";
import { Bell, MapPin } from "lucide-react";

const NotifyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-light-gray dark:bg-dark-blue/30">
        <section className="container py-12 md:py-16 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="bg-electric-green/10 p-3 rounded-full">
                <Bell className="h-6 w-6 text-electric-green" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-montserrat">
              Receba atualizações de cobertura
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Seja o primeiro a saber quando expandirmos nossa cobertura para novas regiões.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <MissionBadge />
              
              <div className="bg-white dark:bg-secondary rounded-lg shadow-lg p-6">
                <h3 className="font-montserrat font-semibold text-xl mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-electric-green" />
                  Nossa cobertura atual
                </h3>
                <p className="text-muted-foreground mb-4">
                  Atualmente o ElectroSpot está disponível apenas no estado do Rio de Janeiro, nas cidades:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                  <li>Rio de Janeiro (capital)</li>
                  <li>Niterói</li>
                  <li>Petrópolis</li>
                  <li>Búzios</li>
                  <li>Paraty</li>
                  <li>Angra dos Reis</li>
                </ul>
              </div>
            </div>
            
            <div>
              <NotificationForm />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotifyPage;
