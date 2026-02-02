
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';

const Profile = lazy(() => import('../../pages/Profile').then(m => ({ default: m.Profile })));
const UserProfile = lazy(() => import('../../pages/UserProfile').then(m => ({ default: m.UserProfile })));
const CompleteProfile = lazy(() => import('../../pages/CompleteProfile').then(m => ({ default: m.CompleteProfile })));
const EditProfile = lazy(() => import('../../pages/EditProfile').then(m => ({ default: m.EditProfile })));
const GlobalSearch = lazy(() => import('../../pages/GlobalSearch').then(m => ({ default: m.GlobalSearch })));
const Leaderboard = lazy(() => import('../../pages/Leaderboard').then(m => ({ default: m.Leaderboard })));
const TopGroups = lazy(() => import('../../pages/TopGroups').then(m => ({ default: m.TopGroups })));

export const ProfileRoutes = [
    <Route key="profile-me" path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />,
    <Route key="profile-user" path="/user/:username" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />,
    <Route key="profile-complete" path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />,
    <Route key="profile-edit" path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />,
    <Route key="global-search" path="/global-search" element={<ProtectedRoute><GlobalSearch /></ProtectedRoute>} />,
    <Route key="leaderboard" path="/rank" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />,
    <Route key="top-groups" path="/top-groups" element={<ProtectedRoute><TopGroups /></ProtectedRoute>} />,
    <Route key="top-groups-cat" path="/top-groups/:category" element={<ProtectedRoute><TopGroups /></ProtectedRoute>} />
];
