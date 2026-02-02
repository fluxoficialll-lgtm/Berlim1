import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../../../../services/groupService';
import { authService } from '../../../../services/authService';
import { useModal } from '../../../../components/ModalSystem';
import { Group, CheckoutConfig } from '../../../../types';
import { PROVIDER_METHODS } from '../../components/settings/checkout/CheckoutMethodData';
import { PREVIEW_COUNTRIES } from '../../../../components/groups/GlobalSimulatorModal';

/**
 * Coleta todos os IDs de métodos possíveis de todos os provedores e regiões
 * Usado para inicializar o estado "tudo ligado" por padrão.
 */
const getAllPossibleMethodIds = () => {
    const ids = new Set<string>();
    Object.values(PROVIDER_METHODS).forEach(providerMap => {
        Object.values(providerMap).forEach(methods => {
            methods.forEach(m => ids.add(m.id));
        });
    });
    return Array.from(ids);
};

export const useCheckoutConfig = (groupId: string | undefined) => {
    const navigate = useNavigate();
    const { showAlert, showOptions } = useModal();
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);

    // Estados de Visualização (Não afetam o que está habilitado globalmente até salvar)
    const [provider, setProvider] = useState<string>('stripe');
    const [country, setCountry] = useState<string>('BR');
    
    // Estado Global de Seleções (A Matriz Real)
    const [enabledMethods, setEnabledMethods] = useState<string[]>([]);

    const user = authService.getCurrentUser();

    useEffect(() => {
        if (groupId) {
            const found = groupService.getGroupById(groupId);
            if (found) {
                setGroup(found);
                const config = found.checkoutConfig;
                
                if (config && config.enabledMethods && config.enabledMethods.length > 0) {
                    setProvider(config.providerId);
                    setCountry(config.targetCountry);
                    setEnabledMethods(config.enabledMethods);
                } else {
                    // Primeira vez: assume o provedor do grupo ou Stripe e habilita TUDO globalmente
                    const initialProvider = found.selectedProviderId || 'stripe';
                    setProvider(initialProvider);
                    setCountry('BR');
                    setEnabledMethods(getAllPossibleMethodIds());
                }
            }
            setLoading(false);
        }
    }, [groupId]);

    /**
     * Métodos disponíveis para o par Provedor/País selecionado na UI
     */
    const availableMethods = useMemo(() => {
        const provMap = PROVIDER_METHODS[provider] || PROVIDER_METHODS.stripe;
        return provMap[country] || provMap.DEFAULT || [];
    }, [provider, country]);

    /**
     * Métodos que serão exibidos no preview do celular
     */
    const previewEnabledMethods = useMemo(() => {
        return availableMethods.filter(m => enabledMethods.includes(m.id));
    }, [availableMethods, enabledMethods]);

    const handleSelectProvider = async () => {
        const connected = [];
        const configs = user?.paymentConfigs || {};
        
        if (user?.paymentConfig?.isConnected || configs.syncpay?.isConnected) {
            connected.push({ label: 'SyncPay (Pix)', value: 'syncpay', icon: 'fa-solid fa-bolt' });
        }
        if (configs.stripe?.isConnected) {
            connected.push({ label: 'Stripe (Global)', value: 'stripe', icon: 'fa-brands fa-stripe' });
        }
        if (configs.paypal?.isConnected) {
            connected.push({ label: 'PayPal', value: 'paypal', icon: 'fa-brands fa-paypal' });
        }

        if (connected.length === 0) {
            showAlert("Erro", "Conecte um provedor no painel financeiro antes.");
            return;
        }

        const choice = await showOptions("Selecionar Provedor", connected);
        if (choice) {
            setProvider(choice);
            // IMPORTANTE: Não resetamos enabledMethods aqui. 
            // O usuário apenas mudou o que está vendo, mas os métodos do outro provedor continuam salvos.
        }
    };

    const handleSelectCountry = async () => {
        const choices = PREVIEW_COUNTRIES.map(c => ({
            label: `${c.flag} ${c.name}`,
            value: c.code,
            icon: 'fa-solid fa-earth-americas'
        }));
        
        const choice = await showOptions("País de Venda", choices);
        if (choice) {
            setCountry(choice);
            // IMPORTANTE: Apenas muda a aba de visualização. As seleções globais são mantidas.
        }
    };

    const toggleMethod = useCallback((methodId: string) => {
        setEnabledMethods(prev => {
            if (prev.includes(methodId)) {
                return prev.filter(m => m !== methodId);
            } else {
                return [...prev, methodId];
            }
        });
    }, []);

    const activateAllInRegion = () => {
        const currentIds = availableMethods.map(m => m.id);
        setEnabledMethods(prev => Array.from(new Set([...prev, ...currentIds])));
    };

    const handleSave = async () => {
        if (!group) return;
        
        if (enabledMethods.length === 0) {
            showAlert("Aviso", "Habilite ao menos um método para salvar.");
            return;
        }

        const config: CheckoutConfig = {
            providerId: provider,
            targetCountry: country,
            enabledMethods
        };

        await groupService.updateGroup({ ...group, checkoutConfig: config });
        await showAlert("Sucesso", "Configurações de checkout sincronizadas.");
        navigate(-1);
    };

    return {
        group,
        loading,
        provider,
        country,
        availableMethods,
        enabledMethods,
        previewEnabledMethods,
        handleSelectProvider,
        handleSelectCountry,
        toggleMethod,
        handleSave,
        activateAllInRegion
    };
};