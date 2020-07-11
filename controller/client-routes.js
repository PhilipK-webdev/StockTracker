const express = require("express");
const router = express.Router();
const path = require("path");


// Client-route to access index page
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/client/index.html"))
})

// Client-route to access personal page
router.get("/mystocks", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/client/mystocks.html"))
})

// Client-route to access a specific stock information
router.get("/stockinfo", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/client/stockinfo.html"))
})

module.exports = router;
