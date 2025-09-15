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

const main = async () => {
    // Configuração do banco de dados em memória
    const adapterDB = new MemoryDB()
    
    // Criação do fluxo principal
    const adapterFlow = createFlow([
        welcomeFlow, 
        infoFlow, 
        contactFlow, 
        scheduleFlow,
        fallbackFlow
    ])
    
    // Configuração do provedor Baileys
    const adapterProvider = createProvider(BaileysProvider)
    
    // Criação do bot
    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    // Servidor HTTP na porta do Render
    const PORT = process.env.PORT || 3000
    httpServer(PORT)
    
    console.log(`🚀 Bot iniciado na porta ${PORT}`)
    console.log('📱 Escaneie o QR Code para conectar o WhatsApp')
}

main().catch(console.error)
