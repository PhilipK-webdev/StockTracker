$(document).ready(function () {
  $('.carousel').carousel();

  // ON CLICKS
  // Button to add to watchlist table, launch requests to retreive close value, and add to user stocks
  $("#addBtn").on("click", () => {
    const company = $("#autocomplete").html()
    const symbol = $("#selected_option").html()
    renderWatchList(symbol);
    addStockUser(symbol).then((msg) => {
      console.log("Success message", msg);
    });
  });
  $("#testBtn").on("click", () => {
    loadWatchlist()
  })
  // Button to remove line on watchlist and remove from user watchlist(in database)
  $(document).on("click", ".removeBtn", function () {
    const symbol = $(this).attr("symbol")
    $(`#line-${symbol}`).remove()
    deleteStockUser(symbol)
  })
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
  $(document).on("click", ".newsBtn", function () {
    console.log($(this).attr("symbol"));
    const symbolUser = $(this).attr("symbol");
    $.ajax({
      type: "GET",
      url: "/api/user_data",
      dataType: "json"
    }).then(resonseUser => {
      const id = resonseUser.id;
      $.ajax({
        type: "GET",
        url: `/find/${id}`,
        dataType: "json"
      }).then(res => {
        console.log(res);
        const symbolReturn = res.map((symbol) => {
          if (symbol.symbol === symbolUser) {
            return symbol.symbol;
          }
        });
        console.log(symbolReturn);
        const filtered = symbolReturn.filter(function (x) {
          return x !== undefined;
        });
        console.log(filtered);
        window.location.href = `/stockDetails?id=${id}/${filtered[0]}`;
      });
    });
  });

  const renderWatchList = (symbol) => {
    console.log(symbol);
    getStockInfo(symbol)
      .then((stock) => {
        console.log(stock);
        let i = 0;
        $("tbody").append(`
      <tr id="line-${symbol}">
        <td>${stock.companyName}</td>
        <td>${symbol}</td>
        <td>${stock.value} USD</td>
        <td class="percent">${(stock.evolution * 100).toFixed(2)} %</td>
        <td class="newsBtn" symbol="${symbol}"><i title="More info" style="font-size: 30px; color:#26a69a" class="material-icons">new_releases</i></td>
        <td class="removeBtn" symbol="${symbol}"><i title="Delete from my Watchlist" style="font-size: 30px; color:#26a69a" class="
        material-icons">delete_forever</i></td>
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

  function displayStocksCarousel() {
    objStock().then(responseObjStockStatic => {
      const objStock = [];
      let count = 0;
      for (let i = 0; i < responseObjStockStatic.length; i++) {
        let obj = {
          companyName: responseObjStockStatic[i].companyName,
          symbol: responseObjStockStatic[i].symbol,
          lastValue: responseObjStockStatic[i].latestPrice,
        };
        objStock.push(obj);
        if (!count % 2) {
          $(".btnSubmit").on("click", function () {
            const btnId = parseInt($(this).attr("data-id"));
            console.log(btnId);
            count++;
            for (let i = 0; i < objStock.length; i++) {
              if (btnId === i) {
                renderWatchList(objStock[i].symbol);
                addStockUser(objStock[i].symbol).then((msg) => {
                  console.log("Success message", msg);
                });
              }
            }
          });
        }
        count++;
      }
      // getting the array of single logo;
      getSymbol(objStock).then(resLogo => {
        for (let i = 0; i < resLogo.length; i++) {
          $(`#img${i}`).attr("src", `${resLogo[i].companyLogo.url}`);
        }
        for (let i = 0; i < objStock.length; i++) {
          $(`#one${i}`).prepend(`<div class="card-content">
          <p style="color:red;">${objStock[i].companyName}</p>
          <p style="color:black;">${objStock[i].symbol}</p>
          <p style="color:green;">$${objStock[i].lastValue}</p>
          
        </div>
          `);
        }
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }

  displayStocksCarousel();



});

const objStock = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "/api/stock",
      dataType: "json"
    }).then(res => resolve(res)).catch(err => reject(err))
  })

}

const getSymbol = (objStock) => {
  return new Promise((resolve, reject) => {
    let tempArrPromise = [];
    for (i = 0; i < objStock.length; i++) {
      tempArrPromise.push($.ajax({
        type: "GET",
        url: `/api/logo/${objStock[i].symbol}`,
        dataType: "json"
      }))
    }
    Promise.all(tempArrPromise)
      .then(responses => {
        resolve(responses);
      }).catch(err => reject(err));

  });
}
