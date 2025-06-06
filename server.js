const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const app = express();

app.use(express.static('public')); // Serve your static files (map images, etc.)

// Dynamic og:image endpoint
app.get('/preview.png', async (req, res) => {
    const { pinx = 100, piny = 100 } = req.query;
    const url = `http://localhost:3000/preview.html?pinx=${pinx}&piny=${piny}`;

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 400 });
    await page.goto(url);
    const buffer = await page.screenshot();
    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(buffer);
});

// Serve HTML with dynamic og:image
app.get('/', (req, res) => {
    const { pinx = 100, piny = 100 } = req.query;
    res.send(`
        <html>
        <head>
            <meta property="og:title" content="Se hvor jeg har satt pinnen på kartet!">
            <meta property="og:description" content="Klikk for å se hvor jeg har markert på Årvoll-kartet.">
            <meta property="og:image" content="http://localhost:3000/preview.png?pinx=${pinx}&piny=${piny}">
            <meta property="og:type" content="website">
            <meta property="og:url" content="http://localhost:3000/?pinx=${pinx}&piny=${piny}">
        </head>
        <body>
            <script>window.location = "/index.html?pinx=${pinx}&piny=${piny}"</script>
        </body>
        </html>
    `);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));