const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/book");
const auth = require("../middleware/auth");
const uploadAndCompressImage = require('../middleware/multer-config');


router.get("/bestrating", bookCtrl.getBestrating);

router.post("/:id/rating", auth, bookCtrl.createRating);

router.get("/", bookCtrl.getBooks);

router.get("/:id", bookCtrl.getBook);

router.post("/", auth, uploadAndCompressImage, bookCtrl.createBook);

router.put("/:id", auth, uploadAndCompressImage, bookCtrl.updateBook);

router.delete("/:id", auth, bookCtrl.deleteBook);


module.exports = router;
