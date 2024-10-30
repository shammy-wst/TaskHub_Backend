const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || authHeader === "Bearer null") {
      return res.status(401).json({
        message: "Non autorisé",
        details: "Veuillez vous connecter",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Format d'autorisation invalide",
        details: "Le token doit commencer par 'Bearer '",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token manquant",
        details: "Token non fourni",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          message: "Token invalide",
          details: err.message,
        });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return res.status(500).json({
      message: "Erreur serveur",
      details: "Erreur lors de la vérification du token",
    });
  }
};

module.exports = authenticateToken;
