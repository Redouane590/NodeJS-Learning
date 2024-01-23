const Book = require("../models/Book");
const fs = require("fs");

exports.getBestrating = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.send(books);
  } catch (error) {
    console.error("Erreur lors de la récupération des livres :", error);
    res.status(500).send({ error: "Erreur lors de la récupération des livres." });
  }
};

exports.getBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.createBook = (req, res) => {
  const book = JSON.parse(req.body.book);
  delete book._id;
  delete book.userId;
  console.log(book);
  console.log(req.auth);
  console.log(`${req.protocol}://${req.get('host')}/images/${req.file.filename}`);
  try {
    const newBook = new Book({
      ...book,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    newBook.save();
    res.send(newBook);
  } catch (error) {
    console.error(error);
  }
};

exports.updateBook = (req, res, next) => {
  const bookObj = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  delete bookObj.userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      } else {
      Book.updateOne({ _id: req.params.id }, { ...bookObj, _id: req.params.id })
        .then(() => res.status(200).json({ message: "book Modified!" }))
        .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "book Deleted!" }))
          .catch((error) => res.status(400).json({ error }));
      }
      )}
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.createRating = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      console.log(book.ratings);
      const newRating = {
        userId: req.auth.userId,
        grade: req.body.rating,
      };
      console.log(newRating);

      if (book.ratings.find((ratings) => ratings.userId === req.auth.userId)) {
        return res.status(400).json({ error: "Vous avez déjà noté ce livre." });
      } else {
        book.ratings.push(newRating);
        let sumRating = 0;
        book.ratings.forEach((rating) => {
          sumRating += rating.grade;
        });
        book.averageRating = sumRating / book.ratings.length;
        book.save();
        return res.status(201).json(book);
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
