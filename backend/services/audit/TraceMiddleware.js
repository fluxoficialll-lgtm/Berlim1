
import crypto from 'crypto';

/**
 * TraceMiddleware: O elo entre Frontend e Backend.
 * Garante que cada request tenha um ID único para busca em logs.
 */
export const traceMiddleware = (req, res, next) => {
    // Se o frontend enviou um ID, usamos ele, senão geramos um novo
    const traceId = req.headers['x-trace-id'] || crypto.randomUUID();
    
    req.traceId = traceId;
    res.setHeader('x-trace-id', traceId);

    // Logger discreto de entrada
    if (process.env.NODE_ENV !== 'production') {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`[TRACE:${traceId}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
        });
    }

    next();
};
