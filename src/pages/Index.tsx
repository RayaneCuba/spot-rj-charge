
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChargingMap } from "@/components/ChargingMap";
import { NotificationForm } from "@/components/NotificationForm";
import { HeroSection } from "@/components/HeroSection";
import { CityFilter } from "@/components/CityFilter";
import { MissionBadge } from "@/components/MissionBadge";
import { useState } from "react";

const Index = () => {
  const [cityFilter, setCityFilter] = useState("");
  
  const handleFilterChange = (city: string) => {
    setCityFilter(city);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <HeroSection />
      
      <main className="flex-1 bg-light-gray dark:bg-dark-blue/30">
        <section className="container py-12 md:py-16 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CityFilter onFilterChange={handleFilterChange} />
            
            <div className="lg:col-span-2">
              <MissionBadge />
            </div>
          </div>
          
          <div id="charging-map" className="relative">
            <div className="absolute -top-24" aria-hidden="true"></div>
            <div className="shadow-lg rounded-lg overflow-hidden border border-border">
              <ChargingMap cityFilter={cityFilter} />
            </div>
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

export default Index;
