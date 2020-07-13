const express = require("express");
const router = express.Router();
const db = require("../models");
const passport = require("../config/passport");
const axios = require("axios");
const { seeAllstocks, seeOnestock } = require("../model/externalStockAPI")
// const APIkey = "FQJSY871UTA3P2BK" // Alpha Vintage no longer used
const tokenIEX = "pk_723f0373466e46fa8549c7f632ef69f1" //IEX


// https://cloud.iexapis.com/
// https://sandbox.iexapis.com/stable/stock/AAPL/quote?token=Tpk_f63c19d19f524943b1e79eb433ad1130
// https://cloud.iexapis.com/stable/stock/AAPL/quote?token=pk_723f0373466e46fa8549c7f632ef69f1

// Test object

const userStocks = [
    {
        symbol: "AAPL",
        company_name: "Apple",
        initial_value: 330.61,
        last_value: 333.68,
        shares: 4
    },
    {
        symbol: "IBM",
        company_name: "IBM",
        initial_value: 110.37,
        last_value: 118.35,
        shares: 7
    },
]

// Route to get all stocks from user watchlist
// example GET : http://localhost:3000/api/external
router.get("/api/external", (req, res) => {
    seeAllstocks(userStocks)
        .then((resp) => res.json({ resp }))
        .catch((err) => res.send(err))
});


// Route to get a single stock information
// example GET : http://localhost:3000/api/external/stocks/MSFT

router.get("/api/external/stocks/:symbol", (req, res) => {
    const symbol = req.params.symbol;
    seeOnestock(symbol)
        .then((resp) => res.json({ resp }))
        .catch((err) => res.send(err))
});

// Route to delete stock from watchlist
// example DELETE : http://localhost:3000/api/users/hedical/stocks/MSFT
router.delete("/api/users/:user_id/stocks/:symbol", (req, res) => {
    db.Stock.destroy({
        where: {
            symbol: req.params.symbol
        },
        include: []
    })
});


// Route for user
router.post("/api/login", passport.authenticate("local"), (req, res) => { // to modify
    res.json({ username: req.user.username, id: req.user.id });
});

router.post("/api/register", (req, res) => { // to modify
    db.User.create({ email: req.body.email, password: req.body.password, first_name: req.body })
        .then(() => {
            res.redirect(307, "/api/login");
        })
        .catch((err) => res.status(401).json(err));
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.get("/api/user_data", (req, res) => { // to modify
    !req.user
        ? res.json({})
        : res.json({
            email: req.user.email,
            id: req.user.id,
            // stocks: 
        });
});

module.exports = router;