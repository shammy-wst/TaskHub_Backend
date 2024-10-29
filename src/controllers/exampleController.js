// exampleControllers.js

exports.exampleHandler = (req, res) => {
  res.json({ message: "API opérationnelle !" });
};

// Exemple d'une autre route pour tester une réponse personnalisée
exports.customMessage = (req, res) => {
  const name = req.query.name || "inconnu";
  res.json({ message: `Bonjour, ${name}! Bienvenue sur l'API.` });
};
