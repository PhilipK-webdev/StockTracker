const axios = require("axios");
const tokenIEX = "pk_723f0373466e46fa8549c7f632ef69f1" //IEX


// Function to get URL to a company logo
const getCompanyLogo = (symbolName) => {
    return new Promise((resolve, reject) => {
        axios({
            method: "GET",
            url: `https://cloud.iexapis.com/stable/stock/${symbolName}/logo/quote?token=${tokenIEX}`,
            dataType: "json"
        })
            .then((logo) => {
                resolve(logo.data);
            })
            .catch((err) => reject(err))
    })

}

module.exports = { getCompanyLogo }