import { MarketplaceItem } from '../../types';
import { API_BASE } from '../../apiConfig';

const API_URL = `${API_BASE}/api/marketplace`;

export const marketplaceService = {

  getItems: async (): Promise<MarketplaceItem[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          console.error("Failed to fetch marketplace items with status: ", response.status);
          return [];
        }
        const data = await response.json();
        return (data.data || []).sort((a: MarketplaceItem, b: MarketplaceItem) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0));
    } catch(e) {
        console.warn("Marketplace offline mode or fetch error:", e);
        return [];
    }
  },

  getItemById: async (id: string): Promise<MarketplaceItem | undefined> => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            return undefined;
        }
        const data = await response.json();
        return data.data;
    } catch (e) {
        console.error(`Error fetching item ${id}:`, e);
        return undefined;
    }
  },
  
  createItem: async (item: Partial<MarketplaceItem>) => {
    try {
        await fetch(`${API_URL}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
    } catch (e) {
      console.error("Failed to create marketplace item:", e);
    }
  },
  
  deleteItem: async (id: string) => {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error("Failed to delete marketplace item:", e);
    }
  },
};