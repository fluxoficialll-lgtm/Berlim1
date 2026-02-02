
import React, { Suspense } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';

// Importação dos Módulos de Rotas
import { AuthRoutes } from './modules/AuthRoutes';
import { FeedRoutes } from './modules/FeedRoutes';
import { GroupRoutes } from './modules/GroupRoutes';
import { MarketplaceRoutes } from './modules/MarketplaceRoutes';
import { ProfileRoutes } from './modules/ProfileRoutes';
import { SettingsRoutes } from './modules/SettingsRoutes';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0c0f14] text-white">
    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#00c2ff]"></i>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Injeção dos domínios de rotas */}
        {AuthRoutes}
        {FeedRoutes}
        {GroupRoutes}
        {MarketplaceRoutes}
        {ProfileRoutes}
        {SettingsRoutes}

        {/* Fallback global */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
