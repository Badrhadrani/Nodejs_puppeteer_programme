import puppeteer from 'puppeteer';
import { Sequelize, Model, DataTypes } from 'sequelize';

// Create a Sequelize instance and configure the database connection
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql',
});

// Define a model for your scraped data
class ScrapedData extends Model {}
ScrapedData.init(
    {
    title: DataTypes.STRING,
    price: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    fichetechnique: DataTypes.STRING,
    },
    { sequelize, modelName: 'scrapedData' }
);

async function scrapePages() {
try {
    const baseUrl = 'https://www.disway.com/allproducts/?view-mode=grid';
    const totalPages = 154;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Increase the navigation timeout to 60 seconds
    await page.setDefaultNavigationTimeout(60000);

    let results = [];
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const url = baseUrl + pageNum;
    await page.goto(url);
    const data = await page.evaluate(() => {
        let items = document.querySelectorAll('.PLP_item');
        let pageResults = [];

        items.forEach((item) => {
        pageResults.push({
            link: item.querySelector('.PLP_product-title')?.href || null,
        });
        });

        return pageResults;
        });

        results = results.concat(data);
    }

    for (let i = 0; i < results.length; i++) {
        const link = results[i].link;

        if (link) {
        await page.goto(link);

        const productData = await page.evaluate(() => {
          // Extract data from the individual link page
        let title = document.querySelector('h1')?.innerText || null;
        let price = document.querySelector('.Details_item-number-body')?.innerText || null;
        let description = document.querySelector('.Details_description')?.innerText || null;
        let fichetechnique = document.querySelector('.Details_table-list')?.innerText || null;
        let image =
        document.querySelector('.MediaGallery_media-gallery img')?.getAttribute('src') || null;

        return {
            title,
            price,
            description,
            image,
            fichetechnique,
        };
        });

        results[i] = { ...results[i], ...productData }; // Merge the scraped data

        console.log('Scraped:', results[i]);

        // Store the scraped data in the database
        await ScrapedData.create(results[i]);
    }
}

    console.log('All data scraped:', results);

    await browser.close();
} catch (error) {
    console.error(error);
}
}

// Sync the model with the database and then run the scraping process
sequelize.sync().then(() => {
scrapePages();
});
