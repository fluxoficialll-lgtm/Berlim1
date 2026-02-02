
import { Coordinates } from '../../types/location.types';

export const DistanceEngine = {
    /**
     * Calcula a distância entre dois pontos em KM usando a fórmula de Haversine.
     */
    calculateDistance: (point1: Coordinates, point2: Coordinates): number => {
        const R = 6371; // Raio da Terra em KM
        const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
        const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
        
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
            
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    /**
     * Verifica se um ponto está dentro do raio de alcance.
     */
    isWithinRadius: (center: Coordinates, target: Coordinates, radiusKm: number): boolean => {
        return DistanceEngine.calculateDistance(center, target) <= radiusKm;
    }
};
