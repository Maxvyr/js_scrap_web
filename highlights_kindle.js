const puppeteer = require('puppeteer');
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
    let numberHighlights
    let numberNotes
    let highlights

    // pdf
    await page.pdf({
        path : "page.pdf",
        format : "A4",
    });

    setTimeout(async () => {
        numberHighlights = await page.evaluate(() => { 
            return document.querySelector("#kp-notebook-highlights-count").innerText
        });
        
        numberNotes = await page.evaluate(() => { 
            return document.querySelector("#kp-notebook-notes-count").innerText
        });    
        
        highlights = await page.evaluate(() => { 
            return document.querySelector("#kp-notebook-annotations").innerText
        });
        
        let txt = "Number of Hightlights =>  " + numberHighlights + "\n" + "Number of Notes =>  " + numberNotes + "\n\n\n" + highlights;
        
        fs.writeFile(
            "file_create/kindle_note.txt", txt, (err) => {
                if (err) throw err;
                console.log("File Saved!");
            }
        );
        
        // close
        await browser.close();
    },500);
})();