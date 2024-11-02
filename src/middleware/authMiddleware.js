const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      logger.debug("Tentative d'accès sans token");
      return res
        .status(401)
        .json({ message: "Token d'authentification manquant" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        logger.debug("Token invalide ou expiré", { error: err.message });
        return res.status(403).json({ message: "Token invalide ou expiré" });
      }

      req.user = user;
      logger.debug("Utilisateur authentifié", { userId: user.id });
      next();
    });
  } catch (error) {
    logger.error("Erreur d'authentification:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'authentification" });
  }
};

module.exports = authenticateToken;
