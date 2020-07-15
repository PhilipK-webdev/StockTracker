const axios = require("axios");
const tokenIEX = process.env.APIKEY; //IEX
const staticArrayStocks = [
    "MSFT", "AAPL", "AMZN", "GOOG", "GOOGL", "FB", "BRK.B", "JNJ", "V", "PG", "JPM", "UNH", "MA", "INTC", "VZ"];
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

// const staticStocks = () => {

//     const arrayRandomStock = [];
//     const tempArr = [];
//     for (let i = 0; i < 6; i++) {

//         let random = Math.floor((Math.random() * staticArrayStocks.length));
//         arrayRandomStock.push(staticArrayStocks[random]);

//     }
//     arrayRandomStock.forEach((symbol) => {
//         axios({
//             method: "GET",
//             url: `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${tokenIEX}`,
//             dataType: "json"
//         }).then(res => {
//             tempArr.push(res.data);
//             console.log(tempArr);
//         }).catch(err => console.log(err));
//     });

//     return tempArr;
// }

module.exports = { seeAllstocks, seeOnestock }