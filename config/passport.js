const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models/");

passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
        },
        (username, password, done) => {
            db.User.findOne({
                where: {
                    username: username,
                },
            }).then((dbUser) => {
                if (!dbUser) {
                    return done(null, false, {
                        message: "Incorrect username",
                    });
                } else if (!dbUser.validPassword(password)) {
                    return done(null, false, {
                        message: "Incorrect Password",
                    });
                }
                return done(null, dbUser);
            });
        }
    )
);

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

module.exports = passport;
