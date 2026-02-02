
import { Group } from '../../../types';

export interface PaymentRequest {
    group: Group;
    customerEmail: string;
    successUrl: string;
    cancelUrl: string;
}

export interface IPaymentProvider {
    readonly id: string;
    verifyCredentials(credentials: any): Promise<boolean>;
    createCheckout(request: PaymentRequest): Promise<{ id: string; url?: string; approvalLink?: string }>;
    checkStatus(transactionId: string, context: any): Promise<{ status: 'paid' | 'pending' | 'failed' }>;
}
