import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { marketplaceService } from '../services/marketplaceService';
import { adService } from '../services/adService';
import { authService } from '../services/authService';
import { screenService, BusinessDashboardData } from '../services/screenService';
import { MarketplaceItem, AdCampaign } from '../types';
import { useModal } from '../components/ModalSystem';
import { ProductStoreList } from '../components/store/ProductStoreList';
import { CampaignStoreList } from '../components/store/CampaignStoreList';

export const MyStore: React.FC = () => {
  const navigate = useNavigate();
  const { showConfirm } = useModal();
  const [activeTab, setActiveTab] = useState<'products' | 'campaigns'>('products');
  const [dashboardData, setDashboardData] = useState<BusinessDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAggregatedData = async () => {
      const user = authService.getCurrentUser();
      if (!user) {
          navigate('/');
          return;
      }
      setLoading(true);
      try {
          const data = await screenService.getMyBusinessData(user.id);
          setDashboardData(data);
      } catch (e) {
          console.error("BFF Error:", e);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      loadAggregatedData();
  }, []);

  const handleDeleteProduct = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (await showConfirm("Excluir Produto", "Tem certeza? A ação não pode ser desfeita.", "Excluir", "Cancelar")) {
          await marketplaceService.deleteItem(id);
          loadAggregatedData(); 
      }
  };

  const handleEndCampaign = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (await showConfirm("Encerrar Campanha", "Deseja parar a veiculação? Você poderá retomá-la a qualquer momento.", "Encerrar", "Manter")) {
        await adService.updateCampaignStatus(id, 'ended');
        loadAggregatedData(); 
    }
  };

  const handleResumeCampaign = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (await showConfirm("Retomar Campanha", "Deseja reativar o anúncio agora?", "Retomar", "Cancelar")) {
        await adService.updateCampaignStatus(id, 'active');
        loadAggregatedData(); 
    }
  };

  const handleDeleteCampaign = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (await showConfirm("Excluir Campanha", "Deseja remover permanentemente este registro? O orçamento restante não será reembolsado.", "Excluir", "Cancelar")) {
          await adService.deleteCampaign(id);
          loadAggregatedData(); 
      }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
      <style>{`
        header { display:flex; align-items:center; padding:16px; background: #0c0f14; position:fixed; width:100%; top:0; z-index:10; border-bottom:1px solid rgba(255,255,255,0.1); height: 65px; }
        header .back-btn { background:none; border:none; color:#fff; font-size:22px; cursor:pointer; padding-right: 15px; }
        header h1 { font-size:20px; font-weight:600; }
        main { padding-top: 80px; padding-bottom: 40px; width: 100%; max-width: 600px; margin: 0 auto; padding-left: 20px; padding-right: 20px; flex-grow: 1; overflow-y: auto; }
        
        /* Tabs Styling */
        .store-tabs { display: flex; background: rgba(255,255,255,0.05); border-radius: 12px; padding: 4px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.1); }
        .tab-btn { flex: 1; padding: 12px; border: none; background: transparent; color: #aaa; font-size: 14px; font-weight: 600; cursor: pointer; border-radius: 8px; transition: 0.3s; }
        .tab-btn.active { background: #00c2ff; color: #000; box-shadow: 0 2px 10px rgba(0,194,255,0.3); }

        /* Generic Add Button */
        .add-btn { width: 100%; padding: 18px; border-radius: 16px; font-weight: 800; cursor: pointer; border: 1px dashed rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); color: #888; margin-top: 15px; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; text-transform: uppercase; font-size: 13px; letter-spacing: 1px; }
        .add-btn.gold { border-color: rgba(255,215,0,0.3); color: #FFD700; background: rgba(255,215,0,0.02); }
        .add-btn:hover { background: rgba(255,255,255,0.05); border-color: #00c2ff; color: #fff; }

        /* Products List Styles */
        .store-item { 
            display: flex; gap: 15px; background: rgba(255,255,255,0.03); 
            border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; 
            padding: 12px; margin-bottom: 12px; cursor: pointer; transition: 0.2s;
        }
        .store-item:hover { border-color: #00c2ff33; background: rgba(255,255,255,0.06); }
        .item-thumb { width: 64px; height: 64px; border-radius: 10px; object-fit: cover; background: #000; }
        .item-info { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }
        .item-title { font-weight: 700; font-size: 15px; color: #fff; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .item-meta { font-size: 11px; color: #666; display: flex; align-items: center; gap: 10px; }
        .item-sales { color: #FFD700; font-weight: 700; }
        .item-price { font-size: 14px; font-weight: 800; color: #00ff82; margin-top: 2px; }
        .item-actions { display: flex; align-items: center; padding-left: 10px; }
        .action-icon { width: 36px; height: 36px; display: flex; items-center; justify-content: center; border-radius: 10px; background: rgba(255,255,255,0.05); color: #555; cursor: pointer; transition: 0.2s; }
        .action-icon.delete:hover { background: rgba(255,77,77,0.1); color: #ff4d4d; }

        /* Campaigns List Styles */
        .campaign-card { 
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); 
            border-radius: 20px; padding: 20px; margin-bottom: 16px; 
        }
        .camp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .camp-name { font-weight: 800; font-size: 16px; color: #fff; }
        .camp-status { font-size: 10px; font-weight: 900; text-transform: uppercase; padding: 3px 8px; border-radius: 6px; background: #00ff82; color: #000; }
        .camp-desc { font-size: 13px; color: #888; line-height: 1.4; margin-bottom: 15px; }
        .camp-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 15px 0; border-top: 1px solid rgba(255,255,255,0.05); }
        .metric { display: flex; flex-direction: column; gap: 4px; }
        .metric-label { font-size: 9px; color: #555; text-transform: uppercase; font-weight: 700; }
        .metric-val { font-size: 14px; font-weight: 800; color: #fff; }

        /* Empty State */
        .empty-state { text-align: center; padding: 60px 20px; color: #444; display: flex; flex-direction: column; align-items: center; gap: 15px; }
        .empty-state i { font-size: 48px; opacity: 0.2; }
        .empty-state p { font-size: 14px; font-weight: 500; }
      `}</style>

      <header>
        <button onClick={handleBack} className="back-btn"><i className="fa-solid fa-arrow-left"></i></button>
        <h1>Meus Negócios</h1>
      </header>

      <main className="no-scrollbar">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff] mb-2"></i>
                <p className="text-xs uppercase font-bold tracking-widest">Lendo cabo de dados...</p>
            </div>
        ) : dashboardData && (
            <div className="animate-fade-in">
                <div className="store-tabs">
                    <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>Meus Produtos ({dashboardData.stats.totalProducts})</button>
                    <button className={`tab-btn ${activeTab === 'campaigns' ? 'active' : ''}`} onClick={() => setActiveTab('campaigns')}>Minhas Campanhas ({dashboardData.stats.activeAds})</button>
                </div>

                {activeTab === 'products' ? (
                    <ProductStoreList products={dashboardData.lists.products} onDelete={handleDeleteProduct} />
                ) : (
                    <CampaignStoreList 
                        campaigns={dashboardData.lists.campaigns} 
                        onEnd={handleEndCampaign}
                        onResume={handleResumeCampaign}
                        onDelete={handleDeleteCampaign}
                    />
                )}
            </div>
        )}
      </main>
    </div>
  );
};