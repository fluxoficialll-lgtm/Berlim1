import { sqlite } from './engine';
import { USE_MOCKS, MOCK_USERS, MOCK_POSTS, MOCK_PRODUCTS, MOCK_GROUPS, MOCK_CAMPAIGNS, MOCK_NOTIFICATIONS, MOCK_CHATS } from '../mocks';

// Managers
import { UserManager } from './managers/UserManager';
import { PostManager } from './managers/PostManager';
import { GroupManager } from './managers/GroupManager';
import { ChatManager } from './managers/ChatManager';
import { NotificationManager } from './managers/NotificationManager';
import { RelationshipManager } from './managers/RelationshipManager';
import { FinancialManager } from './managers/FinancialManager';

const STORAGE_KEY_SESSION_ID = 'app_current_user_id';

class DatabaseFacade {
    public users = new UserManager();
    public posts = new PostManager();
    public groups = new GroupManager();
    public chats = new ChatManager();
    public notifications = new NotificationManager();
    public relationships = new RelationshipManager();
    
    private fin = new FinancialManager();
    public vipAccess = this.fin.vip;
    public marketplace = this.fin.marketplace;
    public ads = this.fin.ads;

    constructor() {
        // Only seed if we are in Demo Mode AND the database is essentially empty
        // This prevents overwriting user data on refresh if they are using a real account in a mixed environment.
        if (USE_MOCKS && this.isDatabaseEmpty()) {
            this.seed();
        }
    }

    private isDatabaseEmpty(): boolean {
        // Checks if core tables have any data
        const userCount = Object.keys(this.users.getAll()).length;
        const postCount = this.posts.getAll().length;
        return userCount === 0 && postCount === 0;
    }

    private seed() {
        console.log("🌱 [Database] Injecting seed data into local cache...");
        
        // Injeção de Usuários
        Object.values(MOCK_USERS).forEach(u => this.users.set(u));
        
        // Injeção de Conteúdo
        MOCK_POSTS.forEach(p => this.posts.add(p));
        MOCK_PRODUCTS.forEach(i => this.marketplace.add({ ...i, timestamp: i.timestamp || Date.now() }));
        MOCK_GROUPS.forEach(g => this.groups.add(g));
        MOCK_CAMPAIGNS.forEach(c => this.ads.add({ ...c, timestamp: c.timestamp || Date.now() }));
        MOCK_NOTIFICATIONS.forEach(n => this.notifications.add(n));
        MOCK_CHATS.forEach(c => this.chats.set(c));
        
        console.log("✅ [Database] Seed complete.");
    }

    public subscribe = (table: any, cb: () => void) => sqlite.subscribe(table, cb);

    public auth = {
        currentUserId: () => localStorage.getItem(STORAGE_KEY_SESSION_ID),
        setCurrentUserId: (id: string) => localStorage.setItem(STORAGE_KEY_SESSION_ID, id),
        clearSession: () => {
            localStorage.removeItem(STORAGE_KEY_SESSION_ID);
            // Optionally clear the entire cache on logout to prevent data leak between users
            // sqlite.clearAll(); 
        }
    };
}

export const db = new DatabaseFacade();