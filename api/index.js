const express = require('express');
const { createBot, createProvider, createFlow, addKeyword, MemoryDB } = require('@builderbot/bot');
const { BaileysProvider } = require('@builderbot/provider-baileys');

const app = express();

// Middleware
app.use(express.json());

// Fluxos do WhatsApp Bot
const welcomeFlow = addKeyword(['oi', 'olá', 'hello', 'hi'])
    .addAnswer('🤖 Olá! Sou seu assistente virtual!')
    .addAnswer('Como posso te ajudar hoje?')
    .addAnswer([
        '👉 Digite *info* para informações',
        '👉 Digite *contato* para falar conosco',
        '👉 Digite *horario* para horário de funcionamento'
    ]);

const infoFlow = addKeyword(['info', 'informação', 'informações'])
    .addAnswer('ℹ️ *Informações da empresa:*')
    .addAnswer('Somos uma empresa focada em atendimento de qualidade!')
    .addAnswer('Para mais informações, digite *contato*');

const contactFlow = addKeyword(['contato', 'falar', 'conversar'])
    .addAnswer('📞 *Nossos contatos:*')
    .addAnswer('📧 Email: contato@empresa.com')
    .addAnswer('📱 WhatsApp: (11) 99999-9999')
    .addAnswer('🌐 Site: www.empresa.com');

const scheduleFlow = addKeyword(['horario', 'horário', 'funcionamento'])
    .addAnswer('🕒 *Horário de funcionamento:*')
    .addAnswer('Segunda a Sexta: 8h às 18h')
    .addAnswer('Sábado: 8h às 12h')
    .addAnswer('Domingo: Fechado');

const fallbackFlow = addKeyword([''])
    .addAnswer('❓ Não entendi sua mensagem.')
    .addAnswer('Digite uma das opções:')
    .addAnswer([
        '👉 *info* - Informações',
        '👉 *contato* - Nossos contatos', 
        '👉 *horario* - Horário de funcionamento'
    ]);

// Inicializar WhatsApp Bot
let botInstance = null;

const initWhatsAppBot = async () => {
    if (!botInstance) {
        try {
            const adapterDB = new MemoryDB();
            const adapterFlow = createFlow([
                welcomeFlow, 
                infoFlow, 
                contactFlow, 
                scheduleFlow,
                fallbackFlow
            ]);
            const adapterProvider = createProvider(BaileysProvider);
            
            botInstance = await createBot({
                flow: adapterFlow,
                provider: adapterProvider,
                database: adapterDB,
            });
            
            console.log('🤖 WhatsApp Bot iniciado com sucesso!');
            console.log('📱 Escaneie o QR Code para conectar');
            
            return botInstance;
        } catch (error) {
            console.error('Erro ao inicializar bot:', error);
            return null;
        }
    }
    return botInstance;
};

// Rota principal
app.get('/', (req, res) => {
    res.json({
        message: '🤖 Bot WhatsApp funcionando!',
        status: 'online',
        timestamp: new Date().toISOString(),
        whatsapp: botInstance ? 'Conectado' : 'Aguardando conexão',
        instructions: 'Acesse /qr para ver o QR Code do WhatsApp'
    });
});

// Rota para inicializar WhatsApp
app.get('/init', async (req, res) => {
    try {
        const bot = await initWhatsAppBot();
        res.json({
            success: true,
            message: 'Bot WhatsApp inicializado!',
            status: bot ? 'Iniciado' : 'Erro ao iniciar'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Rota para webhook (se necessário)
app.post('/webhook', (req, res) => {
    const { message, from } = req.body || {};
    
    console.log('Mensagem recebida:', message, 'de:', from);
    
    res.json({
        success: true,
        received: message,
        response: 'Mensagem processada!'
    });
});

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
}

// Export para Vercel
module.exports = app;
