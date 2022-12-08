const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
  requireEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error("Email in use");
      }
    }),

  requirePassword: check("password")
    .trim()
    .isLength({ min: 5, max: 25 })
    .withMessage("Must be between 5 and 25 characters"),

  requirePasswordConfirmation: check("passwordConfirmation")
    .trim()
    .isLength({ min: 5, max: 25 })
    .withMessage("Must be between 5 and 25 characters")
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error("Passwords do not match");
      }
    }),

  requireSigninEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Enter valid email")
    .custom(async (email) => {
      const user = await usersRepo.getOneBy({ email });
      if (!user) {
        throw new Error("Email not found!");
      }
    }),

  requireSigninPassword: check("password")
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersRepo.getOneBy({ email: req.body.email });

      if (!user) {
        throw new Error("Invalid password");
      }
      const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
      );

      if (!validPassword) {
        throw new Error("Invalid password");
      }
    }),

  requireProduct: check("product").trim().isLength({ min: 5, max: 25 }),
  requirePrice: check('price').trim().toFloat().isFloat({min: 1})
};
