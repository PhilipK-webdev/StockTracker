const axios = require("axios");
const apiKey = "01b150ff9ac14903973ea0c91ac8d28a"  // NewsAPI
// b8a67989b17944e2bf1782fa77bd7b92
// original : 01b150ff9ac14903973ea0c91ac8d28a

// https://newsapi.org/v2/top-headlines?q=google&apiKey=01b150ff9ac14903973ea0c91ac8d28a

const getTopHeadlines = (companyName) => {
    return new Promise((resolve, reject) => {
        axios({
            method: "GET",
            url: `https://newsapi.org/v2/top-headlines?q=${companyName}&apiKey=${apiKey}`,
            dataType: "json"
        })
            .then((articles) => {
                resolve(articles.data);

            })
            .catch((err) => reject(err))
    });
}

module.exports = { getTopHeadlines }