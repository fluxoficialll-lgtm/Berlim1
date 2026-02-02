
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Group } from '../types';
import { db } from '../database';
import { RankingService } from '../services/real/groups/RankingService';

/**
 * useGroupRanking
 * Gerencia a lógica de busca e atualização do ranking de grupos baseado na URL.
 */
export const useGroupRanking = () => {
    const { category } = useParams<{ category: string }>();
    const activeTab = (category === 'private' || category === 'vip' || category === 'public') 
        ? category 
        : 'public';

    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshRanking = useCallback((isSilent = false) => {
        if (!isSilent) setLoading(true);
        
        // Busca a lista processada pelo serviço especializado
        const ranked = RankingService.getRankedList(activeTab);
        setGroups(ranked);
        
        setLoading(false);
    }, [activeTab]);

    useEffect(() => {
        refreshRanking();

        // INSCRIÇÃO REAL-TIME: 
        // Se qualquer grupo mudar no DB (novo membro, etc), o ranking atualiza na hora.
        const unsubscribe = db.subscribe('groups', () => {
            refreshRanking(true);
        });

        return () => unsubscribe();
    }, [refreshRanking]);

    return {
        groups,
        loading,
        activeTab
    };
};
