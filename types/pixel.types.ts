
export type PixelEventName = 
  | 'PageView' 
  | 'Lead' 
  | 'InitiateCheckout' 
  | 'Purchase' 
  | 'AddToCart' 
  | 'CompleteRegistration'
  | 'Contact' 
  | 'Search' 
  | 'AddPaymentInfo'
  | 'ViewContent' 
  | 'TimeStay30s' 
  | 'TimeStay60s'
  | 'GalleryInteraction' 
  | 'GalleryZoom';

export interface PixelUserData {
  // PII (Personally Identifiable Information)
  email?: string;
  phone?: string;
  externalId?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  gender?: 'f' | 'm';
  dateOfBirth?: string;
  
  // Technical Identifiers
  fbp?: string;
  fbc?: string;
  ip?: string;
  userAgent?: string;
  fbLoginId?: string;
  subscriptionId?: string;
  leadId?: string;
  anonId?: string;
}

export interface PixelEventData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
  num_items?: number;
  search_string?: string;
  event_id?: string;
  transaction_id?: string;
  payment_method?: string; // Campo necessário para AddPaymentInfo
  // Parâmetros de Servidor
  event_source_url?: string;
  action_source?: 'website' | 'app' | 'other';
  test_event_code?: string;
  [key: string]: any;
}

export interface PixelConfig {
  metaId?: string;
  googleId?: string;
  tiktokId?: string;
  pixelToken?: string;
}

/**
 * TrafficSourceData
 * Interface for storing and retrieving attribution parameters (UTMs, click IDs).
 */
export interface TrafficSourceData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  ttclid?: string;
  gclid?: string;
  timestamp?: number;
  [key: string]: any;
}