// /controllers/productController.js

const ProductModel = require('../models/productModel');
const { scrapeProductData } = require('../scraper/amazonScraper');

 // Handle scraping and inserting product
const scrapeAndInsertProduct = async (req, res) => {
    try {
        const asin = req.body.asin; // Expect ASIN from request body
        const productData = await scrapeProductData(asin); // Scrape product details

        const insertedData = await ProductModel.insertProduct(productData); // Insert data into Supabase
        res.status(200).json({ message: 'Product inserted successfully', data: insertedData });
        console.log('product added successfylly:',insertedData)
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message)
    }
};

// Handle fetching all products
const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.fetchAllProducts(); // Fetch all products from Supabase
        res.status(200).json({ message: 'Products fetched successfully', data: products });
        console.log('Products fetched successfully:',products)
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message)

    }
};

// Get product by ID or ASIN
const getProductByIdOrAsin = async (req, res) => {
    try {
        const { id, asin } = req.body; // Get `id` or `asin` from the request body
        
        if (!id && !asin) {
            console.log('No ID or ASIN provided');
            return res.status(400).json({ error: 'Please provide either an id or asin.' });
        }

        // Call findByIdOrAsin from ProductModel
        const product = await ProductModel.findByIdOrAsin(id, asin);

        if (!product) {
            console.log('Product not found');
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product fetched successfully', data: product });
    } catch (err) {
        console.error('Error fetching product by ID or ASIN:', err.message);
        return res.status(500).json({ error: 'Server error: ' + err.message });
    }
};



 
module.exports = {getProductByIdOrAsin,
    scrapeAndInsertProduct,
    getAllProducts,
};
