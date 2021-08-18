const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

const url = "https://read.amazon.com/notebook?ref_=kcr_notebook_lib&language=en-US";

(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: "networkidle2"});

    await page.type("[type=email]", process.env.KINDLE_MAIL, {delay: 100});
    await page.type("[type=password]", process.env.KINDLE_PASS, {delay: 100});

    await page.click("input[type=submit]");

    // wait page show
    await page.waitForSelector("img[alt=Kindle]");
    // wait number show on page
    // variable
    let linkBookImg;
    let nameBook;
    let numberHighlights;
    let numberNotes;
    let highlights;

    // pdf
    await page.pdf({
        path : "file_create/page.pdf",
        format : "A4",
    });

    // wait 500ms after logo Kindle appear
    setTimeout(async () => {
        linkBookImg = await page.evaluate(() => { 
            return document.querySelector('img[class="kp-notebook-cover-image-border"]').src
        });

        nameBook = await page.evaluate(() => { 
            return document.querySelector('h3').innerHTML;
        });

        numberHighlights = await page.evaluate(() => { 
            return document.querySelector("#kp-notebook-highlights-count").innerText;
        });
        
        numberNotes = await page.evaluate(() => { 
            return document.querySelector("#kp-notebook-notes-count").innerText;
        });    
        
        highlights = await page.evaluate(() => { 
            let receive = document.querySelector("#kp-notebook-annotations").innerText;
            let format = receive.replaceAll("Options", "\n").replaceAll("Blue highlight |", "").replaceAll("Yellow highlight |", "");
            return format;
        });
        
        let txt = "TITLE =>  " + nameBook + "\n\n" + "IMG BOOK =>  " + linkBookImg + "\n\n" + "Number of Hightlights =>  " + numberHighlights + "\n" + "Number of Notes =>  " + numberNotes + "\n\n\n" + highlights;
        
        fs.writeFile(
            "file_create/kindle_note.txt", txt, (err) => {
                if (err) throw err;
                console.log("File Saved!");
            }
        );

        sendNotificationKindleHighLights(nameBook);
        
        // close
        await browser.close();
    },500);
})();

async function sendNotificationKindleHighLights(bookName) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_SEND,
        pass: process.env.MAIL_PASS,
      },
    });
  
    let info = await transporter
      .sendMail({
        from: 'HighLights - ' + bookName + ' <' + process.env.MAIL_SEND  + '>',
        to: process.env.MAIL_RECEIVE,
        subject: 'HighLights - Kindle',
        html: '<h1>' + bookName + '</h1>',
        attachments : [{
            filename : bookName + '.txt',
            path: 'file_create/kindle_note.txt',
        }],
      })
      .then(() => console.log("Message send!"));
  }