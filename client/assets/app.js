// document.addEventListener("DOMContentLoaded", function () {
//   var elems = document.querySelectorAll(".carousel");
//   var instances = M.Carousel.init(elems, options);
// });

// Or with jQuery

$(document).ready(function () {
  $(".carousel").carousel();

  // ON CLICKS

  // Button to add to watchlist table, launch requests to retreive close value, and add to user stocks
  $("#addBtn").on("click", () => {

    const company = $("#autocomplete").html()
    const symbol = $("#selected_option").html()

    renderWatchList(symbol)
    addStockUser(symbol).then((msg) => {
      console.log("Success message", msg);
    })
  })

  $("#testBtn").on("click", () => {

    loadWatchlist()
  })

  // Button to remove line on watchlist and remove from user watchlist(in database)
  $(document).on("click", ".removeBtn", function () {
    const symbol = $(this).attr("symbol")
    $(`#line-${symbol}`).remove()
    deleteStockUser(symbol)
  })


  // FUNCTIONS

  // Autocomplete function to get stocks name and symbols from JSON file hosted on URL
  var arrayReturn = [];
  $.ajax({
    url: "https://api.npoint.io/d8f251b3646602071881",
    async: true,
    dataType: 'json',
    success: function (data) {
      for (var i = 0, len = data.length; i < len; i++) {
        var symbol = data[i].symbol
        arrayReturn.push({ 'value': data[i].name, 'data': symbol });
      }
      loadSuggestions(arrayReturn);
    }
  });

  function loadSuggestions(options) {
    $('#autocomplete').autocomplete({
      lookup: options,
      onSelect: function (suggestion) {
        $('#selected_option').html(suggestion.data);
      }
    });
  }

  // Function to render information in the watchlist table
  const renderWatchList = (symbol) => {
    console.log(symbol);

    getStockInfo(symbol)

      .then((stock) => {
        console.log(stock);
        $("tbody").append(`
      <tr id="line-${symbol}">
        <td>${stock.companyName}</td>
        <td>${symbol}</td>
        <td>${stock.value} USD</td>
        <td>${(stock.evolution * 100).toFixed(2)} %</td>
        <td class="removeBtn" symbol="${symbol}">Remove</td>
      </tr>
`)
      })
  }

  // Function to add a stock to the user watchlist (in database)
  const addStockUser = async (symbol) => {

    const user = await getUserInfo()
    return $.ajax({
      type: "POST",
      url: `/api/users/${user.id}/stocks/${symbol}`,
    })
  }


  // Function to delete a stock from the user watchlist (in database)
  const deleteStockUser = async (symbol) => {

    const user = await getUserInfo()
    return $.ajax({
      type: "DELETE",
      url: `/api/users/${user.id}/stocks/${symbol}`,
    })
  }

  // Function to get info from stock
  const getStockInfo = (symbol) => {
    return $.ajax({
      type: "GET",
      url: `/api/external/stocks/${symbol}`,
    }).then((stock) => {
      console.log("api from GetStockInfo", stock);
      return stock
    })
  }

  // Function to get information from user logged in
  const getUserInfo = async () => {

    return $.ajax({
      type: "GET",
      url: "/api/user_data",
    })
  }

  const loadWatchlist = async () => {
    const user = await getUserInfo()

    $.ajax({
      type: "GET",
      url: `/api/users/${user.id}/watchlist`,
    }).then((userStocks) => {
      console.log(userStocks);
      console.log(userStocks.stocksArray);
      let stocks = userStocks.stocksArray
      stocks.forEach((symbol) => {
        renderWatchList(symbol.symbol)
      })
      console.log(userStocks);
    })

  }

});