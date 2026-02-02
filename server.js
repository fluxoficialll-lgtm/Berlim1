
import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';

// Configurações Modulares
import { initSocket } from './backend/config/socket.js';
import { setupMiddlewares } from './backend/config/middleware.js';
import { upload } from './backend/config/storage.js';

// Auditoria e Telemetria
import { traceMiddleware } from './backend/services/audit/TraceMiddleware.js';

// Serviços e Rotas
import { dbManager } from './backend/databaseManager.js';
import { storageService } from './backend/services/storageService.js';
import { IntegrityCheck } from './backend/jobs/IntegrityCheck.js';
import apiRoutes from './backend/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);

// 1. Inicialização da Infraestrutura e Socket
const io = initSocket(httpServer);
setupMiddlewares(app, io);

// 2. Injeção de Camada de Observabilidade (Trace ID)
app.use(traceMiddleware);

// 3. Inicialização do Banco de Dados e Manutenção
dbManager.init()
    .then(() => {
        console.log("✅ [System] Database system initialized.");
        setTimeout(() => {
            IntegrityCheck.fixGroupMemberCounts();
            IntegrityCheck.cleanupExpiredVip();
        }, 5000);

        setInterval(() => {
            IntegrityCheck.fixGroupMemberCounts();
        }, 1000 * 60 * 60);
    })
    .catch(err => console.error("❌ [System] DB Boot Error:", err));

// --- ROTAS DE API ---
app.use('/api', apiRoutes);

app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    try {
        const folder = req.body.folder || 'misc';
        const fileUrl = await storageService.uploadFile(req.file, folder);
        res.json({ success: true, files: [{ url: fileUrl }] });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar upload para nuvem' });
    }
});

// --- SERVIÇO DE ARQUIVOS ESTÁTICOS (SPA) ---
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

// Tratamento de erro 404 para API (Sempre JSON)
app.use('/api', (req, res) => {
    res.status(404).json({ 
        error: "Endpoint não encontrado no Dispatcher Administrativo.",
        path: req.path,
        method: req.method
    });
});

// Tratamento global de erros (Sempre JSON para API)
app.use((err, req, res, next) => {
    if (req.path.startsWith('/api')) {
        console.error(`🔴 [API Error]: ${err.message}`);
        return res.status(500).json({ error: "Erro interno no servidor de dados.", details: err.message });
    }
    next(err);
});

// Catch-all para SPA (Apenas se NÃO for API)
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Frontend build not found.');
    }
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 [System] Flux Server running on port ${PORT}.`);
});
