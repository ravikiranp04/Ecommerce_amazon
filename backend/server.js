const exp = require('express');
const app = exp();
const userApp = require('./APIs/userapi');
const adminApp = require('./APIs/adminapi');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Define CORS options
/*const corsOptions = {
  origin: 'https://ecommerce1-bgef.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};*/
//app.use(cors({ origin: 'http://localhost:5300' }));

// Use the CORS middleware with the options defined
//app.use(cors(corsOptions));

// Body parser middleware
app.use(exp.json());

// Assign HTTP requests to specific routes
app.use('/user-api', userApp);
app.use('/admin-api', adminApp);

// Optionally serve React build files
 app.use(exp.static(path.join(__dirname, '../frontend/build')));

// Connecting to MongoDB server
const mongoClient = require('mongodb').MongoClient;
mongoClient.connect(process.env.DB_URL)
  .then(client => {
    // Database object
    const commerceDB = client.db('ecommerce');
    
    // Create collection objects
    const usersObj = commerceDB.collection('users');
    const productsObj = commerceDB.collection('products');
    const cartWishSave = commerceDB.collection('cartWishSave');
    const productsSold = commerceDB.collection('productsSold');
    // Share collections with APIs
    app.set('usersObj', usersObj);
    app.set('productsObj', productsObj);
    app.set('cartWishSave', cartWishSave);
    app.set('productsSold',productsSold);
  })
  .catch(err => console.error('Failed to connect to the database', err));

// Error Handler
app.use((err, req, res, next) => {
  res.send({ status: "Error", message: err.message });
});

const port = process.env.PORT || 5300;
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
