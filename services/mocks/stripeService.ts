import { Group } from '../../types';

export const stripeService = {
    authenticate: async (secretKey: string) => {
        console.log("[MOCK] Stripe Authenticated with key:", secretKey);
        return { success: true };
    },
    verifyCredentials: async (secretKey: string) => {
        return { success: true };
    },
    // Fix: Added missing createPaymentIntent to mock service for consistency with real service and to resolve union type errors
    createPaymentIntent: async (group: Group, ownerEmail: string, paymentMethodType: string) => {
        console.log(`[MOCK] Creating Stripe ${paymentMethodType} Intent for:`, group.name);
        return {
            id: "pi_mock_" + Math.random().toString(36).substr(2, 9),
            client_secret: "pi_mock_secret_" + Math.random().toString(36).substr(2, 9),
            next_action: {
                pix_display_qr_code: {
                    data: "00020126360014BR.GOV.BCB.PIX0114MOCK-PIX-STRIPE520400005303986540510.005802BR5913FLUX-STRIPE6009SAO-PAULO62070503***6304E1D1"
                },
                oxxo_display_details: {
                    number: "1234-5678-9012-34"
                }
            }
        };
    },
    createCheckoutSession: async (group: Group, ownerEmail: string) => {
        console.log("[MOCK] Creating Stripe Checkout for:", group.name);
        return {
            id: "cs_mock_" + Math.random().toString(36).substr(2, 9),
            url: window.location.href + "?session_id=mock"
        };
    },
    checkSessionStatus: async (sessionId: string, ownerEmail: string) => {
        return { status: 'paid' };
    }
};