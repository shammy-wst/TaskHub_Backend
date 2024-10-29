const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Accès refusé : Token manquant" });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error(
      "JWT_SECRET n'est pas défini dans les variables d'environnement"
    );
    return res
      .status(500)
      .json({ message: "Erreur de configuration du serveur" });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalide" });
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
