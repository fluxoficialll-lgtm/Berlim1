
import { z } from 'zod';

/**
 * Schema Validators (Zod)
 * Garante a integridade dos dados antes que cheguem aos componentes React.
 */

// Validador de Perfil
export const UserProfileSchema = z.object({
  name: z.string().min(3, "Nome de usuário muito curto"),
  nickname: z.string().optional(),
  bio: z.string().max(150).optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  isPrivate: z.boolean().default(false)
});

// Validador de Usuário Completo
export const UserSchema = z.object({
  id: z.string().uuid("ID de usuário inválido"),
  email: z.string().email("Formato de e-mail inválido"),
  isProfileCompleted: z.boolean(),
  profile: UserProfileSchema.optional(),
  isBanned: z.boolean().optional().default(false),
  walletBalance: z.number().optional().default(0)
});

// Validador de Post
export const PostSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  text: z.string(),
  type: z.enum(['text', 'photo', 'video', 'poll']),
  timestamp: z.number(),
  likes: z.number().default(0),
  comments: z.number().default(0),
  isAd: z.boolean().optional().default(false)
});

/**
 * Função utilitária para validar dados com segurança
 */
export const validateData = <T>(schema: z.Schema<T>, data: any): T => {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    console.error("❌ [Schema Validation Error]:", result.error.format());
    // Em ambiente de produção apenas logamos, em dev poderíamos lançar erro
    return data as T; 
  }
  
  return result.data;
};
