// Import packages
const express = require("express");
const home = require("./routes/home");
require('dotenv').config(); // Load environment variables
 const productRoutes = require('./routes/productRoutes'); // Import routes
 const bodyParser = require('body-parser');

const cors = require('cors');

const app = express();
// const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(bodyParser.json()); // Middleware to parse JSON bodies

app.use(cors({
    origin: ['http://localhost:3000', 'https://amazon-frontend-dev-wcy6.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://amazon-frontend-dev-wcy6.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  
  
// Middlewares
app.use('/api', productRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the Amazon Product API!');
});

 

// Routes
app.use("/home", home);

// connection
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening to port ${port}`));
