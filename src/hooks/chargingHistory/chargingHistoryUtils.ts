
import { ChargingSession } from './types';

// Gerar sessões aleatórias para o mock inicial
export const generateMockSessions = (count: number): ChargingSession[] => {
  const mockStations = [
    { id: 1, name: "Eletroposto Shopping Rio Sul" },
    { id: 2, name: "Eletroposto Barra Shopping" },
    { id: 3, name: "Eletroposto Estacionamento Gávea" },
    { id: 4, name: "Eletroposto Botafogo Praia Shopping" }
  ];
  
  const mockSessions: ChargingSession[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomStation = mockStations[Math.floor(Math.random() * mockStations.length)];
    const date = new Date();
    date.setDate(date.getDate() - i - Math.floor(Math.random() * 5)); // Data de 1-10 dias atrás
    
    const duration = Math.floor(Math.random() * 40) + 15; // 15-55 minutos
    const energy = parseFloat((Math.random() * 30 + 5).toFixed(1)); // 5-35 kWh
    const cost = parseFloat((energy * 1.95).toFixed(2)); // R$ 1,95 por kWh
    
    mockSessions.push({
      id: Date.now() - i * 100000,
      stationId: randomStation.id,
      stationName: randomStation.name,
      date: date.toISOString(),
      duration,
      energy,
      cost,
      status: Math.random() > 0.8 ? "interrompido" : "completo"
    });
  }
  
  return mockSessions;
};
