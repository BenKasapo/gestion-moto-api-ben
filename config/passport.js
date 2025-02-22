const bcrypt = require('bcrypt');
const { findUserByMailOrPhone } = require('../database/requests');
const local = require('passport-local');


const LocalStrategy = new local.Strategy(
    { usernameField : "identifier", passwordField : "password" },
    async (identifier, password, done) => {
        try {
            // Recherche de l'utilisateur par email ou téléphone
            const user = await findUserByMailOrPhone(identifier);
            if (!user ) {
                return done(null, false, { message: "User not found" });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return done(null, false, err);
                }
                if (!isMatch) {
                    return done(null, false, { message : "Password incorrect" })
                }
                return done(null, user)
            })
        } catch (error) {
            res.status(500).send("Error")
        }
    }
)

module.exports = LocalStrategy