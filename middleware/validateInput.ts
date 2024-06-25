const { check, validationResult } = require('express-validator');

const userValidationRules = () => {
  const words = ['created', 'requested'];
  return [
    //check('username', 'username length should be at least 5 characters').isLength({ min: 5, max: 30 }),
    check('purpose', 'purpose length should be at least 10 characters').isLength({ min: 10, max: 200 }),
    check('type', 'type should contains 10 digits')
      .isLength({ min: 5, max: 20 }),
    check('status', "status must contain 'created' or 'requested'")
      .exists()
      .isIn(words),
    // .isLength({ min: 5}),
    check('date_from', 'must be a valid date')
      .isDate(),
    check('date_to', 'must be a valid date')
      .isDate()
  ]
}


const validate = (req, res, next) => {
  const errors = validationResult(req)
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
  userValidationRules,
  validate,
}