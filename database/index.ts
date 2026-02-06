const STORAGE_KEY_SESSION_ID = 'app_current_user_id';

const authManager = {
    currentUserId: () => localStorage.getItem(STORAGE_KEY_SESSION_ID),
    setCurrentUserId: (id: string) => localStorage.setItem(STORAGE_KEY_SESSION_ID, id),
    clearSession: () => {
        localStorage.removeItem(STORAGE_KEY_SESSION_ID);
    }
};

export const db = {
    auth: authManager
};