const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');


mongoose.connect("mongodb+srv://redouane59:mLSqPftyFKsyQnzv@cluster.yiwcf1t.mongodb.net/",
  { useNewUrlParser: true,
    useUnifiedTopology: true }).then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);
 

module.exports = app;



// POST /api/auth/signup 
// POST /api/auth/login
// GET /api/books
// GET /api/books/:id
// GET /api/books/bestrating
// POST /api/books
// PUT /api/books/:id
// DELETE /api/books/:id
// POST /api/books/:id/rating