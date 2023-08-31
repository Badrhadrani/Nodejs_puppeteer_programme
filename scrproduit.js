import puppeteer from 'puppeteer';

async function scrapeProduct(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Extract product information
    const title = await page.$eval('.StyleWrapper_wrapper ', (element) => element.textContent);
    const price = await page.$eval('.Details_item-number-body', (element) => element.textContent);
    const description = await page.$eval('.Details_description', (element) => element.textContent);
    const fichetechnique = await page.$eval('.Details_table-list', (element)=> element.innerHTML);
    const image = await page.$eval('.MediaGallery_media-gallery img', (img) => img.getAttribute('src'));

    console.log('Title  :' ,  title);
    console.log('Price  :',  price);
    console.log('Description  :',  description);
    console.log('Fiche Technique  : ',  fichetechnique)
    console.log('Image  : ',  image)

    await browser.close();
}

const productUrl = 'https://www.disway.com/lenovo-thinkpad-t14-i5-1135g7-14-7-fhd-8-go-512-go-20w0013wfe'; // Replace with the actual product URL
scrapeProduct(productUrl);
