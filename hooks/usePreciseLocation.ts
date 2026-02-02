
import { useState, useEffect, useCallback } from 'react';
import { LocationFilter, Coordinates, AddressProfile } from '../types/location.types';
import { LocationIntelligence } from '../services/geo/LocationIntelligence';

const STORAGE_KEY = 'flux_user_geo_filter';

export const usePreciseLocation = () => {
    const [loading, setLoading] = useState(false);
    const [currentFilter, setCurrentFilter] = useState<LocationFilter>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : { type: 'global' };
    });

    const updateFilter = useCallback((filter: LocationFilter) => {
        setCurrentFilter(filter);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filter));
    }, []);

    const captureGps = async () => {
        setLoading(true);
        try {
            const coords = await LocationIntelligence.getCurrentPosition();
            const address = await LocationIntelligence.reverseGeocode(coords);
            
            const newFilter: LocationFilter = {
                type: 'radius',
                radius: 50, // default
                coords,
                targetAddress: address
            };
            
            updateFilter(newFilter);
            return newFilter;
        } catch (e) {
            console.error(e);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const clearFilter = () => {
        const filter: LocationFilter = { type: 'global' };
        updateFilter(filter);
    };

    return {
        currentFilter,
        loading,
        captureGps,
        updateFilter,
        clearFilter
    };
};
