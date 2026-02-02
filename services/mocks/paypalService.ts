
import { Group } from '../../types';

export const paypalService = {
    authenticate: async (clientId: string, clientSecret: string) => {
        console.log("[MOCK] PayPal Authenticated:", clientId);
        return { success: true };
    },
    verifyCredentials: async (clientId: string, clientSecret: string) => {
        return { success: true };
    },
    createOrder: async (group: Group, ownerEmail: string) => {
        console.log("[MOCK] Creating PayPal Order for:", group.name);
        return {
            id: "PAY-MOCK-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
            approvalLink: window.location.href + "?token=mock",
            status: 'CREATED'
        };
    },
    checkOrderStatus: async (orderId: string, ownerEmail: string) => {
        return { status: 'paid' };
    }
};
