const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose
      .connect(process.env.MONGO_URL)
      .then(() => console.log("Connexion à MongoDB réussie !"));
  } catch (error) {
    console.log("Connexion à MongoDB échouée !", process.env.MONGO_URL, error);
  }
};

module.exports = connectDB;
