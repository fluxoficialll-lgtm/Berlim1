import { PixelUserData, PixelEventData } from '../../../../types/pixel.types';

/**
 * Traduz os dados do app para o padrão "Customer Information Parameters" do Meta.
 * Documentação: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
 */
export const mapToMetaParams = (userData: PixelUserData = {}, eventData: PixelEventData = {}) => {
  return {
    // User Data (PII) - Devem estar em SHA-256
    em: userData.email,
    ph: userData.phone,
    fn: userData.firstName,
    ln: userData.lastName,
    ct: userData.city,
    st: userData.state,
    zp: userData.zip,
    country: userData.country,
    db: userData.dateOfBirth,
    ge: userData.gender,
    external_id: userData.externalId,
    
    // Technical Data (Unhashed)
    client_ip_address: userData.ip,
    client_user_agent: userData.userAgent,
    fbp: userData.fbp,
    fbc: userData.fbc,

    // Custom Data
    value: eventData.value,
    currency: eventData.currency || 'BRL',
    content_name: eventData.content_name,
    content_ids: eventData.content_ids,
    content_type: eventData.content_type,
    num_items: eventData.num_items
  };
};
