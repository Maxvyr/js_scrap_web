const puppeteer = require('puppeteer');

const url = "https://www.kubii.fr/";

(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: "networkidle2"});

    // pdf
    await page.pdf({
        path : "page.pdf",
        format : "A4",
    });

    // close
    await browser.close();
})();