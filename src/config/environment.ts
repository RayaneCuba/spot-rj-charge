
/**
 * Configuração de ambiente da aplicação
 * 
 * Este arquivo contém flags e configurações específicas para diferentes 
 * ambientes (desenvolvimento, staging, produção)
 */

type Environment = {
  // Nome do ambiente atual
  name: 'development' | 'staging' | 'production';
  
  // Flags de funcionalidades
  features: {
    // Se o modo visitante está disponível
    visitorMode: boolean;
    // Se as estações mockadas devem ser exibidas
    showMockStations: boolean;
    // Se o feedback deve ser coletado
    collectFeedback: boolean;
    // Se o contador de acessos está ativo
    trackVisits: boolean;
  };
  
  // Configurações de API
  api: {
    // Base URL para a API
    baseUrl: string;
    // Timeout para requisições em ms
    timeoutMs: number;
  };
  
  // Configurações de Analytics
  analytics: {
    // Se os analytics estão ativos
    enabled: boolean;
    // Nível de detalhamento do log
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
};

// Ambiente atual, determinado com base em variáveis de ambiente
// No Vite, podemos usar import.meta.env.MODE
const currentMode = import.meta.env.MODE || 'development';

// Configurações específicas para cada ambiente
const environments: Record<string, Environment> = {
  development: {
    name: 'development',
    features: {
      visitorMode: true,
      showMockStations: true,
      collectFeedback: true,
      trackVisits: true,
    },
    api: {
      baseUrl: 'http://localhost:3000/api',
      timeoutMs: 10000,
    },
    analytics: {
      enabled: false,
      logLevel: 'debug',
    },
  },
  staging: {
    name: 'staging',
    features: {
      visitorMode: true,
      showMockStations: true,
      collectFeedback: true,
      trackVisits: true,
    },
    api: {
      baseUrl: 'https://staging-api.electrospot.app/api',
      timeoutMs: 5000,
    },
    analytics: {
      enabled: true,
      logLevel: 'info',
    },
  },
  production: {
    name: 'production',
    features: {
      visitorMode: true,
      showMockStations: false,
      collectFeedback: true,
      trackVisits: true,
    },
    api: {
      baseUrl: 'https://api.electrospot.app/api',
      timeoutMs: 3000,
    },
    analytics: {
      enabled: true,
      logLevel: 'error',
    },
  },
};

// Exportar a configuração para o ambiente atual
const env = environments[currentMode] || environments.development;

// Contador simples de visitas
let visitCount = 0;

/**
 * Rastreia uma visita à página
 * @param page Nome da página visitada
 */
export const trackPageVisit = (page: string): void => {
  if (env.features.trackVisits) {
    visitCount++;
    console.log(`[${env.name}] Página visitada: ${page}, Total: ${visitCount}`);
    
    // Em produção ou staging, poderíamos enviar esses dados para um serviço
    if (env.analytics.enabled) {
      // Aqui enviaria para um serviço de analytics
      // Por exemplo: sendAnalytics('pageView', { page, count: visitCount });
    }
  }
};

/**
 * Obtém o número total de visitas registradas
 */
export const getVisitCount = (): number => {
  return visitCount;
};

export default env;
