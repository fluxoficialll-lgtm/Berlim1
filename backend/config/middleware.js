
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { traceMiddleware } from '../services/audit/TraceMiddleware.js'; // IMPORTADO
import { trafficLogger } from '../services/audit/trafficLogger.js';
import { heartbeatLogger } from '../services/audit/heartbeatLogger.js';

export const setupMiddlewares = (app, io) => {
    // CRÍTICO: Confiar nos headers do proxy para obter o IP correto do cliente
    app.set('trust proxy', 1);

    // Middlewares de Segurança Essenciais
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
        referrerPolicy: { policy: "no-referrer-when-downgrade" }
    }));

    // ADICIONADO: Middleware de Rastreamento de Requisições
    // Deve vir antes de qualquer logger ou rota para garantir que o traceId esteja sempre presente.
    app.use(traceMiddleware); 

    // Configuração do CORS para permitir requisições do front-end
    app.use(cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: [
            'Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 
            'Cache-Control', 'X-Flux-Client-ID', 'X-Trace-ID', 'X-Admin-Action'
        ]
    }));

    // Middlewares de Performance e Parsing
    app.use(compression());
    app.use(express.json({ limit: '50mb' })); 
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Middleware de Log de Tráfego e Pulsação do Cliente
    app.use((req, res, next) => {
        const start = Date.now();
        const clientId = req.headers['x-flux-client-id'];

        // Loga a requisição de entrada (ignorando pre-flight OPTIONS)
        if (req.method !== 'OPTIONS') trafficLogger.logInbound(req);
        // Registra a atividade do cliente se um ID de cliente for enviado
        if (clientId) heartbeatLogger.logPulse(clientId);

        // Loga a resposta de saída quando a requisição terminar
        res.on('finish', () => {
            const duration = Date.now() - start;
            trafficLogger.logOutbound(req, res, duration);
        });
        
        // Anexa a instância do Socket.IO ao objeto de requisição
        req.io = io;
        next();
    });
};
