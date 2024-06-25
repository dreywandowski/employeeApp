"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const userValidationRules = () => {
    const words = ['created', 'requested'];
    return [
        (0, express_validator_1.check)('purpose', 'purpose length should be at least 10 characters').isLength({ min: 10, max: 200 }),
        (0, express_validator_1.check)('type', 'type should contains 10 digits')
            .isLength({ min: 5, max: 20 }),
        (0, express_validator_1.check)('status', "status must contain 'created' or 'requested'")
            .exists()
            .isIn(words),
        (0, express_validator_1.check)('date_from', 'must be a valid date')
            .isDate(),
        (0, express_validator_1.check)('date_to', 'must be a valid date')
            .isDate()
    ];
};
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
    return res.status(422).json({
        errors: extractedErrors,
    });
};
module.exports = {
    userValidationRules,
    validate,
};
//# sourceMappingURL=validateInput.js.map