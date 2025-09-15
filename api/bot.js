const { createBot, createProvider, createFlow, addKeyword, MemoryDB } = require('@builderbot/bot')
const { BaileysProvider } = require('@builderbot/provider-baileys')

// Fluxo de boas-vindas
const welcomeFlow = addKeyword(['oi', 'olá', 'hello', 'hi'])
    .addAnswer('🤖 Olá! Sou seu assistente virtual!')
    .addAnswer('Como posso te ajudar hoje?')
    .addAnswer([
        '👉 Digite *info* para informações',
        '👉 Digite *contato* para falar conosco',
        '👉 Digite *horario* para horário de funcionamento'
    ])

// Fluxo de informações
const infoFlow = addKeyword(['info', 'informação', 'informações'])
    .addAnswer('ℹ️ *Informações da empresa:*')
    .addAnswer('Somos uma empresa focada em atendimento de qualidade!')
    .addAnswer('Para mais informações, digite *contato*')

// Fluxo de contato
const contactFlow = addKeyword(['contato', 'falar', 'conversar'])
    .addAnswer('📞 *Nossos contatos:*')
    .addAnswer('📧 Email: contato@empresa.com')
    .addAnswer('📱 WhatsApp: (11) 99999-9999')
    .addAnswer('🌐 Site: www.empresa.com')

// Fluxo de horário
const scheduleFlow = addKeyword(['horario', 'horário', 'funcionamento'])
    .addAnswer('🕒 *Horário de funcionamento:*')
    .addAnswer('Segunda a Sexta: 8h às 18h')
    .addAnswer('Sábado: 8h às 12h')
    .addAnswer('Domingo: Fechado')

// Fluxo padrão para mensagens não reconhecidas
const fallbackFlow = addKeyword([''])
    .addAnswer('❓ Não entendi sua mensagem.')
    .addAnswer('Digite uma das opções:')
    .addAnswer([
        '👉 *info* - Informações',
        '👉 *contato* - Nossos contatos', 
        '👉 *horario* - Horário de funcionamento'
    ])

// Inicializar bot
let bot = null;

const initBot = async () => {
    if (!bot) {
        const adapterDB = new MemoryDB()
        const adapterFlow = createFlow([
            welcomeFlow, 
            infoFlow, 
            contactFlow, 
            scheduleFlow,
            fallbackFlow
        ])
        const adapterProvider = createProvider(BaileysProvider)
        
        bot = await createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        })
        
        console.log('🚀 Bot iniciado com sucesso!')
        console.log('📱 Escaneie o QR Code para conectar o WhatsApp')
    }
    return bot
}

// Handler para Vercel
module.exports = async (req, res) => {
    try {
        await initBot()
        
        if (req.method === 'GET') {
            return res.status(200).json({ 
                status: 'Bot WhatsApp funcionando!',
                message: 'Escaneie o QR Code para conectar',
                timestamp: new Date().toISOString()
            })
        }
        
        // Handle webhook do WhatsApp
        if (req.method === 'POST') {
            // Processar mensagens do WhatsApp aqui
            return res.status(200).json({ success: true })
        }
        
        res.status(405).json({ error: 'Método não permitido' })
    } catch (error) {
        console.error('Erro no bot:', error)
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
}
