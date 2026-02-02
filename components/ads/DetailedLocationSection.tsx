import React, { useState, useEffect, useRef } from 'react';
import { AdCampaign, TargetedLocation } from '../../types';

interface DetailedLocationSectionProps {
    campaign: Partial<AdCampaign>;
    onTargetingChange: (field: string, value: any) => void;
}

interface LocationResult {
    display_name: string;
    lat: string;
    lon: string;
    address: {
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        country?: string;
    };
}

export const DetailedLocationSection: React.FC<DetailedLocationSectionProps> = ({
    campaign, onTargetingChange
}) => {
    const [isLoadingIP, setIsLoadingIP] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<LocationResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Draft State for current area being built
    const [draftLocation, setDraftLocation] = useState<Partial<TargetedLocation> | null>(null);
    const [draftRadius, setDraftRadius] = useState(50);

    const selectedLocations = campaign.targeting?.locations || [];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 3 && isSearching) {
                performSearch();
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const performSearch = async () => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5&accept-language=pt-BR`);
            const data = await res.json();
            setResults(data);
            setShowResults(true);
        } catch (e) {
            console.error("Search error", e);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectResult = (loc: LocationResult) => {
        const name = loc.address.city || loc.address.town || loc.address.village || loc.display_name.split(',')[0];
        const fullName = `${name}${loc.address.state ? `, ${loc.address.state}` : ''}`;
        
        setDraftLocation({
            name: fullName,
            lat: parseFloat(loc.lat),
            lon: parseFloat(loc.lon)
        });
        setSearchQuery(fullName);
        setShowResults(false);
        setResults([]);
    };

    const handleAddArea = () => {
        if (!draftLocation) return;

        const newArea: TargetedLocation = {
            id: `loc_${Date.now()}`,
            name: draftLocation.name!,
            radius: draftRadius,
            lat: draftLocation.lat,
            lon: draftLocation.lon
        };

        const updatedList = [...selectedLocations, newArea];
        onTargetingChange('locations', updatedList);

        // Reset build state
        setDraftLocation(null);
        setSearchQuery('');
        setDraftRadius(50);
    };

    const handleRemoveArea = (id: string) => {
        const updatedList = selectedLocations.filter(loc => loc.id !== id);
        onTargetingChange('locations', updatedList);
    };

    const detectLocation = async () => {
        setIsLoadingIP(true);
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            if (data && data.city) {
                const locName = `${data.city}, ${data.region}`;
                setDraftLocation({
                    name: locName,
                    lat: data.latitude,
                    lon: data.longitude
                });
                setSearchQuery(locName);
            }
        } catch (e) {
            alert("Falha ao detectar localização.");
        } finally {
            setIsLoadingIP(false);
        }
    };

    return (
        <div className="form-card">
            <style>{`
                .radius-slider-ad {
                    -webkit-appearance: none;
                    width: 100%; height: 4px; background: #252a33; border-radius: 5px; outline: none; margin: 15px 0;
                }
                .radius-slider-ad::-webkit-slider-thumb {
                    -webkit-appearance: none; width: 20px; height: 20px; background: #00c2ff; border-radius: 50%; cursor: pointer; box-shadow: 0 0 10px rgba(0, 194, 255, 0.3);
                }
                .location-search-wrapper { position: relative; }
                .location-results-dropdown {
                    position: absolute; top: calc(100% + 5px); left: 0; width: 100%; background: #1a1e26; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; z-index: 100; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .location-result-item {
                    width: 100%; padding: 12px 15px; text-align: left; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05); transition: 0.2s; display: flex; align-items: center; gap: 10px; color: #fff; background: none;
                }
                .location-result-item:hover { background: rgba(0,194,255,0.1); }
                .area-chip {
                    display: flex; align-items: center; justify-content: space-between; background: rgba(0,194,255,0.1); border: 1px solid rgba(0,194,255,0.2); border-radius: 12px; padding: 12px 16px; margin-bottom: 8px; animate: slideIn 0.3s ease;
                }
                .add-area-btn {
                    width: 100%; padding: 14px; background: #00c2ff; color: #000; border-radius: 12px; font-weight: 800; font-size: 12px; text-transform: uppercase; cursor: pointer; transition: 0.3s; margin-top: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;
                }
                .add-area-btn:disabled { background: #333; color: #777; cursor: not-allowed; }
                .draft-box {
                    padding: 15px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(0,194,255,0.3); border-radius: 12px; margin-top: 15px;
                }
            `}</style>
            
            <div className="card-header">
                <i className="fa-solid fa-location-crosshairs"></i> Geolocalização Detalhada
            </div>
            
            <div className="card-body">
                {/* ÁREAS SELECIONADAS */}
                {selectedLocations.length > 0 && (
                    <div className="mb-6">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-3">Áreas de Cobertura ({selectedLocations.length})</label>
                        <div className="space-y-2">
                            {selectedLocations.map(loc => (
                                <div key={loc.id} className="area-chip">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">{loc.name}</span>
                                        <span className="text-[10px] text-[#00c2ff] font-black uppercase">Raio: {loc.radius}KM</span>
                                    </div>
                                    <button onClick={() => handleRemoveArea(loc.id)} className="text-red-400 p-2 hover:bg-red-500/10 rounded-lg">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CONSTRUTOR DE ÁREA */}
                <div className="input-group" ref={searchRef}>
                    <label>Pesquisar Novo Local</label>
                    <div className="location-search-wrapper flex gap-2">
                        <div className="relative flex-1">
                            <i className={`fa-solid ${isSearching ? 'fa-circle-notch fa-spin' : 'fa-magnifying-glass'} absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs`}></i>
                            <input 
                                type="text" 
                                className="meta-field !pl-10 w-full" 
                                placeholder="Cidade, Estado ou Local..." 
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setIsSearching(true); }}
                                onFocus={() => results.length > 0 && setShowResults(true)}
                            />
                        </div>
                        <button 
                            type="button"
                            onClick={detectLocation}
                            className="bg-[#1a1e26] border border-white/10 text-[#00c2ff] w-12 rounded-xl flex items-center justify-center active:scale-95 transition-all"
                        >
                            {isLoadingIP ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-location-arrow"></i>}
                        </button>

                        {showResults && results.length > 0 && (
                            <div className="location-results-dropdown animate-pop-in">
                                {results.map((loc, idx) => (
                                    <button 
                                        key={idx}
                                        type="button"
                                        className="location-result-item"
                                        onClick={() => handleSelectResult(loc)}
                                    >
                                        <i className="fa-solid fa-location-dot"></i>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-white font-bold truncate">
                                                {loc.address.city || loc.address.town || loc.address.village || loc.display_name.split(',')[0]}
                                            </span>
                                            <span className="text-[10px] text-gray-500 truncate">{loc.display_name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {draftLocation && (
                    <div className="draft-box animate-fade-in">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] font-black text-[#00c2ff] uppercase tracking-widest">Definir Raio para esta área</label>
                            <span className="text-[10px] font-black text-white bg-[#00c2ff] px-2 py-0.5 rounded">{draftRadius} KM</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" max="500" 
                            value={draftRadius}
                            onChange={(e) => setDraftRadius(parseInt(e.target.value))}
                            className="radius-slider-ad"
                        />
                        <button 
                            className="add-area-btn"
                            onClick={handleAddArea}
                        >
                            <i className="fa-solid fa-plus"></i> Adicionar à Campanha
                        </button>
                    </div>
                )}
                
                <p className="text-[9px] text-gray-600 mt-4 text-center italic">
                    Anúncios multilocais aumentam a relevância regional e reduzem o custo por clique.
                </p>
            </div>
        </div>
    );
};