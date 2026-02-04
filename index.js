const { Client, LocalAuth, Buttons } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');

// Optimized for Render Free Tier
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        // Render's Chrome path after 'npx puppeteer browsers install chrome'
        // It's usually in ~/.cache/puppeteer, but we'll try to let Puppeteer find it
        // or use the environment variable we set in Render
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', 
            '--disable-gpu'
        ],
    }
});

client.on('qr', (qr) => {
    console.log('--- QR CODE RECEIVED ---');
    console.log('Scan this code with your WhatsApp app:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Client is Ready!');
});

client.on('message', async (msg) => {
    if (msg.body === '!testbuttons') {
        /**
         * IMPORTANT: Native buttons are often blocked on mobile for non-API users.
         * We send the button object but also provide a text fallback.
         */
        const buttons = [
            { id: 'btn1', body: 'Visit Website' },
            { id: 'btn2', body: 'Call Support' }
        ];

        const buttonMsg = new Buttons(
            'Welcome! Click a button below or reply with the number.',
            buttons,
            'Interactive Menu',
            'Select an option'
        );

        try {
            await client.sendMessage(msg.from, buttonMsg);
            console.log('Sent button message to:', msg.from);
        } catch (err) {
            console.log('Native buttons failed, sending fallback text.');
            await sendFallback(msg.from);
        }
    }

    // Fallback logic for manual replies (1 or 2)
    if (msg.body === '1') {
        await client.sendMessage(msg.from, 'Redirecting to: https://example.com');
    } else if (msg.body === '2') {
        await client.sendMessage(msg.from, 'Support: +123456789');
    }
});

async function sendFallback(to) {
    const text = `*Interactive Menu*\n\n1. Visit Website\n2. Call Support\n\n_Reply with 1 or 2_`;
    await client.sendMessage(to, text);
}

// Global error handling for Puppeteer crashes
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

client.initialize().catch(err => {
    console.error('Initialization error:', err);
});
