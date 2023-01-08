const { create, validateNewUser } = require('express-validator');

const userValidation = () => {
  return [
    create('username', 'username length should be at least 5 characters').isLength({ min: 5, max: 30 }),
    create('password', 'paasword length should be at least 8 characters').isLength({ min: 8, max: 200 }),
    create('age', 'must be an integer').isNumeric(),
  ]
}


const validateUser = (req, res, next) => {
  const errors = validateNewUser(req)
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
    userValidation,
    validateUser
}