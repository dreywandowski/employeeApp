"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.validateUser = [
    (0, express_validator_1.check)('firstName').trim().escape().not().isEmpty().withMessage('First name can not be empty!').bail().isLength({ min: 3 })
        .withMessage('Minimum 3 characters required!')
        .bail(),
    (0, express_validator_1.check)('lastName').trim().escape().not().isEmpty().withMessage('Last name can not be empty!').bail().isLength({ min: 3 })
        .withMessage('Minimum 3 characters required!')
        .bail(),
    (0, express_validator_1.check)('username').trim().escape().not().isEmpty().withMessage('Username name can not be empty!').bail().isLength({ min: 8 })
        .withMessage('Minimum 8 characters required!')
        .bail(),
    (0, express_validator_1.check)('age').trim().escape().not().isEmpty().withMessage('age can not be empty!').bail().isLength({ min: 2 })
        .withMessage('Minimum 2 digits required!')
        .bail(),
    (0, express_validator_1.check)('password').trim().escape().not().isEmpty().withMessage('password field can not be empty!').bail().isLength({ min: 8 })
        .withMessage('Minimum 8 characters required!')
        .bail().matches(/\d/)
        .withMessage('Password must contain at least one number').bail(),
    (0, express_validator_1.check)('email').trim().normalizeEmail().not().isEmpty().withMessage('Invalid email address!').bail(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    },
];
//# sourceMappingURL=validateNewUser.js.map