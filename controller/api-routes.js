const express = require("express");
const router = express.Router();

// Route to get all stocks from user watchlist
router.get("/api", (req, res) => {
    seeAllstocks()
        .then((allStocks) => res.json(allStocks))
        .catch((err) => res.send(err))
})

// Route to get a single stock information
router.get("/api/find:symbol", (req, res) => {
    const symbol = req.params.symbol
    showStock(symbol)
        .then((stockSymbol) => res.json(stockSymbol))
        .catch((err) => res.send(err))
})

// Route to delete stock from watchlist
router.get("/api/delete:symbol", (req, res) => {
    const symbol = req.params.symbol
    deleteStock(symbol)
        .then((stockSymbol) => res.json(stockSymbol))
        .catch((err) => res.send(err))
})

module.exports = router;
