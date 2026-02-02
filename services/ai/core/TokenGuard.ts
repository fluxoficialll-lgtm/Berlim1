
/**
 * TokenGuard: O "segurança" financeiro da plataforma.
 * Monitora a frequência de requisições por usuário para evitar custos inesperados.
 */
class TokenGuardService {
  private requestHistory: Record<string, number[]> = {};

  /**
   * Verifica se um usuário pode realizar uma nova chamada de IA.
   */
  public canProcess(userId: string): boolean {
    const now = Date.now();
    const windowMs = 60 * 1000; // Janela de 1 minuto
    
    if (!this.requestHistory[userId]) {
        this.requestHistory[userId] = [];
    }
    
    // Limpeza de histórico antigo
    this.requestHistory[userId] = this.requestHistory[userId].filter(ts => now - ts < windowMs);
    
    // Limite: Máximo 8 requisições de IA por minuto por usuário (ajustável)
    const limit = 8;
    return this.requestHistory[userId].length < limit;
  }

  /**
   * Registra o timestamp de uma chamada bem sucedida.
   */
  public record(userId: string) {
    if (!this.requestHistory[userId]) this.requestHistory[userId] = [];
    this.requestHistory[userId].push(Date.now());
  }
}

export const tokenGuard = new TokenGuardService();
