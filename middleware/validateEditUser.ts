import { check, validationResult } from 'express-validator';

exports.validateEditUser = [
  check('firstName').trim().escape().not().isEmpty().withMessage('First name can not be empty!').bail().isLength({ min: 3 })
    .withMessage('Minimum 3 characters required!')
    .bail(),
  check('lastName').trim().escape().not().isEmpty().withMessage('Last name can not be empty!').bail().isLength({ min: 3 })
    .withMessage('Minimum 3 characters required!')
    .bail(),
  check('age').trim().escape().not().isEmpty().withMessage('age can not be empty!').bail().isLength({ min: 2 })
    .withMessage('Minimum 2 digits required!')
    .bail(),
  check('password').trim().escape().not().isEmpty().withMessage('password field can not be empty!').bail().isLength({ min: 8 })
    .withMessage('Minimum 8 characters required!')
    .bail().matches(/\d/)
    .withMessage('Password must contain at least one number').bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
