import puppeteer from 'puppeteer';

async function scrapePages() {
    try {
    const baseUrl = 'https://www.disway.com/ordinateur/pc-bureau/?view-mode=grid';
    const totalPages = 5; // Specify the total number of pages to scrape

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let results = []; // Array to store the scraped data

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const url = baseUrl + pageNum;
    await page.goto(url);

    const data = await page.evaluate(() => {
        let items = document.querySelectorAll('.PLP_item');
        let pageResults = [];

        items.forEach((item) => {
        pageResults.push({
            title: item.querySelector('.PLP_product-title').innerText,
            Description: item.querySelector('.PLP_product-attributes').innerText,
            Reference: item.querySelector('.PLP_product-id-stock').innerText,
        });
        });

        return pageResults;
    });

      results = results.concat(data); // Append the data from the current page to the results array
    }

    console.log(results);
    await browser.close();
    } catch (error) {
    console.error(error);
    }
}

scrapePages();
