import Joi from "joi";

const schemaSignIn = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(7).max(30).required(),
});

const schemaSignUp = Joi.object({
  name: Joi.string()
    .min(5)
    .max(30)
    .pattern(/^[a-zA-Z\s]+$/)
    .message("name can only contain letters and spaces")
    .required(),
  username: Joi.string()
    .min(5)
    .max(30)
    .pattern(/^[a-zA-Z\s]+$/)
    .message("username can only contain letters and spaces")
    .required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string().min(7).max(30).required(),
});

const schemaChangePassword = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  newPassword: Joi.string().min(7).max(30).required(),
});

export default { schemaSignIn, schemaSignUp, schemaChangePassword };
