const { check, validate } = require('express-validator');

const validateRules = () => {
    [
    check('firstName').not().isEmpty().isLength({ min: 8 }).withMessage('firstName must be at least 8 characters long'),
    check('lastName').not().isEmpty().isLength({ min: 8 }).withMessage('firstName must be at least 8 characters long'),
    check('age').isNumeric(),
    check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    ]
}


const validateUser = (req, res, next) => {
    const errors = validate(req)
    if (errors.isEmpty()) {
      return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  
    return res.status(422).json({
      errors: extractedErrors,
    })
  }
  
  module.exports = {
      validateRules,
      validateUser
  }


  
  