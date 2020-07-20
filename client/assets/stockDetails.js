$(document).ready(function () {
  setInterval(function () {
    $("#currentDate").text(moment().format("LL HH:mm:ss"));
  }, 1000);

  const urlParams = new URLSearchParams(window.location.search.substring(0)); // selected symbol app.js 148-176
  const idAndSymbolString = urlParams.get("id");
  const arrOfSymbolAndId = idAndSymbolString.split("/");
  $.ajax({
    type: "GET",
    url: `/api/external/stocks/${arrOfSymbolAndId[1]}`,
  }).then((allData) => {
    const name = allData.companyName;
    let company_name = name.split(" ");
    company_name[0] = company_name[0].replace(/,/g, "");
    $.ajax({
      type: "GET",
      url: `/api/news/${company_name[0].toLowerCase()}`,
      dataType: "json",
    }).then((responseNews) => {
      if (responseNews.articles.articles.length !== 0) {
        const urlOne = responseNews.articles.articles[0].url;
        const urlTwo = responseNews.articles.articles[1].url;
        $("#headlineOne").attr("href", `${urlOne}`);
        $("#headlineTwo").attr("href", `${urlTwo}`);
        $("#headlineOne").text(responseNews.articles.articles[0].title);
        $("#headlineTwo").text(responseNews.articles.articles[1].title);
        $("#compName").text(company_name[0]);
      } else {
        const urlOne = "https://www.metastock.com/";
        const urlTwo = "https://www.bloomberg.com/";
        $("#headlineOne").attr("href", `${urlOne}`);
        $("#headlineTwo").attr("href", `${urlTwo}`);
        $("#headlineOne").text("Metastock");
        $("#headlineTwo").text("Bloomberg");
        $("#compName").text(company_name[0]);
      }
    });
    $.ajax({
      type: "GET",
      url: `/api/${arrOfSymbolAndId[1]}`,
      datatype: "json",
    }).then((responseFromAPI) => {
      printTheChart(responseFromAPI.companyLogo);
    });
  });

  function printTheChart(stockData) {
    let labelArray = [];
    let labels = stockData.forEach((item) => {
      console.log(item.label);
      labelArray.push(item.label);
    });

    let priceArray = [];
    let prices = stockData.forEach((item) => {
      console.log(item.close);
      priceArray.push(item.close);
    });

    const ctx = document.getElementById("myChart").getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labelArray,
        datasets: [
          {
            label: "Real-Time stock Price",
            backgroundColor: "#76ff03",
            borderColor: "#76ff03",
            data: priceArray,
          },
        ],
      },
    });
  }
});
