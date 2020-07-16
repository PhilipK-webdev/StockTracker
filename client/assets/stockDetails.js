// $(document).ready(function () {
//   const urlParams = new URLSearchParams(window.location.search);
//   const id = urlParams.get("id");
// });

$(document).ready(function () {
<<<<<<< HEAD
  $(".sidenav").sidenav();
});

const tokenIEX = "pk_723f0373466e46fa8549c7f632ef69f1";
const symbol = "AAPL";
const intradayUrl = `https://cloud.iexapis.com/stable/stock/${symbol}/intraday-prices?token=${tokenIEX}`;

axios
  .get(intradayUrl)
  .then((responseFromAPI) => {
    printTheChart(responseFromAPI.data);
  })
  .catch((err) => console.log("Error while getting the data: ", err));

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
          backgroundColor: "#757575",
          borderColor: "#757575",
          data: priceArray,
        },
      ],
    },
  });
}
=======
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    console.log(id);




});
>>>>>>> 7fb46c8f89da62afb74beb0de3811b984ae2963a
