const Joi = require("joi");

// Schéma de validation pour une tâche
const taskSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "Le titre doit être un texte.",
    "string.empty": "Le titre ne peut pas être vide.",
    "any.required": "Le titre est requis.",
  }),
  description: Joi.string().allow("").messages({
    "string.base": "La description doit être un texte.",
  }),
  completed: Joi.boolean().required().messages({
    "boolean.base": "Le statut doit être de type booléen.",
    "any.required": "Le statut est requis.",
  }),
});

module.exports = { taskSchema };
