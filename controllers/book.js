
const Book = require('../models/Book');

exports.getBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.getBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
  .then(book => res.status(200).json(book))
  .catch(error => res.status(404).json({ error }));
};

exports.getBestrating = (req, res, next) => {

}

exports.createBook = (req, res, next) => {
  const book = new Book({
    ...req.body
  });
  book.save()
  .then(
    () => {
        res.status(201).json({
            message: 'Book saved successfully!'
        });
    }
  ).catch(
    (error) => {
        res.status(400).json({
            error: error
        });
    }
  );
}

exports.updateBook = (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Modified!' }))
  .catch(error => res.status(400).json({ error }));
}

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Deleted!' }))
  .catch(error => res.status(400).json({ error }));
}

exports.createRating = (req, res, next) => {
  
}