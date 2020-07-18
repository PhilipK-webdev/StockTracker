

$(document).ready(function () {

  // INIT FUNCTIONS

  $("#welcomeText").hide()
  $(".highlight").show()

  // Init to start displaying dashboard
  setTimeout(function () { init(); }, 100);

  // ON CLICKS

  // Button to add one of the popular stocks

  $(document).on("click", ".addPopular", function () {
    const symbol = $(this).attr("symbol")

    $(".highlight").show()
    $("#welcomeText").hide()
    addStockUser(symbol).then((msg) => {
      if (msg === false) {
        M.toast({ html: `${symbol} already in watchlist!` })
      } else {
        renderWatchList(symbol)
        M.toast({ html: `${symbol} successfully added!` })
      }
    })
  })

  // Button to add to watchlist table, launch requests to retreive close value, and add to user stocks
  $("#addBtn").on("click", () => {
    const symbol = $("#selected_option").html()
    $(".highlight").show()
    $("#welcomeText").hide()
    addStockUser(symbol).then((msg) => {
      if (msg === false) {
        M.toast({ html: `${symbol} already in watchlist!` })
      } else {
        renderWatchList(symbol)
        M.toast({ html: `${symbol} successfully added!` })
      }
    })
    $("#autocomplete").val("")
    $("#selected_option").text("")

  })

  // Button to remove line on watchlist and remove from user watchlist(in database)
  $(document).on("click", ".removeBtn", function () {
    const symbol = $(this).attr("symbol")
    $(`#line-${symbol}`).remove()
    deleteStockUser(symbol)
    M.toast({ html: `${symbol} removed from watchlist` })
  })

  // Button to go to stockdetails page  

  // FUNCTIONS

  // Function for initialization (slider and watchlist, handling 1st connection or not)
  const init = async () => {
    if (window.location.href.endsWith("dashboard")) {
      await slidesStart()
      await loadWatchlist()
    }

    userStocks()
      .then((res) => {
        if (res.stocksArray == "") {
          $("#welcomeText").show()
          $(".highlight").hide()
        } else {
          $(".highlight").show()
          $("#welcomeText").hide()
        }
      })
  }

  // Function for slider start
  const slidesStart = () => {

    objStock().then(async (popularStock) => {
      for (i = 0; i < 5; i++) {
        let symbol = popularStock[i].symbol
        let stockValue = popularStock[i].iexRealtimePrice
        let companyParts = popularStock[i].companyName.split(" ")[0]
        let company = companyParts.replace(",", "")

        let companyNews = await getNews(company) // { urlToImage: '', headerTitle: '' }
        const finalImage = companyNews.urlToImage
        const finalTitle = companyNews.title

        if (finalTitle !== "" && finalTitle !== undefined) {
          createItemSlider(finalImage, company, stockValue, finalTitle, symbol)
        }
      }

      $('.slider').slider({ full_width: true });
      $('.indicators').hide();
    })
  }

  // Function to create all items for slider
  const createItemSlider = (imgLink, company, stockValue, title, symbol) => {
    $(".slides").prepend(`
      <li>
      <img src="${imgLink}">
        <div class="caption center-align container hoverable">
        <div class="row">
          <h3 class="sliderText">${company}</h3>
          <h4 class="sliderText">Stock value : ${stockValue} $</h4>
          <h5 class="sliderText light grey-text text-lighten-3">${title}</h5>
          <a symbol="${symbol}" class="addPopular waves-effect waves-light btn">Add</a>
        </div>
        </div>
      </li>`)
  }

  // Function to get news
  const getNews = (company) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url: `/api/news/${company}`,
      }).then((res) => {
        const result = res.articles.articles[0] || { urlToImage: 'http://default.pix', headerTitle: 'No Title' }
        resolve(result)
      })
        .catch(err => reject(err))
    })
  }

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
        const symbolReturn = res.map((symbol) => {
          if (symbol.symbol === symbolUser) {
            return symbol.symbol;
          }
        });
        const filtered = symbolReturn.filter(function (x) {
          return x !== undefined;
        });
        window.location.href = `/stockDetails?id=${id}/${filtered[0]}`;
      });
    });
  });


  const renderWatchList = (symbol) => {
    getStockInfo(symbol)
      .then((stock) => {
        let stockEvolution = (stock.evolution * 100).toFixed(2)
        $("tbody").append(`
      <tr id="line-${symbol}">
        <td>${stock.companyName}</td>
        <td>${symbol}</td>
        <td>${stock.value} USD</td>
        <td class="percent-${symbol}">${stockEvolution} %</td>
        <td class="icon newsBtn" symbol="${symbol}"><a href="#"><i title="More info" style="font-size: 30px; color:#26a69a" class="material-icons">new_releases</i></a></td>
        <td class="icon removeBtn" symbol="${symbol}"><a href="#"><i title="Delete from my Watchlist" style="font-size: 30px; color:#26a69a" class="
        material-icons">delete_forever</i></a></td>
      </tr>
`)
        // conditional to change style for % change value (red or green)
        if (stockEvolution < 0) {
          $(`.percent-${symbol}`).attr("style", "color: red; animation: blinker 2s linear infinite;")
        } else {
          $(`.percent-${symbol}`).attr("style", "color: green; animation: blinker 2s linear infinite;")
        }
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


  // Function to load the watchlist from the user (database)
  const loadWatchlist = async () => {
    const user = await getUserInfo()
    $.ajax({
      type: "GET",
      url: `/api/users/${user.id}/watchlist`,
    }).then((userStocks) => {
      let stocks = userStocks.stocksArray
      stocks.forEach((symbol) => {
        renderWatchList(symbol.symbol)
      })
    })

  }

  // Function to know if the user as stocks in watchlist
  const userStocks = async () => {
    const user = await getUserInfo()
    return $.ajax({
      type: "GET",
      url: `/api/users/${user.id}/watchlist`,
    })
  }
});

// Function to get array of popular stocks
const objStock = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "/api/stock",
      dataType: "json"
    }).then(res => resolve(res)).catch(err => reject(err))
  })

}

// Function to get the symbol of an array of stocks
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

// Function to display stocks on the caroussel
function displayStocksCarousel() {
  objStock().then(responseObjStockStatic => {
    const objStock = [];
    for (let i = 0; i < responseObjStockStatic.length; i++) {
      let obj = {
        companyName: responseObjStockStatic[i].companyName,
        symbol: responseObjStockStatic[i].symbol,
        lastValue: responseObjStockStatic[i].latestPrice,

      };
      objStock.push(obj);
    }
    // getting the array of single logo;
    getSymbol(objStock).then(resLogo => {
      for (let i = 0; i < resLogo.length; i++) {
        $(`#img${i}`).attr("src", `${resLogo[i].companyLogo.url}`);
      }
      for (let i = 0; i < objStock.length; i++) {
        $(`#one${i}`).prepend(`<div class="card-content">
        <p style="color:red;">Company Name:<br>${objStock[i].companyName}</br></p>
        <p style="color:black;">Symbol:<br>${objStock[i].symbol} </br></p>
        <p style="color:green;">Last Value:<br>${objStock[i].lastValue}$</p>
        <button type="submit" id="btnSubmit" data-id=${i}>Add ME</button>
      </div>
        `);
      }
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
}




