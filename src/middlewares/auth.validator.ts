import { body } from "express-validator";

export const registerValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("username").isLength({ min: 3 }),
  body("password").isLength({ min: 6 }),
];

export const loginValidator = [
  body("emailOrUsername").notEmpty(),
  body("password").notEmpty(),
];