const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');




router.get('/', bookCtrl.getBooks);

router.get('/:id', (bookCtrl.getBook));

router.get('/bestrating', bookCtrl.getBestrating);

router.post('/', bookCtrl.createBook);

router.put('/:id', bookCtrl.updateBook);

router.delete('/:id', bookCtrl.deleteBook);

router.post('/:id/rating', bookCtrl.createRating);




module.exports = router;