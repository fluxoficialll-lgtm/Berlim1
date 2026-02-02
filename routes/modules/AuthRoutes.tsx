
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

const Login = lazy(() => import('../../pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('../../pages/Register').then(m => ({ default: m.Register })));
const VerifyEmail = lazy(() => import('../../pages/VerifyEmail').then(m => ({ default: m.VerifyEmail })));
const ForgotPassword = lazy(() => import('../../pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('../../pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const Banned = lazy(() => import('../../pages/Banned').then(m => ({ default: m.Banned })));

export const AuthRoutes = [
    <Route key="login" path="/" element={<Login />} />,
    <Route key="register" path="/register" element={<Register />} />,
    <Route key="verify-email" path="/verify-email" element={<VerifyEmail />} />,
    <Route key="forgot-password" path="/forgot-password" element={<ForgotPassword />} />,
    <Route key="reset-password" path="/reset-password" element={<ResetPassword />} />,
    <Route key="banned" path="/banned" element={<Banned />} />
];
