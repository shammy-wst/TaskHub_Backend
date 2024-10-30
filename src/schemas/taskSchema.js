const Joi = require("joi");

const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.base": "Le titre doit être une chaîne de caractères",
    "string.empty": "Le titre est requis",
    "string.min": "Le titre doit contenir au moins {#limit} caractères",
    "string.max": "Le titre ne doit pas dépasser {#limit} caractères",
    "any.required": "Le titre est requis",
  }),

  description: Joi.string().min(10).max(1000).required().messages({
    "string.base": "La description doit être une chaîne de caractères",
    "string.empty": "La description est requise",
    "string.min": "La description doit contenir au moins {#limit} caractères",
    "string.max": "La description ne doit pas dépasser {#limit} caractères",
    "any.required": "La description est requise",
  }),

  status: Joi.string()
    .valid("en_cours", "terminé", "en_attente")
    .required()
    .messages({
      "string.base": "Le status doit être une chaîne de caractères",
      "string.empty": "Le status est requis",
      "any.only":
        "Le status doit être l'un des suivants : en_cours, terminé, en_attente",
      "any.required": "Le status est requis",
    }),
});

module.exports = taskSchema;
