
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AdCampaign, TargetedLocation } from '../../types';
import { aiInterestEngine } from '../../services/ads/targeting/aiInterestEngine';
import { reachEstimator } from '../../services/ads/reachEstimator';
import { geoSearchService, GeoSearchResult } from '../../services/ads/targeting/geoSearchService';

interface TargetingSectionProps {
    campaign: Partial<AdCampaign>;
    interestInput: string;
    setInterestInput: (val: string) => void;
    onTargetingChange: (field: string, value: any) => void;
    addInterest: () => void;
    removeInterest: (interest: string) => void;
}

export const TargetingSection: React.FC<TargetingSectionProps> = ({
    campaign, interestInput, setInterestInput, onTargetingChange, addInterest, removeInterest
}) => {
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [locQuery, setLocQuery] = useState('');
    const [locResults, setLocResults] = useState<GeoSearchResult[]>([]);
    const [isSearchingLoc, setIsSearchingLoc] = useState(false);
    const [showLocDropdown, setShowLocDropdown] = useState(false);
    const locRef = useRef<HTMLDivElement>(null);
    
    const estimation = useMemo(() => reachEstimator.estimate(campaign), [campaign]);

    // Lógica de busca de locais com Debounce
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (locQuery.length >= 3) {
                setIsSearchingLoc(true);
                const results = await geoSearchService.search(locQuery);
                setLocResults(results);
                setShowLocDropdown(true);
                setIsSearchingLoc(false);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [locQuery]);

    const handleAddLocation = (res: GeoSearchResult) => {
        const current = campaign.targeting?.locations || [];
        const newLoc: TargetedLocation = {
            id: `loc_${Date.now()}`,
            name: `${res.name}, ${res.state || res.country}`,
            radius: 40, // Default 40km
            lat: res.lat,
            lon: res.lon
        };
        onTargetingChange('locations', [...current, newLoc]);
        setLocQuery('');
        setShowLocDropdown(false);
    };

    const handleSmartSuggest = async () => {
        setIsSuggesting(true);
        const suggestions = await aiInterestEngine.getSmartSuggestions({
            title: campaign.name || "",
            text: campaign.creative?.text || ""
        });
        
        if (suggestions.length > 0) {
            const current = campaign.targeting?.interests || [];
            onTargetingChange('interests', Array.from(new Set([...current, ...suggestions])));
        }
        setIsSuggesting(false);
    };

    return (
        <div className="form-card">
            <style>{`
                .meter-container { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.03); }
                .meter-bar { height: 4px; width: 100%; background: rgba(255,255,255,0.05); border-radius: 2px; position: relative; margin: 10px 0; }
                .meter-pointer { position: absolute; top: -4px; width: 2px; height: 12px; background: #fff; transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 0 10px #fff; }
                .magic-btn { background: rgba(0, 194, 255, 0.1); color: #00c2ff; border: 1px solid rgba(0, 194, 255, 0.3); padding: 0 15px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; }
                .magic-btn:hover { background: #00c2ff; color: #000; }
                .loc-dropdown { position: absolute; top: 100%; left: 0; width: 100%; background: #1a1e26; border: 1px solid #333; border-radius: 12px; z-index: 50; overflow: hidden; margin-top: 5px; }
                .loc-item { padding: 12px 15px; cursor: pointer; border-bottom: 1px solid #222; font-size: 13px; color: #ccc; }
                .loc-item:hover { background: #222; color: #fff; }
            `}</style>
            
            <div className="card-header"><i className="fa-solid fa-users-viewfinder"></i> Público e Segmentação</div>
            <div className="card-body">
                
                {/* LOCALIZAÇÃO REAL */}
                <div className="input-group mb-6 relative" ref={locRef}>
                    <label>Cidades ou Estados</label>
                    <div className="flex gap-2 mb-2">
                        <div className="relative flex-1">
                            <input 
                                type="text" 
                                className="meta-field w-full" 
                                placeholder="Ex: São Paulo, Rio de Janeiro..." 
                                value={locQuery}
                                onChange={(e) => setLocQuery(e.target.value)}
                            />
                            {isSearchingLoc && <i className="fa-solid fa-circle-notch fa-spin absolute right-4 top-4 text-[#00c2ff]"></i>}
                        </div>
                    </div>
                    {showLocDropdown && locResults.length > 0 && (
                        <div className="loc-dropdown shadow-2xl">
                            {locResults.map((r, i) => (
                                <div key={i} className="loc-item" onClick={() => handleAddLocation(r)}>
                                    <i className="fa-solid fa-location-dot mr-2 opacity-40"></i>
                                    {r.name}, {r.state}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {campaign.targeting?.locations?.map(loc => (
                            <div key={loc.id} className="interest-tag !bg-blue-500/10 !border-blue-500/20 !text-blue-400">
                                {loc.name}
                                <i className="fa-solid fa-xmark" onClick={() => {
                                    const next = campaign.targeting?.locations?.filter(l => l.id !== loc.id);
                                    onTargetingChange('locations', next);
                                }}></i>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="input-group">
                        <label>Idade Mínima</label>
                        <input 
                            type="number" 
                            className="meta-field" 
                            value={campaign.targeting?.ageMin} 
                            onChange={e => onTargetingChange('ageMin', parseInt(e.target.value))} 
                        />
                    </div>
                    <div className="input-group">
                        <label>Idade Máxima</label>
                        <input 
                            type="number" 
                            className="meta-field" 
                            value={campaign.targeting?.ageMax} 
                            onChange={e => onTargetingChange('ageMax', parseInt(e.target.value))} 
                        />
                    </div>
                </div>

                <div className="input-group mb-6">
                    <label>Gênero</label>
                    <div className="gender-selector">
                        <button className={`gender-btn ${campaign.targeting?.gender === 'all' ? 'active' : ''}`} onClick={() => onTargetingChange('gender', 'all')}>Todos</button>
                        <button className={`gender-btn ${campaign.targeting?.gender === 'male' ? 'active' : ''}`} onClick={() => onTargetingChange('gender', 'male')}>Homens</button>
                        <button className={`gender-btn ${campaign.targeting?.gender === 'female' ? 'active' : ''}`} onClick={() => onTargetingChange('gender', 'female')}>Mulheres</button>
                    </div>
                </div>

                <div className="input-group">
                    <div className="flex justify-between items-center mb-2">
                        <label className="mb-0">Interesses Sugeridos</label>
                        <button 
                            type="button"
                            className="magic-btn text-[9px] uppercase tracking-widest py-1"
                            onClick={handleSmartSuggest}
                            disabled={isSuggesting}
                        >
                            {isSuggesting ? <i className="fa-solid fa-circle-notch fa-spin mr-1"></i> : <i className="fa-solid fa-wand-magic-sparkles mr-1"></i>}
                            Sugerir Interesses
                        </button>
                    </div>
                    <div className="flex gap-2 mb-3">
                        <input 
                            type="text" 
                            className="meta-field" 
                            placeholder="Adicionar interesse manual..." 
                            value={interestInput}
                            onChange={(e) => setInterestInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                        />
                        <button onClick={addInterest} className="bg-[#00c2ff] text-black w-12 rounded-xl font-bold">+</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {campaign.targeting?.interests.map(interest => (
                            <div key={interest} className="interest-tag">
                                {interest}
                                <i className="fa-solid fa-xmark" onClick={() => removeInterest(interest)}></i>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ESTIMADOR DE ALCANCE */}
                <div className="meter-container">
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Alcance Estimado</span>
                            <span className="text-sm font-black text-white">
                                {estimation.min.toLocaleString()} - {estimation.max.toLocaleString()} <span className="text-gray-500 font-medium">pessoas/dia</span>
                            </span>
                        </div>
                        <span className="text-[10px] font-black uppercase" style={{ color: estimation.status === 'narrow' ? '#ffaa00' : (estimation.status === 'broad' ? '#00c2ff' : '#00ff82') }}>
                            {estimation.status === 'narrow' ? 'Muito Específico' : (estimation.status === 'broad' ? 'Muito Amplo' : 'Ideal')}
                        </span>
                    </div>
                    <div className="meter-bar">
                        <div className="h-full rounded-full opacity-30" style={{ background: 'linear-gradient(90deg, #ffaa00 0%, #00ff82 50%, #00c2ff 100%)', width: '100%' }}></div>
                        <div 
                            className="meter-pointer" 
                            style={{ 
                                left: estimation.status === 'narrow' ? '15%' : (estimation.status === 'ideal' ? '50%' : '85%')
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
