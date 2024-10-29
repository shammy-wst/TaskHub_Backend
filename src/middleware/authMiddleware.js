const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extraction du token

  if (!token) {
    return res.status(401).json({ message: "Accès refusé : Token manquant" });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("La variable d'environnement JWT_SECRET n'est pas définie");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalide" });
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
