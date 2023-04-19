import Joi from 'joi';
import validate from './validate';

const loginSchema = Joi.object({
  email: Joi.string().email().min(3).max(30).required().messages({
    'string.email': 'Email must be a valid email address.',
    'string.min': 'Email must be at least 3 characters long.',
    'string.max': 'Email must be at most 30 characters long.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Password must have at least 8 characters, including lower case, upper case, number, and special character.',
    }),
});

export default {
  loginValidation: validate(loginSchema),
};
