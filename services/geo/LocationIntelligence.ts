
import { Coordinates, AddressProfile } from '../../types/location.types';

export const LocationIntelligence = {
    /**
     * Solicita permissão e captura as coordenadas exatas via GPS.
     */
    getCurrentPosition: (): Promise<Coordinates> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocalização não suportada."));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }),
                (err) => reject(err),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        });
    },

    /**
     * Traduz coordenadas em um perfil de endereço usando Nominatim (OpenStreetMap).
     */
    reverseGeocode: async (coords: Coordinates): Promise<AddressProfile> => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=10&addressdetails=1`, {
                headers: { 'Accept-Language': 'pt-BR' }
            });
            const data = await res.json();
            
            const addr = data.address;
            return {
                city: addr.city || addr.town || addr.village || addr.municipality,
                state: addr.state,
                stateCode: addr['ISO3166-2-lvl4']?.split('-')[1],
                country: addr.country,
                countryCode: addr.country_code?.toUpperCase(),
                displayName: data.display_name
            };
        } catch (e) {
            console.error("Geocoding failed", e);
            throw new Error("Falha ao identificar endereço.");
        }
    }
};
