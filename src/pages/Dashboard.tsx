
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UserWelcome } from "@/components/dashboard/UserWelcome";
import { FavoriteStations } from "@/components/dashboard/FavoriteStations";
import { ChargingHistory } from "@/components/dashboard/ChargingHistory";
import { NearbyStations } from "@/components/dashboard/NearbyStations";
import { AccountSettings } from "@/components/dashboard/AccountSettings";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <UserWelcome />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <NearbyStations />
              <ChargingHistory />
            </div>
            
            <div className="space-y-6">
              <FavoriteStations />
              <AccountSettings />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
