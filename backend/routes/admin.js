import express from 'express';
import { validateAdmin } from '../middleware.js';
import { adminDispatcher } from './admin/dispatcher.js';

const router = express.Router();

/**
 * ENDPOINT ÚNICO ADMINISTRATIVO
 * ---------------------------------------------------------
 * A partir de agora, não existem mais rotas fixas no Admin.
 * Tudo é resolvido dinamicamente pelo Dispatcher.
 * 
 * Padrão: /api/admin/execute/:category/:action
 */
router.all('/execute/:category/:action', validateAdmin, adminDispatcher);

export default router;