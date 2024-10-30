const Joi = require("joi");

const taskSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "Le titre doit être un texte.",
    "string.empty": "Le titre ne peut pas être vide.",
    "any.required": "Le titre est requis.",
  }),
  description: Joi.string().required().messages({
    "string.base": "La description doit être un texte.",
    "string.empty": "La description ne peut pas être vide.",
    "any.required": "La description est requise.",
  }),
  status: Joi.string()
    .valid("en_cours", "terminé", "en_attente")
    .required()
    .messages({
      "string.base": "Le status doit être une chaîne de caractères",
      "any.only":
        "Le status doit être l'un des suivants : en_cours, terminé, en_attente",
      "any.required": "Le status est requis",
    }),
});

module.exports = { taskSchema };
