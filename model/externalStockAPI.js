const axios = require("axios");
const tokenIEX = process.env.APIKEY; //IEX
const staticArrayStocks = [
  "MSFT",
  "AAPL",
  "AMZN",
  "GOOG",
  "GOOGL",
  "FB",
  "BRK.B",
  "JNJ",
  "V",
  "PG",
  "JPM",
  "UNH",
  "MA",
  "INTC",
  "VZ",
];
// Function to get all stocks from user watchlist
const seeAllstocks = (userSymbols) => {
  return new Promise((resolve, reject) => {
    symbolArray = userSymbols.map((a) => {
      return { symbol: a.symbol };
    });
    symbolArray.forEach((symbol) => {
      axios({
        method: "GET",
        url: `https://cloud.iexapis.com/stable/stock/${symbol.symbol}/quote?token=${tokenIEX}`,
        dataType: "json",
      })
        .then((response) => {
          resolve(response.data.iexClose);
        })
        .catch((err) => reject(err));
    });
  });
};

// Function to get all stocks from user watchlist
const seeAllUserStocks = (userSymbols) => {
  return new Promise((resolve, reject) => {
    symbolArray = userSymbols.map((a) => {
      return { symbol: a.symbol };
    });
    symbolArray.forEach((symbol) => {
      axios({
        method: "GET",
        url: `https://cloud.iexapis.com/stable/stock/${symbol.symbol}/quote?token=${tokenIEX}`,
        dataType: "json",
      })
        .then((response) => {
          resolve({
            value: response.data.iexClose,
            companyName: response.data.companyName,
            evolution: response.data.changePercent,
          });
          console.log(response.data.iexClose);
        })
        .catch((err) => reject(err));
    });
  });
};

// Function to get information about on specific stock
const seeOnestock = (symbolName) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `https://cloud.iexapis.com/stable/stock/${symbolName}/quote?token=${tokenIEX}`,
      dataType: "json",
    })
      .then((response) => {
        resolve({
          value: response.data.iexClose,
          companyName: response.data.companyName,
          evolution: response.data.changePercent,
        });
        console.log(response.data.iexClose);
      })
      .catch((err) => reject(err));
  });
};

const staticStocks = () => {
  return new Promise((resolve, reject) => {
    const arrayRandomStock = [];
    let tempArrPromise = [];
    const randomNumbers = [];
    let i = 0;
    while (i < 6) {
      let random = Math.floor(Math.random() * staticArrayStocks.length);
      if (!randomNumbers.includes(random)) {
        randomNumbers.push(random);
        i++;
      }
    }

    for (let j = 0; j < randomNumbers.length; j++) {
      arrayRandomStock.push(staticArrayStocks[randomNumbers[j]]);
    }
    for (let x = 0; x < arrayRandomStock.length; x++) {
      tempArrPromise.push(
        axios.get(
          `https://cloud.iexapis.com/stable/stock/${arrayRandomStock[x]}/quote?token=${tokenIEX}`
        )
      );
    }
    Promise.all(tempArrPromise)
      .then((responses) => {
        resolve(responses);
      })
      .catch((err) => reject(err));
  });
};

const overallStock = (symbol) => {
  return new Promise((resolve, reject) => {
    const intradayUrl = `https://cloud.iexapis.com/stable/stock/${symbol}/intraday-prices?token=${tokenIEX}`;
    axios
      .get(intradayUrl)
      .then((responseFromAPI) => {
        resolve(responseFromAPI.data);
      })
      .catch((err) => reject(err));
  });
};

module.exports = {
  seeAllstocks,
  seeOnestock,
  staticStocks,
  seeAllUserStocks,
  overallStock,
};
