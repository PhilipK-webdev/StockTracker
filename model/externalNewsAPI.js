const axios = require("axios");
const apiKey = "01b150ff9ac14903973ea0c91ac8d28a" // NewsAPI

// https://newsapi.org/v2/top-headlines?q=google&apiKey=01b150ff9ac14903973ea0c91ac8d28a

const getTopHeadlines = (companyName) => {
    return new Promise((resolve, reject) => {
        axios({
            method: "GET",
            url: `https://newsapi.org/v2/top-headlines?q=${companyName}&pageSize=1&country=us&apiKey=${apiKey}`,
            dataType: "json"
        })
            .then((articles) => {
                resolve(articles.data)
                console.log(articles.data);
            })
            .catch((err) => reject(err))
    })
}

module.exports = { getTopHeadlines }