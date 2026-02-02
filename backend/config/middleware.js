
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { bridgeLogger } from '../services/audit/bridgeLogger.js';
import { trafficLogger } from '../services/audit/trafficLogger.js';
import { heartbeatLogger } from '../services/audit/heartbeatLogger.js';

export const setupMiddlewares = (app, io) => {
    // CRÍTICO: Configura o Express para confiar nos headers do proxy (Render/Cloudflare)
    // Sem isso, o app vê apenas o IP do servidor interno, causando bloqueio no Meta CAPI.
    app.set('trust proxy', 1);

    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
        referrerPolicy: { policy: "no-referrer-when-downgrade" }
    }));

    app.use(cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: [
            'Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 
            'Cache-Control', 'X-Flux-Client-ID', 'X-Flux-Trace-ID', 'X-Admin-Action'
        ]
    }));

    app.use(compression());
    app.use(express.json({ limit: '50mb' })); 
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    app.use((req, res, next) => {
        const start = Date.now();
        const clientId = req.headers['x-flux-client-id'];

        if (req.method !== 'OPTIONS') trafficLogger.logInbound(req);
        if (clientId) heartbeatLogger.logPulse(clientId);

        res.on('finish', () => {
            const duration = Date.now() - start;
            trafficLogger.logOutbound(req, res, duration);
        });
        
        req.io = io;
        next();
    });
};
