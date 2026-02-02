
export interface GeoSearchResult {
    name: string;
    lat: number;
    lon: number;
    state?: string;
    country?: string;
}

export const geoSearchService = {
    /**
     * Busca cidades e estados em tempo real
     */
    async search(query: string): Promise<GeoSearchResult[]> {
        if (query.length < 3) return [];
        
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&accept-language=pt-BR`
            );
            const data = await res.json();
            
            return data.map((item: any) => ({
                name: item.address.city || item.address.town || item.address.village || item.display_name.split(',')[0],
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
                state: item.address.state,
                country: item.address.country
            }));
        } catch (error) {
            console.error("[GeoSearch] Failed:", error);
            return [];
        }
    }
};
