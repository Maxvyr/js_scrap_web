const puppeteer = require('puppeteer');

const url = "https://www.kubii.fr/";

(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: "networkidle2"});

    // size viewport for sreenschot
    await page.setViewport({
        width: 1500,
        height: 2500,
    });

    // pdf
    await page.pdf({
        path : "page.pdf",
        format : "A4",
    });

    //image size image = viewport size
    await page.screenshot({
        path : "image.png",
    });

    // close
    await browser.close();
})();