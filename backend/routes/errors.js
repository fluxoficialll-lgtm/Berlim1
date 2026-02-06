import express from 'express';
import reelsErrorLogger from '../services/audit/reelsErrorLogger.js';

const router = express.Router();

/**
 * @route   POST /api/errors/log-reels-error
 * @desc    Recebe, enriquece com dados contextuais e loga um erro do cliente Reels.
 * @access  Public
 */
router.post('/log-reels-error', (req, res) => {
  const { error, errorInfo } = req.body;

  // Monta o objeto de contexto da requisição para o logger
  const requestContext = {
    traceId: req.traceId, // Do traceMiddleware
    userId: req.user ? req.user.id : 'N/A', // Assumindo que a autenticação popula req.user
    ip: req.ip, // Express normalmente provê o IP
    userAgent: req.get('User-Agent') // Captura o User-Agent do header
  };

  try {
    // Passa os dados do erro e o contexto da requisição para o logger de precisão
    reelsErrorLogger.logReelsClientError({ error, errorInfo }, requestContext);
    
    res.status(200).json({ 
      message: 'Erro do cliente logado com sucesso no servidor.', 
      traceId: requestContext.traceId 
    });
  } catch (e) {
    // Log de um erro no próprio sistema de log, usando console.error para evitar loop infinito
    console.error('CRITICAL: Falha ao executar o reelsErrorLogger. O logger pode estar quebrado.', e);
    res.status(500).json({ message: 'Falha interna no serviço de log do servidor.' });
  }
});

export default router;
