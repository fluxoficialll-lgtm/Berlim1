
import { fluxClient } from './fluxClient';

/**
 * ConnectionBridge
 * Gerencia o estado vital da conexão entre o Painel e o Backend.
 */

export type ConnectionState = 'handshaking' | 'synchronized' | 'offline' | 'needs_key';

class ConnectionBridge {
  private state: ConnectionState = 'offline';
  private listeners: Set<(state: ConnectionState) => void> = new Set();

  constructor() {
    this.init();
  }

  /**
   * Realiza o aperto de mão (Handshake) com o servidor usando o cliente unificado.
   */
  public async init() {
    this.updateState('handshaking');
    
    try {
      // O ping valida se o backend está vivo
      await fluxClient.call('/ping');
      this.updateState('synchronized');
      console.log("🟢 [Bridge] Handshake bem sucedido. Túnel de dados unificado ativo.");
    } catch (error: any) {
      if (error.message === 'API_KEY_REQUIRED') {
        this.updateState('needs_key');
      } else {
        this.updateState('offline');
        console.warn("🟡 [Bridge] Servidor inacessível. Tentando reconectar em 10s...");
        setTimeout(() => this.init(), 10000);
      }
    }
  }

  public subscribe(cb: (state: ConnectionState) => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private updateState(newState: ConnectionState) {
    this.state = newState;
    this.listeners.forEach(cb => cb(newState));
  }

  public getState() {
    return this.state;
  }
}

export const connectionBridge = new ConnectionBridge();
