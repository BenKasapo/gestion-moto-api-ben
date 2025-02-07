const { body ,validationResult} = require('express-validator');

const userValidationRules = [
    body('firstname').notEmpty().withMessage('First name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
    body('gender').isIn(['F', 'H']).withMessage('Gender must be H or F'),
    body('email')
    .notEmpty().withMessage('Email address is required')
    .bail()
    .isEmail().withMessage('Invalid email address'),
  
    body('phone1').notEmpty().withMessage('Primary phone number is required'),
    body('phone2').notEmpty().withMessage('Secondary phone number is required'),
    body('street').notEmpty().withMessage('Street address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('postalCode').notEmpty().withMessage('Postal code is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('use').isIn(['individual', 'business','admin']).withMessage('Use must be individual,business or admin'),
    body('businessProfile')
        .if(body('use').equals('business')).notEmpty().withMessage('business profile is required for business use')
        .if(body('use').equals('individual')).isEmpty().withMessage('business profile should not be provided for individual use')
        .if(body('use').equals('admin')).isEmpty().withMessage('business profile should not be provided for admin use'),
    body('businessProfile.activityName').if(body('use').equals('business')).notEmpty().withMessage('Activity name is required for business use'),
    body('businessProfile.registration').if(body('use').equals('business')).notEmpty().withMessage('Registration number is required for business use'),
    body('businessProfile.sector').if(body('use').equals('business')).notEmpty().withMessage('Sector is required for business use'),
    body('businessProfile.activitySize').if(body('use').equals('business')).notEmpty().withMessage('Activity size is required for Business use'),
    body('businessProfile.businessPhone1').if(body('use').equals('business')).notEmpty().withMessage('Business phone 1 is required for Business use'),
    body('businessProfile.businessStreet').if(body('use').equals('business')).notEmpty().withMessage('Business street is required for Business use'),
    body('businessProfile.businessCountry').if(body('use').equals('business')).notEmpty().withMessage('Business country is required for Business use'),
    body('businessProfile.businessState').if(body('use').equals('business')).notEmpty().withMessage('Business state is required for Business use'),
    body('businessProfile.businessCity').if(body('use').equals('business')).notEmpty().withMessage('Business city is required for Business use'),
    body('businessProfile.merchantCode').if(body('use').equals('business')).notEmpty().withMessage('Merchant code is required for Business use'),
    body('biometrics')
    .if(body('use').custom((value) => value === 'individual' || value === 'business'))
    .notEmpty().withMessage('Biometric data is required'),

    body('biometrics.face_data.data')
    .if(body('use').custom((value) => value === 'individual' || value === 'business'))
    .notEmpty().withMessage('Face data is required'),

    body('biometrics')
    .if(body('use').equals('admin'))
    .isEmpty().withMessage('Biometrics should not be provided for admin use'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
    },

  ];
  
  module.exports = { userValidationRules }; 