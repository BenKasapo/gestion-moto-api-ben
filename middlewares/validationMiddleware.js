const { body, validationResult } = require('express-validator');

const userValidationRules = [
  // Personal Information Validation
  body('personal-infos.firstname')
    .notEmpty().withMessage('First name is required'),
  body('personal-infos.lastname')
    .notEmpty().withMessage('Last name is required'),
  body('personal-infos.gender')
    .isIn(['F', 'H']).withMessage('Gender must be H or F'),
  body('personal-infos.phone1')
    .notEmpty().withMessage('Primary phone number is required'),
  body('personal-infos.phone2')
    .notEmpty().withMessage('Secondary phone number is required'),

  // Address Validation
  body('address.street')
    .notEmpty().withMessage('Street address is required'),
  body('address.city')
    .notEmpty().withMessage('City is required'),
  body('address.postalCode')
    .notEmpty().withMessage('Postal code is required'),
  body('address.country')
    .notEmpty().withMessage('Country is required'),
  body('address.state')
    .notEmpty().withMessage('State is required'),

  // Account Validation
  body('account.merchantCode')
    .notEmpty().withMessage('Merchant code is required'),
  body('account.username')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('account.password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  // Biometrics Validation
  body('biometrics')
    .if(body('biometrics').exists())
    .notEmpty().withMessage('Biometric data is required'),
  
  body('biometrics.face_data.data')
    .if(body('biometrics').exists())
    .notEmpty().withMessage('Face data is required'),

  body('biometrics.fingers')
    .if(body('biometrics').exists())
    .isArray().withMessage('Finger data must be an array')
    .custom((value) => value.length > 0).withMessage('At least one fingerprint is required'),

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
