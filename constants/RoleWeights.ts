
export const ROLE_WEIGHTS: Record<string, number> = {
    'Dono': 100,
    'Admin': 70,
    'Moderador': 50,
    'Membro': 10
};

export type RoleName = keyof typeof ROLE_WEIGHTS;
