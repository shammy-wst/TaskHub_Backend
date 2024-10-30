const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Route de test pour générer un token
router.post("/login", (req, res) => {
  try {
    // Vérifiez que JWT_SECRET existe
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET manquant");
      return res.status(500).json({
        message: "Erreur de configuration du serveur",
      });
    }

    // Créer un token de test
    const token = jwt.sign({ id: 1, role: "user" }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log("Token généré avec succès");
    console.log(
      "JWT_SECRET utilisé:",
      process.env.JWT_SECRET.substring(0, 3) + "..."
    );
    console.log("Token:", token);

    return res.status(200).json({
      token,
      message: "Connexion réussie",
    });
  } catch (error) {
    console.error("Erreur lors de la génération du token:", error);
    return res.status(500).json({
      message: "Erreur lors de la connexion",
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

module.exports = router;
