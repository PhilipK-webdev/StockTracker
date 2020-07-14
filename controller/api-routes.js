const express = require("express");
const router = express.Router();
const db = require("../models");
const passport = require("../config/passport");
const axios = require("axios");
const { seeAllstocks, seeOnestock } = require("../model/externalStockAPI")
const { getCompanyLogo } = require("../model/externalLogoAPI");
const { getTopHeadlines } = require("../model/externalNewsAPI");

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

// STOCKS API

// Route to get all stocks from user watchlist --> We only get the closing value out of this api, but it is possible to resolve the entire stock information

// example GET : http://localhost:3000/api/external
router.get("/api/external", (req, res) => {
    seeAllstocks(userStocks)
        .then((stocksValue) => res.json({ stocksValue }))
        .catch((err) => res.send(err))
});

// Route to get a single stock information
// example GET : http://localhost:3000/api/external/stocks/MSFT

router.get("/api/external/stocks/:symbol", (req, res) => {
    const symbol = req.params.symbol;
    seeOnestock(symbol)
        .then((stockValue) => res.json({ stockValue }))
        .catch((err) => res.send(err))
});

// Route to add stock in user's watchlist
// example POST : http://localhost:3000/api/users/hedical/stocks/MSFT
router.post("/api/users/:username/stocks/:symbol", (req, res) => {
    db.Stock.addStock(req.params.username, req.params.symbol, "cpName", 1, 2)
        .then(() => res.send({ msg: "successfully added" }))
        .catch((err) => res.send(err))
});


// Route to delete stock from watchlist
// example DELETE : http://localhost:3000/api/users/hedical/stocks/MSFT
router.delete("/api/users/:username/stocks/:symbol", (req, res) => {
    db.Stock.deleteStock(req.params.username, req.params.symbol)
        .then(() => res.send({ msg: "successfully deleted" }))
        .catch((err) => res.send(err))
});

// NEWS API
// example GET : http://localhost:3000/api/news/apple
router.get("/api/news/:company", (req, res) => {
    const companyName = req.params.company;
    getTopHeadlines(companyName)
        .then((articles) => res.json({ articles }))
        .catch((err) => res.send(err))
})

// LOGO API

// example GET : http://localhost:3000/api/logo/AAPL
router.get("/api/logo/:symbol", (req, res) => {
    const symbol = req.params.symbol;
    getCompanyLogo(symbol)
        .then((companyLogo) => res.json({ companyLogo }))
        .catch((err) => res.send(err))
})

// USER ROUTES

// Route for login
router.post("/api/login", passport.authenticate("local"), (req, res) => { // to modify
    res.json({ username: req.user.username, id: req.user.id });
});

<<<<<<< HEAD
router.post("/api/register", (req, res) => {
    db.User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    }).then(() => {
        res.json({ msg: "success" });
    }).catch((err) => res.status(401).json(err));

=======
// Route for register
router.post("/api/register", (req, res) => { // to modify
    db.User.create({ email: req.body.email, password: req.body.password, first_name: req.body })
        .then(() => {
            res.json({ msg: "success" });
            res.redirect(307, "/api/login");
        })
        .catch((err) => res.status(401).json(err));
>>>>>>> 956439679d3eeee1f34d3d9231c9628c48f5496e
});


// Route for logout
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

// Route for user info
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