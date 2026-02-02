
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';

const Groups = lazy(() => import('../../pages/Groups').then(m => ({ default: m.Groups })));
const GroupChat = lazy(() => import('../../pages/GroupChat').then(m => ({ default: m.GroupChat })));
const GroupLanding = lazy(() => import('../../pages/GroupLanding').then(m => ({ default: m.GroupLanding })));
const CreateGroup = lazy(() => import('../../pages/CreateGroup').then(m => ({ default: m.CreateGroup })));
const CreateVipGroup = lazy(() => import('../../pages/CreateVipGroup').then(m => ({ default: m.CreateVipGroup })));
const CreatePublicGroup = lazy(() => import('../../pages/CreatePublicGroup').then(m => ({ default: m.CreatePublicGroup })));
const CreatePrivateGroup = lazy(() => import('../../pages/CreatePrivateGroup').then(m => ({ default: m.CreatePrivateGroup })));
const EditGroup = lazy(() => import('../../pages/EditGroup').then(m => ({ default: m.EditGroup })));
const VipGroupSales = lazy(() => import('../../pages/VipGroupSales').then(m => ({ default: m.VipGroupSales })));
const GroupSettings = lazy(() => import('../../pages/GroupSettings').then(m => ({ default: m.GroupSettings })));

// Nova Ponte de Sucesso
const SuccessBridge = lazy(() => import('../../pages/SuccessBridge').then(m => ({ default: m.SuccessBridge })));

// Sub-páginas de Configuração
const GroupInfoPage = lazy(() => import('../../pages/groups/settings/GroupInfoPage').then(m => ({ default: m.GroupInfoPage })));
const GroupAccessPage = lazy(() => import('../../pages/groups/settings/GroupAccessPage').then(m => ({ default: m.GroupAccessPage })));
const GroupModerationPage = lazy(() => import('../../pages/groups/settings/GroupModerationPage').then(m => ({ default: m.GroupModerationPage })));
const GroupMembersPage = lazy(() => import('../../pages/groups/settings/GroupMembersPage').then(m => ({ default: m.GroupMembersPage })));
const GroupVipPage = lazy(() => import('../../pages/groups/settings/GroupVipPage').then(m => ({ default: m.GroupVipPage })));
const GroupStatisticsPage = lazy(() => import('../../pages/groups/settings/GroupStatisticsPage').then(m => ({ default: m.GroupStatisticsPage })));
const GroupAuditLogs = lazy(() => import('../../pages/groups/settings/GroupAuditLogs').then(m => ({ default: m.GroupAuditLogs })));
const GroupChannelsPage = lazy(() => import('../../pages/groups/settings/GroupChannelsPage').then(m => ({ default: m.GroupChannelsPage })));
const GroupSchedule = lazy(() => import('../../pages/groups/settings/GroupSchedule').then(m => ({ default: m.GroupSchedule })));
const GroupSalesPlatformPage = lazy(() => import('../../pages/groups/settings/GroupSalesPlatformPage').then(m => ({ default: m.GroupSalesPlatformPage })));
const GroupSalesPlatformView = lazy(() => import('../../pages/groups/GroupSalesPlatformView').then(m => ({ default: m.GroupSalesPlatformView })));
const SalesFolderContentPage = lazy(() => import('../../pages/groups/SalesFolderContentPage').then(m => ({ default: m.SalesFolderContentPage })));
const GroupRolesPage = lazy(() => import('../../pages/groups/settings/GroupRolesPage').then(m => ({ default: m.GroupRolesPage })));
const GroupChannelsList = lazy(() => import('../../pages/groups/GroupChannelsList').then(m => ({ default: m.GroupChannelsList })));
const GroupCheckoutConfigPage = lazy(() => import('../../pages/groups/settings/GroupCheckoutConfigPage').then(m => ({ default: m.GroupCheckoutConfigPage })));

const GroupLimits = lazy(() => import('../../pages/LimitAndControl').then(m => ({ default: m.LimitAndControl })));
const ManageGroupLinks = lazy(() => import('../../pages/ManageGroupLinks').then(m => ({ default: m.ManageGroupLinks })));
const GroupRevenue = lazy(() => import('../../pages/GroupRevenue').then(m => ({ default: m.GroupRevenue })));
const VipSalesHistory = lazy(() => import('../../pages/VipSalesHistory').then(m => ({ default: m.VipSalesHistory })));

