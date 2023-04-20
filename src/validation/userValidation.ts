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
const verifyEmailSchema = Joi.object({
  email: Joi.string().email().min(3).max(30).required().messages({
    'string.email': 'Email must be a valid email address.',
    'string.min': 'Email must be at least 3 characters long.',
    'string.max': 'Email must be at most 30 characters long.',
    'any.required': 'Email is required.',
  }),
  // code property 4 digit number
  code: Joi.number().integer().min(1000).max(9999).required().messages({
    'number.base': 'Code must be a number.',
    'number.integer': 'Code must be an integer.',
    'number.min': 'Code must be at least 1000.',
    'number.max': 'Code must be at most 9999.',
    'any.required': 'Code is required.',
  }),
});

const verificationEmailSchema = Joi.object({
  email: Joi.string().email().min(3).max(30).required().messages({
    'string.email': 'Email must be a valid email address.',
    'string.min': 'Email must be at least 3 characters long.',
    'string.max': 'Email must be at most 30 characters long.',
    'any.required': 'Email is required.',
  }),
});

const completeRegistrationSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required',
    'string.empty': 'First name cannot be empty',
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required',
    'string.empty': 'Last name cannot be empty',
  }),
  phoneNumber: Joi.string().required().messages({
    'any.required': 'Phone number is required',
    'string.empty': 'Phone number cannot be empty',
  }),
  businessName: Joi.string().required().messages({
    'any.required': 'Business name is required',
    'string.empty': 'Business name cannot be empty',
  }),
  address: Joi.string().required().messages({
    'any.required': 'Address is required',
    'string.empty': 'Address cannot be empty',
  }),
  sector: Joi.string().required().messages({
    'any.required': 'Sector is required',
    'string.empty': 'Sector cannot be empty',
  }),
});
const createPinSchema = Joi.object({
  code: Joi.string().required().length(4).messages({
    'any.required': 'PIN code is required',
    'string.empty': 'PIN code cannot be empty',
    'string.length': 'PIN code must be exactly 4 characters',
  }),
});
const updatePinSchema = Joi.object({
  code: Joi.string().required().length(4).messages({
    'any.required': 'PIN code is required',
    'string.empty': 'PIN code cannot be empty',
    'string.length': 'PIN code must be exactly 4 characters',
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
  verificationEmailValidation: validate(verificationEmailSchema),
  verifyEmailValidation: validate(verifyEmailSchema),
  completeRegistrationValidation: validate(completeRegistrationSchema),
  createPinValidation: validate(createPinSchema),
  updatePinValidation: validate(updatePinSchema),
};
