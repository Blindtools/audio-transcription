const { Client, LocalAuth, Buttons } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

/**
 * AUTO-DETECTION FOR CHROME PATH
 * This helps avoid manual environment variables.
 */
const possiblePaths = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/opt/render/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome' // Common Render cache path
];

let chromePath = null;
for (const path of possiblePaths) {
    if (path && fs.existsSync(path)) {
        chromePath = path;
        break;
    }
}

console.log(chromePath ? `Detected Chrome at: ${chromePath}` : 'No Chrome path detected, using Puppeteer default.');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: chromePath,
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
    console.log('Bot is ready!');
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
            // Fallback for mobile
            await client.sendMessage(msg.from, "*Menu*\n\n1. Visit Website\n2. Call Support\n\n_Reply with 1 or 2_");
        }
    }
    
    // Simple response logic
    if (msg.body === '1') await client.sendMessage(msg.from, 'URL: https://example.com');
    if (msg.body === '2') await client.sendMessage(msg.from, 'Call: +123456789');
});

client.initialize().catch(err => console.error('Init error:', err));
