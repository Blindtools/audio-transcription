const { Client, LocalAuth, Buttons } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const http = require('http');

// 1. START A SIMPLE WEB SERVER
// This prevents Render from marking the deployment as failed due to "No open ports detected"
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WhatsApp Bot is Running\n');
}).listen(PORT, () => {
    console.log(`Web server listening on port ${PORT}`);
});

// 2. CONFIGURE WHATSAPP CLIENT
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        // This path is guaranteed by the new Dockerfile
        executablePath: '/usr/bin/google-chrome-stable',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process',
            '--disable-gpu'
        ],
    }
});

client.on('qr', (qr) => {
    console.log('--- SCAN THIS QR CODE ---');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Bot is Ready!');
});

client.on('message', async (msg) => {
    if (msg.body === '!testbuttons') {
        const buttons = [
            { id: 'btn1', body: 'Visit Website' },
            { id: 'btn2', body: 'Call Support' }
        ];

        const buttonMsg = new Buttons(
            'Welcome! Select an option below:',
            buttons,
            'Menu',
            'Powered by Manus'
        );

        try {
            await client.sendMessage(msg.from, buttonMsg);
        } catch (e) {
            // Fallback for mobile devices that don't support native buttons
            await client.sendMessage(msg.from, "*Menu*\n\n1. Visit Website\n2. Call Support\n\n_Reply with 1 or 2_");
        }
    }
    
    // Response logic for fallback or buttons
    if (msg.body === '1') await client.sendMessage(msg.from, 'URL: https://example.com');
    if (msg.body === '2') await client.sendMessage(msg.from, 'Call: +123456789');
});

client.initialize().catch(err => {
    console.error('Initialization error:', err);
});
