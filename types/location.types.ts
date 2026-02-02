
export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface AddressProfile {
    city?: string;
    state?: string;
    stateCode?: string;
    country?: string;
    countryCode?: string;
    displayName?: string;
}

export interface LocationFilter {
    type: 'global' | 'radius' | 'city' | 'state' | 'country';
    radius?: number; // em KM (usado apenas no modo radius)
    targetAddress?: AddressProfile;
    coords?: Coordinates;
}
