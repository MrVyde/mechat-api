import { body } from "express-validator";

export const updateProfileValidator = [
  body("displayName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Display name must be between 2 and 50 characters."
    ),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage(
      "Bio must be at most 160 characters."
    ),
];