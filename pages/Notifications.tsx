
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';
import { relationshipService } from '../services/relationshipService';
import { groupService } from '../services/groupService';
import { geoService, GeoData } from '../services/geoService';
import { currencyService, ConversionResult } from '../services/currencyService';
import { NotificationItem, Group } from '../types';
import { db } from '@/database';
import { Footer } from '../components/layout/Footer';
import { FilterBar } from '../components/notifications/FilterBar';
import { NotificationCard } from '../components/notifications/NotificationCard';
import { MainHeader } from '../components/layout/MainHeader';
import { ExpiringVipNotificationCard } from '../features/notifications/components/ExpiringVipNotificationCard';

// Lazy loading do modal de pagamento para manter performance
const PaymentFlowModal = lazy(() => import('../components/payments/PaymentFlowModal').then(m => ({ default: m.PaymentFlowModal })));

interface EnrichedNotificationItem extends NotificationItem {
    displayName?: string;
}

export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<EnrichedNotificationItem[]>([]);
  const [filter, setFilter] = useState<string>('all');

  // Estados para o Modal de Pagamento
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [displayPriceInfo, setDisplayPriceInfo] = useState<ConversionResult | null>(null);

  useEffect(() => {
    const userEmail = authService.getCurrentUserEmail();
    if (!userEmail) { navigate('/'); return; }
    
    const loadNotifications = () => {
        const rawData = notificationService.getNotifications();
        const enrichedData = rawData.map(n => {
            const user = authService.getUserByHandle(n.username);
            if (user) {
                return {
                    ...n,
                    displayName: user.profile?.nickname || user.profile?.name || n.username,
                    username: n.username,
                    avatar: user.profile?.photoUrl || n.avatar
                };
            }
            return { ...n, displayName: n.username };
        });
        setNotifications(enrichedData);
    };

    loadNotifications();
    notificationService.markAllAsRead();
    const unsubscribe = db.subscribe('notifications', loadNotifications);
    return () => unsubscribe();
  }, [navigate]);

  const handleFollowToggle = async (id: number, username: string) => {
    const status = relationshipService.isFollowing(username);
    if (status === 'following') { await relationshipService.unfollowUser(username); }
    else { await relationshipService.followUser(username); }
    setNotifications(prev => prev.map(n => { if (n.username === username) { return { ...n, isFollowing: status !== 'following' }; } return n; }));
  };

  const handlePendingAction = async (action: 'accept' | 'reject', notification: EnrichedNotificationItem) => {
    setNotifications(prev => prev.filter(n => n.id !== notification.id));
    try {
        if (notification.subtype === 'friend') {
            if (action === 'accept') { await relationshipService.acceptFollowRequest(notification.username); }
            else { await relationshipService.rejectFollowRequest(notification.username); }
        }
        notificationService.removeNotification(notification.id);
    } catch (error) { console.error("Error handling notification action:", error); }
  };

  const handleIgnoreExpiring = (id: number) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
      notificationService.removeNotification(id);
  };

  // Função disparada ao clicar em "Pagar" na notificação VIP
  const handlePayClick = async (groupId: string) => {
      const foundGroup = groupService.getGroupById(groupId);
      if (!foundGroup) return;

      setSelectedGroup(foundGroup);
      
      // Detecta localização e converte preço para exibir o modal correto
      const detectedGeo = await geoService.detectCountry();
      setGeoData(detectedGeo);

      const baseCurrency = foundGroup.currency || 'BRL';
      const basePrice = parseFloat(foundGroup.price || '0');
      const targetCurrency = detectedGeo.currency || 'BRL';

      const conversion = await currencyService.convert(basePrice, baseCurrency, targetCurrency);
      setDisplayPriceInfo(conversion);

      setIsPaymentModalOpen(true);
  };

  const filteredNotifications = notifications.filter(n => {
      if (filter === 'all') return true;
      if (filter === 'pending') {
          return n.type === 'pending' || n.type === 'expiring_vip';
      }
      return n.type === filter;
  });

  return (
    <div className="h-[100dvh] bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
      
      <MainHeader />

      <FilterBar activeFilter={filter} onFilterChange={setFilter} />

      <main className="flex-grow flex flex-col items-center justify-start w-full mt-5 transition-all overflow-y-auto no-scrollbar">
        <div className="w-full max-w-[600px] px-4 pt-[140px] pb-[120px]">
            <h2 className="text-2xl font-700 mb-5 text-[#00c2ff] border-b-2 border-[#00c2ff]/30 pb-2">Notificações</h2>
            
            {filteredNotifications.length === 0 ? (
                <div style={{textAlign:'center', color:'#777', marginTop:'50px', display:'flex', flexDirection:'column', alignItems:'center', gap:'10px'}}>
                    <i className="fa-regular fa-bell-slash text-4xl opacity-50"></i>
                    <span>Nenhuma notificação encontrada.</span>
                </div>
            ) : (
                filteredNotifications.map(notif => {
                    if (notif.type === 'expiring_vip') {
                        return (
                            <ExpiringVipNotificationCard 
                                key={notif.id}
                                notif={notif}
                                onIgnore={handleIgnoreExpiring}
                                onPay={handlePayClick}
                            />
                        );
                    }
                    return (
                        <NotificationCard 
                            key={notif.id}
                            notif={notif}
                            onFollowToggle={handleFollowToggle}
                            onPendingAction={handlePendingAction}
                            onNavigate={navigate}
                        />
                    );
                })
            )}
        </div>
      </main>

      <Footer />

      <Suspense fallback={null}>
          {isPaymentModalOpen && selectedGroup && (
              <PaymentFlowModal 
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                group={selectedGroup}
                provider={geoData?.countryCode === 'BR' ? 'syncpay' : 'stripe'}
                convertedPriceInfo={displayPriceInfo}
                geo={geoData}
              />
          )}
      </Suspense>
    </div>
  );
};
