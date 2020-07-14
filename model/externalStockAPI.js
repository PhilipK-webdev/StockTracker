const axios = require("axios");
const tokenIEX = "pk_723f0373466e46fa8549c7f632ef69f1" //IEX

// Function to get all stocks from user watchlist
const seeAllstocks = (userSymbols) => {

    return new Promise((resolve, reject) => {
        symbolArray = userSymbols.map(a => { return { symbol: a.symbol } })
        symbolArray.forEach((symbol) => {
            axios({
                method: "GET",
                url: `https://cloud.iexapis.com/stable/stock/${symbol.symbol}/quote?token=${tokenIEX}`,
                dataType: "json"
            })
                .then((response) => {
                    resolve(response.data.iexClose)
                    console.log(response.data.iexClose);
                })
                .catch((err) => reject(err))
        });
    })
}

// Function to get information about on specific stock
const seeOnestock = (symbolName) => {
    return new Promise((resolve, reject) => {
        axios({
            method: "GET",
            url: `https://cloud.iexapis.com/stable/stock/${symbolName}/quote?token=${tokenIEX}`,
            dataType: "json"
        })
            .then((response) => {
                resolve(response.data.iexClose)
                console.log(response.data.iexClose);
            })
            .catch((err) => reject(err))
    })

}


module.exports = { seeAllstocks, seeOnestock }