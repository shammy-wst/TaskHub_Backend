const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const bcrypt = require("bcryptjs");

// Route d'inscription
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({
        message: "Ce nom d'utilisateur est déjà pris",
      });
    }

    // Création du nouvel utilisateur
    const user = await User.create({
      username,
      password, // Le hash est géré par le hook beforeCreate
    });

    // Génération du token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      token,
      message: "Compte créé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return res.status(500).json({
      message: "Erreur lors de la création du compte",
      error: error.message,
    });
  }
});

// Route pour vérifier si un token est valide
router.post("/verify", (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token manquant",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Token invalide",
          error: err.message,
        });
      }

      return res.status(200).json({
        valid: true,
        decoded,
      });
    });
  } catch (error) {
    console.error("Erreur de vérification:", error);
    return res.status(500).json({
      message: "Erreur lors de la vérification",
      error: error.message,
    });
  }
});

// Route pour se connecter
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect username or password",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Incorrect username or password",
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      token,
      message: "Connexion réussie",
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return res.status(500).json({
      message: "Erreur lors de la connexion",
      error: error.message,
    });
  }
});

module.exports = router;
