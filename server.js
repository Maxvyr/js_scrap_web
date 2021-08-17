const puppeteer = require('puppeteer');

const url = "https://www.kubii.fr/cartes-raspberry-pi/2771-nouveau-raspberry-pi-4-modele-b-2gb-0765756931175.html?search_query=Pi4&results=111";

(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: "networkidle2"});

    // size viewport for sreenschot
    // await page.setViewport({
    //     width: 1500,
    //     height: 2500,
    // });

    // // pdf
    // await page.pdf({
    //     path : "page.pdf",
    //     format : "A4",
    // });

    // //image size image = viewport size
    // await page.screenshot({
    //     path : "image.png",
    // });

    // recover price specific
    // use itemprop
    let priceRecover = await page.evaluate(() => {
        return document.querySelector('span[itemprop=price]').innerHTML;
    });
    let pricePi4 = priceRecover.substring(0, 2)
    console.log("le prix est de => " + pricePi4);

    // close
    await browser.close();
})();