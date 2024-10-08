    // /routes/productRoutes.js

    const express = require('express');
    const { scrapeAndInsertProduct, getAllProducts } = require('../controllers/productController');
    const { getProductByIdOrAsin } = require('../controllers/productController');

    const router = express.Router();
    router.post('/get-product', getProductByIdOrAsin);

    // POST route to scrape and insert product
    router.post('/scrape-product', scrapeAndInsertProduct);

    // GET route to fetch all products
    router.get('/products', getAllProducts);

    module.exports = router;
