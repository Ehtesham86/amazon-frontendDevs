// /scraper/amazonScraper.js

// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-core');

// Function to scrape product data
const scrapeProductData = async (asin) => {
    const browser = await puppeteer.launch({
        headless: true,
        channel: 'chrome', // Specify the channel to use
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
      });
    
    const page = await browser.newPage();

    // Set a custom user-agent to make it look like a real browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

    const url = `https://www.amazon.com/dp/${asin}`;

    try {
        // Set navigation timeout and load the page
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }); // 60 seconds timeout

        // Extract product data
        const productData = await page.evaluate(() => {
            const getElementText = (selector) => {
                const element = document.querySelector(selector);
                return element ? element.innerText.trim() : null;
            };

            const getElementValue = (selector) => {
                const element = document.querySelector(selector);
                return element ? element.value : null;
            };

            const asin = window.location.href.split('/dp/')[1]?.split('/')[0];
            const title = getElementText('#productTitle');
            const priceText = getElementText('.a-price .a-offscreen');
            const price = priceText ? parseFloat(priceText.replace(/[^0-9.-]+/g, '')) : null; // Remove "$" and convert to number
            const images = Array.from(document.querySelectorAll('#altImages img')).map(img => img.src);

            return {
                asin,
                adid: getElementValue('#adId'),
                sku: getElementValue('#sku'),
                merchantcustomerid: getElementValue('#merchantCustomerID'),
                merchantname: getElementText('#merchantName'),
                price,
                title,
                images,
            };
        });

        await browser.close();
        return productData; // Return the extracted product data
    } catch (error) {
        console.error('Error navigating to the page or scraping:', error);
        await browser.close();
        throw new Error('Failed to scrape product data');
    }
};

module.exports = { scrapeProductData };
