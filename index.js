const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
    res.json({
        message: '🤖 Bot WhatsApp funcionando!',
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

// Rota para webhook do WhatsApp
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
