
import { internalConnector } from './InternalConnector';

export interface PlatformConfig {
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  minWithdrawalAmount: number;
  aiModelPreference: 'flash' | 'pro';
  activeGateways: string[];
  killSwitches: {
    disableMarketplace: boolean;
    disableAds: boolean;
    disableWithdrawals: boolean;
  };
}

class ConfigControl {
  private currentConfig: PlatformConfig | null = null;

  /**
   * Carrega as configurações globais do painel no boot do app.
   * Agora utiliza o padrão de ENDPOINT ÚNICO administrativo.
   */
  public async boot(): Promise<PlatformConfig> {
    try {
      // Endpoint unificado: Categoria 'system', Ação 'config'
      const config = await internalConnector.call<Partial<PlatformConfig>>('/api/admin/execute/system/config');
      
      // Validação de tipo para garantir que a resposta é um objeto
      const safeConfig = (config && typeof config === 'object') ? config : {};

      this.currentConfig = {
        ...this.getFallbackConfig(),
        ...safeConfig
      } as PlatformConfig;

      return this.currentConfig;
    } catch (e) {
      console.warn("⚠️ [ConfigControl] Falha ao sincronizar via API. Usando fallback seguro (Manutenção OFF).");
      this.currentConfig = this.getFallbackConfig();
      return this.currentConfig;
    }
  }

  public getConfig(): PlatformConfig {
    return this.currentConfig || this.getFallbackConfig();
  }

  public isMaintenanceActive(): boolean {
    return this.currentConfig?.maintenanceMode === true;
  }

  private getFallbackConfig(): PlatformConfig {
    return {
      maintenanceMode: false, 
      minWithdrawalAmount: 5.00,
      aiModelPreference: 'flash',
      activeGateways: ['syncpay', 'stripe'],
      killSwitches: {
        disableMarketplace: false,
        disableAds: false,
        disableWithdrawals: false
      }
    };
  }
}

export const configControl = new ConfigControl();
