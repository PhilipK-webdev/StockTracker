const express = require("express");
const router = express.Router();
const db = require("../models");
const passport = require("../config/passport");
// Route to get all stocks from user watchlist
router.get("/api", (req, res) => {


});

// Route to get a single stock information
router.get("/api/find/:symbol", (req, res) => {
    const symbol = req.params.symbol
    showStock(symbol)
        .then((stockSymbol) => res.json(stockSymbol))
        .catch((err) => res.send(err))
});

// Route to delete stock from watchlist
router.get("/api/delete/:symbol", (req, res) => {
    const symbol = req.params.symbol;
    deleteStock(symbol)
        .then((stockSymbol) => res.json(stockSymbol))
        .catch((err) => res.send(err));
});

// User Routes:
router.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json({ username: req.user.username, id: req.user.id });
});

router.post("/api/register", (req, res) => {
    db.User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    }).then(() => {
        res.json({ msg: "success" });
        res.redirect(307, "/api/login");
    }).catch((err) => res.status(401).json(err));

});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});





// Possible route for our portfolio
router.get("/api/user_data", (req, res) => {
    !req.user
        ? res.json({})
        : res.json({
            email: req.user.email,
            id: req.user.id,
        });
});

module.exports = router;