export const GroupRoutes = [
    <Route key="groups" path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />,
    <Route key="group-chat" path="/group-chat/:id" element={<ProtectedRoute><GroupChat /></ProtectedRoute>} />,
    <Route key="group-chat-channel" path="/group-chat/:id/:channelId" element={<ProtectedRoute><GroupChat /></ProtectedRoute>} />,
    <Route key="group-channels" path="/group/:id/channels" element={<ProtectedRoute><GroupChannelsList /></ProtectedRoute>} />,
    <Route key="group-landing" path="/group-landing/:id" element={<GroupLanding />} />,
    <Route key="vip-sales" path="/vip-group-sales/:id" element={<VipGroupSales />} />,
    <Route key="create-group" path="/create-group" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />,
    <Route key="create-group-vip" path="/create-group/vip" element={<ProtectedRoute><CreateVipGroup /></ProtectedRoute>} />,
    <Route key="create-group-public" path="/create-group/public" element={<ProtectedRoute><CreatePublicGroup /></ProtectedRoute>} />,
    <Route key="create-group-private" path="/create-group/private" element={<ProtectedRoute><CreatePrivateGroup /></ProtectedRoute>} />,
    <Route key="edit-group" path="/edit-group/:id" element={<ProtectedRoute><EditGroup /></ProtectedRoute>} />,
    
    // Rota Resiliente de Sucesso
    <Route key="payment-success-bridge" path="/payment-success-bridge/:id" element={<ProtectedRoute><SuccessBridge /></ProtectedRoute>} />,

    // Gestão Avançada
    <Route key="group-settings" path="/group-settings/:id" element={<ProtectedRoute><GroupSettings /></ProtectedRoute>} />,
    <Route key="gs-info" path="/group-settings/:id/info" element={<ProtectedRoute><GroupInfoPage /></ProtectedRoute>} />,
    <Route key="gs-access" path="/group-settings/:id/access" element={<ProtectedRoute><GroupAccessPage /></ProtectedRoute>} />,
    <Route key="gs-mod" path="/group-settings/:id/moderation" element={<ProtectedRoute><GroupModerationPage /></ProtectedRoute>} />,
    <Route key="gs-members" path="/group-settings/:id/members" element={<ProtectedRoute><GroupMembersPage /></ProtectedRoute>} />,
    <Route key="gs-roles" path="/group-settings/:id/roles" element={<ProtectedRoute><GroupRolesPage /></ProtectedRoute>} />,
    <Route key="gs-vip" path="/group-settings/:id/vip" element={<ProtectedRoute><GroupVipPage /></ProtectedRoute>} />,
    <Route key="gs-stats" path="/group-settings/:id/stats" element={<ProtectedRoute><GroupStatisticsPage /></ProtectedRoute>} />,
    <Route key="gs-audit" path="/group-settings/:id/audit" element={<ProtectedRoute><GroupAuditLogs /></ProtectedRoute>} />,
    <Route key="gs-channels" path="/group-settings/:id/channels" element={<ProtectedRoute><GroupChannelsPage /></ProtectedRoute>} />,
    <Route key="gs-schedule" path="/group-settings/:id/schedule" element={<ProtectedRoute><GroupSchedule /></ProtectedRoute>} />,
    <Route key="gs-platform" path="/group-settings/:id/sales-platform" element={<ProtectedRoute><GroupSalesPlatformPage /></ProtectedRoute>} />,
    <Route key="gs-checkout" path="/group-settings/:id/checkout-config" element={<ProtectedRoute><GroupCheckoutConfigPage /></ProtectedRoute>} />,
    <Route key="gp-view" path="/group-platform/:id" element={<ProtectedRoute><GroupSalesPlatformView /></ProtectedRoute>} />,
    <Route key="gp-folder" path="/group-folder/:groupId/:folderId" element={<ProtectedRoute><SalesFolderContentPage /></ProtectedRoute>} />,
    <Route key="g-limits" path="/group-limits/:id" element={<ProtectedRoute><GroupLimits /></ProtectedRoute>} />,
    <Route key="g-links" path="/group-links/:id" element={<ProtectedRoute><ManageGroupLinks /></ProtectedRoute>} />,
    <Route key="g-rev" path="/group-revenue/:id" element={<ProtectedRoute><GroupRevenue /></ProtectedRoute>} />,
    <Route key="v-history" path="/vip-sales-history/:id" element={<ProtectedRoute><VipSalesHistory /></ProtectedRoute>} />
];
