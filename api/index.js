// Serverless function para Vercel
export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            return res.status(200).json({
                message: 'Bot WhatsApp funcionando!',
                status: 'online',
                timestamp: new Date().toISOString(),
                whatsapp: 'Aguardando conexão',
                instructions: 'Acesse /api/init para inicializar o WhatsApp'
            });
        }
        
        if (req.method === 'POST') {
            const { message, from } = req.body || {};
            
            console.log('Mensagem recebida:', message, 'de:', from);
            
            return res.status(200).json({
                success: true,
                received: message,
                response: 'Mensagem processada!'
            });
        }
        
        res.status(405).json({ error: 'Método não permitido' });
        
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            message: error.message 
        });
    }
}
