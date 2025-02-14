const { body, validationResult } = require('express-validator');

const userValidationRules = [
  // Personal Information Validation
  body('firstname')
    .notEmpty().withMessage('First name is required'),
  body('lastname')
    .notEmpty().withMessage('Last name is required'),
  body('gender')
    .isIn(['F', 'H']).withMessage('Gender must be H or F'),
  body('phone1')
    .notEmpty().withMessage('Primary phone number is required'),
  body('phone2')
    .notEmpty().withMessage('Secondary phone number is required'),

  // Address Validation
  body('street')
    .notEmpty().withMessage('Street address is required'),
  body('city')
    .notEmpty().withMessage('City is required'),
  body('postalCode')
    .notEmpty().withMessage('Postal code is required'),
  body('country')
    .notEmpty().withMessage('Country is required'),
  body('state')
    .notEmpty().withMessage('State is required'),

  // Account Validation
  /* body('merchantCode')
    .notEmpty().withMessage('Merchant code is required'), */
     // Account Validation
  body('merchantCode')
  .custom((value, { req }) => {
    if (req.body.type && value) {
      return true; // If type is present, merchantCode can be provided but not required
    }
    if (!req.body.type && !value) {
      throw new Error('Merchant code is required when type is not present');
    }
    return true; // Indicates the value is valid
  }),
  body('username')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  // Biometrics Validation
  body('biometrics')
    .if(body('biometrics').exists())
    .notEmpty().withMessage('Biometric data is required'),
  
  body('biometrics.face_data.data')
    .if(body('biometrics').exists())
    .notEmpty().withMessage('Face data is required'),

  /* body('biometrics.fingers')
    .if(body('biometrics').exists())
    .isArray().withMessage('Finger data must be an array')
    .custom((value) => value.length > 0).withMessage('At least one fingerprint is required'), */

  // Final Validation to Check Errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { userValidationRules };
