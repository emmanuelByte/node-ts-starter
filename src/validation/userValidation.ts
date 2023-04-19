import Joi from "joi";
import validate from "./validate";

const UserLoginSchema = Joi.object({
  email: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

export default {
  UserLoginValidation: validate(UserLoginSchema),
};
