const express = require("express");
const router = express.Router();
const path = require("path");
const isAuthenticated = require("../config/middleware/isAuthenticated");

router.get("/", (req, res) => {
    if (req.user) {
        res.redirect("/dashbord");
    }
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

router.get("/login", (req, res) => {
    if (req.user) {
        res.redirect("/dashbord");
    }
    res.sendFile(path.join(__dirname, "../client/login.html"));
});

router.get("/dashbord", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dashbord.html"));
});

module.exports = router;
