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
    // callback(null, file.originalname.split(' ').join('_'))
    console.log(file);
    const name = file.originalname.split('.')[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  }
  
});

const upload = multer({ storage: storage }).single("image");

const uploadAndCompressImage = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      // Gérer les erreurs de téléchargement
      return next(err);
    }
    
    // Vérifier si une image a été téléchargée
    if (!req.file) {
      return res.status(400).json({ message: "Veuillez sélectionner une image à télécharger." });
    }
    
    // Chemin de l'image téléchargée
    const imagePath = req.file.path;
    
    // Chemin de l'image compressée
    const compressedImagePath = imagePath.replace(/\.\w+$/, '-compressed.webp');
    
    // Compression de l'image avec Sharp
    sharp(imagePath)
      .resize({ width: 800 }) // Redimensionner si nécessaire
      .webp({ quality: 80 }) // Réduire la qualité pour la compression
      .toFile(compressedImagePath, (err) => {
        if (err) {
          return next(err);
        }
        console.log(req)
        console.log(req.file)
        req.compressedImagePath = compressedImagePath;
        next(); // Passer au middleware suivant
      });
  });
};

module.exports = uploadAndCompressImage;