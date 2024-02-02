const multer = require("multer");
const sharp = require("sharp");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png"
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images/");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  }
  
});

const upload = multer({ storage: storage }).single("image");

const uploadAndCompressImage = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return next(err);
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "Veuillez sélectionner une image à télécharger." });
    }
    
    const imagePath = req.file.path;
    
    const compressedImagePath = imagePath.replace(/\.\w+$/, '-compressed.webp');
    
    sharp(imagePath)
      .resize({ width: 300 })
      .webp({ quality: 80 })
      .toFile(compressedImagePath, (err) => {
        if (err) {
          return next(err);
        }
        req.compressedImagePath = compressedImagePath;
        next();
      });
  });
};

module.exports = uploadAndCompressImage;