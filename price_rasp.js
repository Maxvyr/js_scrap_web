const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
require('dotenv').config();

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
    //     path : "file_create/page.pdf",
    //     format : "A4",
    // });

    // //image size image = viewport size
    // await page.screenshot({
    //     path : "file_create/image.png",
    // });

    // recover price specific
    // use itemprop
    let priceRecover = await page.evaluate(() => {
        return document.querySelector('span[itemprop=price]').innerHTML;
    });
    console.log("le prix est de => " + priceRecover);
    let pricePi4 = parseInt(priceRecover.substring(0, 2))

    if(pricePi4 < 44) {
        sendNotification(pricePi4);
    }

    // close
    await browser.close();
})();



async function sendNotification(price) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_SEND,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter
      .sendMail({
        from: '"Rasp Pi4" <' + process.env.MAIL_SEND  + '>',
        to: process.env.MAIL_RECEIVE,
        subject: "Prix Rasp sous les " + price + "€",
        html: "Le prix du rasp est de " + price + "€",
      })
      .then(() => console.log("Message send"));
  }