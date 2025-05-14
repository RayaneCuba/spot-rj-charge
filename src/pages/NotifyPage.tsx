
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NotificationForm } from "@/components/NotificationForm";

const NotifyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="container py-8 md:py-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Receba atualizações de cobertura
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Seja o primeiro a saber quando expandirmos nossa cobertura para novas regiões.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <NotificationForm />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotifyPage;
