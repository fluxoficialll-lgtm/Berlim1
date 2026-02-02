
import { fluxClient, FluxRequestOptions } from '../fluxClient';

/**
 * InternalConnector (Legacy Bridge Wrapper)
 * Agora delega toda a complexidade para o fluxClient, mantendo compatibilidade.
 */
class InternalConnector {
  public async call<T>(path: string, options: FluxRequestOptions = {}): Promise<T> {
    return fluxClient.call<T>(path, {
        ...options,
        isAdminAction: true // Força o uso do Token de Admin
    });
  }
}

export const internalConnector = new InternalConnector();
