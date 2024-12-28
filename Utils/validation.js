const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string()
    .pattern(/^\+\d{10,15}$/)
    .required(),
  password: Joi.string().min(8).required(),
});
const updateSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string()
    .pattern(/^\+\d{10,15}$/)
    .required(),
});
const validateRegistration = (req, res, next) => {
  const { name, email, phoneNumber, password } = req.body;
  if (!email || !phoneNumber || !password || !name) {
    const error = new Error("Missing required fields");
    error.status = 400;
    throw error;
  }
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateUpdate = (req, res, next) => {
  const { name, email, phoneNumber } = req.body;
  if (!email || !phoneNumber || !name) {
    const error = new Error("Missing required fields");
    error.status = 400;
    throw error;
  }
  const { error } = updateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = { validateRegistration, validateUpdate };
