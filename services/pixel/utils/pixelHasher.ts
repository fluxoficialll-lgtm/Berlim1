
/**
 * Gera Hash SHA-256 para proteção de PII (Personally Identifiable Information)
 * Requisito obrigatório para Advanced Matching no Meta.
 */
export const hashPixelData = async (data: string): Promise<string> => {
  if (!data) return '';
  const normalized = data.trim().toLowerCase();
  
  // Se já for um hash hexadecimal de 64 caracteres, retorna como está
  if (/^[a-f0-9]{64}$/i.test(normalized)) return normalized;

  try {
    const msgBuffer = new TextEncoder().encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    console.error("Hash error:", e);
    return normalized; // Fallback para não quebrar, embora o Meta prefira hash
  }
};

/**
 * Anonimiza um objeto de usuário completo para envio via Pixel/CAPI
 */
export const anonymizeUserData = async (userData: any) => {
  const hashed: any = { ...userData };
  const fieldsToHash = ['email', 'phone', 'externalId', 'firstName', 'lastName'];

  for (const field of fieldsToHash) {
    if (hashed[field]) {
      hashed[field] = await hashPixelData(hashed[field]);
    }
  }
  return hashed;
};
