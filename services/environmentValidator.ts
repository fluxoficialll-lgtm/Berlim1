
import { envService } from './envService';

/**
 * Environment Validator
 * Impede que o app rode em modo degradado por falta de configuração de servidor.
 */

export const validateEnvironment = () => {
  const isDemo = envService.isDemoMode();

  const requiredKeys = [
    { key: 'VITE_API_URL', val: process.env.VITE_API_URL },
    { key: 'GOOGLE_CLIENT_ID', val: process.env.GOOGLE_CLIENT_ID },
    { key: 'API_KEY', val: process.env.API_KEY } // Gemini Key
  ];

  const missing = requiredKeys.filter(item => 
    !item.val || 
    item.val === "" || 
    item.val.includes("PLACEHOLDER") || 
    item.val.includes("NAO_CONFIGURADO")
  );

  if (missing.length > 0) {
    // No modo Demo (como o preview da IA ou ambiente local sem .env), 
    // não tratamos a ausência de VITE_API_URL ou GOOGLE_CLIENT_ID como erro fatal,
    // pois o sistema de Mocks (USE_MOCKS) permite o funcionamento pleno do app para testes.
    if (isDemo) {
      console.info("ℹ️ [Environment] O app está rodando em Modo de Demonstração. Utilizando dados locais (Mocks). Chaves ausentes: " + 
        missing.map(m => m.key).join(', '));
      return;
    }

    console.group("🚨 [CRITICAL CONFIGURATION ERROR]");
    console.error("As seguintes chaves de ambiente estão ausentes ou são inválidas:");
    missing.forEach(m => console.error(`- ${m.key}`));
    console.warn("Isso impedirá o funcionamento de logins, IA e pagamentos em ambiente real.");
    console.groupEnd();
    
    // No ambiente de produção, poderíamos mostrar um alerta visual ou enviar telemetria
    if (window.location.hostname !== 'localhost') {
        const warningStyle = 'background: red; color: white; padding: 10px; font-weight: bold;';
        console.log('%c O SISTEMA ESTÁ RODANDO EM MODO DEGRADADO ', warningStyle);
    }
  } else {
    console.log("🛠️ [Environment] Verificado com sucesso. Todas as conexões seguras estão prontas.");
  }
};
