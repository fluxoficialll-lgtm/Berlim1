
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';

const Messages = lazy(() => import('../../pages/Messages').then(m => ({ default: m.Messages })));
const Chat = lazy(() => import('../../pages/Chat').then(m => ({ default: m.Chat })));
const BlockedUsers = lazy(() => import('../../pages/BlockedUsers').then(m => ({ default: m.BlockedUsers })));
const Notifications = lazy(() => import('../../pages/Notifications').then(m => ({ default: m.Notifications })));
const Settings = lazy(() => import('../../pages/Settings').then(m => ({ default: m.Settings })));
const NotificationSettings = lazy(() => import('../../pages/NotificationSettings').then(m => ({ default: m.NotificationSettings })));
const SecurityLogin = lazy(() => import('../../pages/SecurityLogin').then(m => ({ default: m.SecurityLogin })));
const TermsAndPrivacy = lazy(() => import('../../pages/TermsAndPrivacy').then(m => ({ default: m.TermsAndPrivacy })));
const HelpSupport = lazy(() => import('../../pages/HelpSupport').then(m => ({ default: m.HelpSupport })));
const LocationSelector = lazy(() => import('../../pages/LocationSelector').then(m => ({ default: m.LocationSelector })));
const LanguageSettings = lazy(() => import('../../pages/LanguageSettings').then(m => ({ default: m.LanguageSettings })));
const FinancialPanel = lazy(() => import('../../pages/FinancialPanel').then(m => ({ default: m.FinancialPanel })));
const ProviderConfig = lazy(() => import('../../pages/ProviderConfig').then(m => ({ default: m.ProviderConfig })));

export const SettingsRoutes = [
    <Route key="messages" path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />,
    <Route key="chat-private" path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />,
    <Route key="notifications" path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />,
    <Route key="blocked-users" path="/blocked-users" element={<ProtectedRoute><BlockedUsers /></ProtectedRoute>} />,
    <Route key="settings" path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />,
    <Route key="notif-settings" path="/notification-settings" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />,
    <Route key="security-login" path="/security-login" element={<ProtectedRoute><SecurityLogin /></ProtectedRoute>} />,
    <Route key="lang-settings" path="/settings/language" element={<ProtectedRoute><LanguageSettings /></ProtectedRoute>} />,
    <Route key="terms" path="/terms" element={<ProtectedRoute><TermsAndPrivacy /></ProtectedRoute>} />,
    <Route key="help" path="/help" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />,
    <Route key="location" path="/location-filter" element={<ProtectedRoute><LocationSelector /></ProtectedRoute>} />,
    <Route key="financial" path="/financial" element={<ProtectedRoute><FinancialPanel /></ProtectedRoute>} />,
    <Route key="financial-providers" path="/financial/providers" element={<ProtectedRoute><ProviderConfig /></ProtectedRoute>} />
];
