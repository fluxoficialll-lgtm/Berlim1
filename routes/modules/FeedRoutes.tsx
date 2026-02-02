import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';

const Feed = lazy(() => import('../../pages/Feed').then(m => ({ default: m.Feed })));
const PostDetails = lazy(() => import('../../pages/PostDetails').then(m => ({ default: m.PostDetails })));
const CreatePost = lazy(() => import('../../pages/CreatePost').then(m => ({ default: m.CreatePost })));
const CreatePoll = lazy(() => import('../../pages/CreatePoll').then(m => ({ default: m.CreatePoll })));
const Reels = lazy(() => import('../../pages/Reels').then(m => ({ default: m.Reels })));
const CreateReel = lazy(() => import('../../pages/CreateReel').then(m => ({ default: m.CreateReel })));
const ReelsSearch = lazy(() => import('../../pages/ReelsSearch').then(m => ({ default: m.ReelsSearch })));
const FeedSearch = lazy(() => import('../../pages/FeedSearch').then(m => ({ default: m.FeedSearch })));

export const FeedRoutes = [
    <Route key="feed" path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />,
    <Route key="post-details" path="/post/:id" element={<ProtectedRoute><PostDetails /></ProtectedRoute>} />,
    <Route key="create-post" path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />,
    <Route key="create-poll" path="/create-poll" element={<ProtectedRoute><CreatePoll /></ProtectedRoute>} />,
    <Route key="reels" path="/reels" element={<ProtectedRoute><Reels /></ProtectedRoute>} />,
    <Route key="reel-specific" path="/reels/:id" element={<ProtectedRoute><Reels /></ProtectedRoute>} />,
    <Route key="reels-search" path="/reels-search" element={<ProtectedRoute><ReelsSearch /></ProtectedRoute>} />,
    <Route key="feed-search" path="/feed-search" element={<ProtectedRoute><FeedSearch /></ProtectedRoute>} />,
    <Route key="create-reel" path="/create-reel" element={<ProtectedRoute><CreateReel /></ProtectedRoute>} />
];