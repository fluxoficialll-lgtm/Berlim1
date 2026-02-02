
/**
 * Flow State Machines
 * Impede "Bugs de Estado Impossível" através de transições finitas.
 */

// --- CHECKOUT MACHINE ---
export type CheckoutState = 
  | 'IDLE' 
  | 'CAPTURING_EMAIL' 
  | 'GENERATING_PAYMENT' 
  | 'WAITING_PAYMENT' 
  | 'SUCCESS' 
  | 'ERROR';

export type CheckoutAction = 
  | 'START' 
  | 'SUBMIT_EMAIL' 
  | 'PAYMENT_READY' 
  | 'CONFIRM_PAY' 
  | 'CANCEL' 
  | 'FAIL';

const checkoutTransitions: Record<CheckoutState, Partial<Record<CheckoutAction, CheckoutState>>> = {
  IDLE: { START: 'CAPTURING_EMAIL' },
  CAPTURING_EMAIL: { SUBMIT_EMAIL: 'GENERATING_PAYMENT', CANCEL: 'IDLE' },
  GENERATING_PAYMENT: { PAYMENT_READY: 'WAITING_PAYMENT', FAIL: 'ERROR' },
  WAITING_PAYMENT: { CONFIRM_PAY: 'SUCCESS', CANCEL: 'IDLE', FAIL: 'ERROR' },
  SUCCESS: { START: 'IDLE' },
  ERROR: { START: 'CAPTURING_EMAIL', CANCEL: 'IDLE' }
};

/**
 * Calcula o próximo estado válido de checkout
 */
export const transitionCheckout = (current: CheckoutState, action: CheckoutAction): CheckoutState => {
  const nextState = checkoutTransitions[current][action];
  if (!nextState) {
    console.warn(`🚫 Transição inválida: ${current} --(${action})--> ???`);
    return current;
  }
  return nextState;
};

// --- CONTENT CREATION MACHINE ---
export type CreationState = 'IDLE' | 'UPLOADING' | 'MODERATING' | 'PUBLISHING' | 'FINISHED';
export type CreationAction = 'UPLOAD' | 'PROCESS' | 'SEND' | 'DONE' | 'RESET';

const creationTransitions: Record<CreationState, Partial<Record<CreationAction, CreationState>>> = {
  IDLE: { UPLOAD: 'UPLOADING' },
  UPLOADING: { PROCESS: 'MODERATING', RESET: 'IDLE' },
  MODERATING: { SEND: 'PUBLISHING', RESET: 'IDLE' },
  PUBLISHING: { DONE: 'FINISHED', RESET: 'IDLE' },
  FINISHED: { RESET: 'IDLE' }
};

export const transitionCreation = (current: CreationState, action: CreationAction): CreationState => {
  return creationTransitions[current][action] || current;
};
