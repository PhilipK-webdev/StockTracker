$(document).ready(function () {
  // Object of stock with : company name, symbol,last value

  // function showItem(i) {
  //   $('.slider > .indicators > .indicator-item')[i].click();
  // }

  // Function for slider start
  const slidesStart = () => {
    objStock().then(async (popularStock) => {
      console.log("my popular stocks", popularStock);
      console.log();
      for (let i = 0; i < 5; i++) {
        let symbol = popularStock[i].symbol;
        let stockValue = popularStock[i].iexRealtimePrice;
        let companyParts = popularStock[i].companyName.split(" ")[0];
        let company = companyParts.replace(",", "");

        let companyNews = await getNews(company); // { urlToImage: '', headerTitle: '' }
        const finalImage = companyNews.urlToImage;
        const finalTitle = companyNews.title;

        if (finalTitle !== "" && finalTitle !== undefined) {
          createItemSlider(finalImage, company, stockValue, finalTitle, symbol);
        }
      }

      $(".slider").slider({ full_width: true });
      $(".indicators").hide();
    });
  };

  // Function to create all items for slider
  const createItemSlider = (imgLink, company, stockValue, title, symbol) => {
    $(".slides").prepend(`
      <li>
      <img src="${imgLink}">
        <div class="caption left-align">
          <h3>${company}</h3>
          <h4>Stock value : ${stockValue} $</h4>
          <h5 class="light grey-text text-lighten-3">${title}</h5>
          <div class="col s2"><a symbol="${symbol}" class="addPopular waves-effect waves-light btn">Add</a></div>
        </div>
      </li>`);
  };

  // Function to get news
  const getNews = (company) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url: `/api/news/${company}`,
      })
        .then((res) => {
          const result = res.articles.articles[0] || {
            urlToImage: "http://default.pix",
            headerTitle: "No Title ahah",
          };
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  };

  // OLD Caroussel system initialization
  // $('.carousel').carousel();
  // displayStocksCarousel();

  // INIT FUNCTIONS

  $("#welcomeText").hide();
  $(".highlight").show();
  setTimeout(function () {
    init();
  }, 100);

  const init = async () => {
    if (window.location.href.endsWith("/dashboard")) {
      await slidesStart();
      await loadWatchlist();
    }

    userStocks().then((res) => {
      console.log(res.stocksArray);

      if (res.stocksArray == "") {
        $("#welcomeText").show();
        $(".highlight").hide();
      } else {
        $(".highlight").show();
        $("#welcomeText").hide();
      }
    });
  };

  // ON CLICKS

  // Button to add one of the popular stocks

  $(document).on("click", ".addPopular", function () {
    const symbol = $(this).attr("symbol");

    renderWatchList(symbol);
    $(".highlight").show();
    $("#welcomeText").hide();
    addStockUser(symbol).then((msg) => {
      console.log("Success message", msg);
    });
  });

  // Button to add to watchlist table, launch requests to retreive close value, and add to user stocks
  $("#addBtn").on("click", () => {
    const symbol = $("#selected_option").html();

    renderWatchList(symbol);
    $(".highlight").show();
    $("#welcomeText").hide();
    addStockUser(symbol).then((msg) => {
      console.log("Success message", msg);
    });
  });
  // Button to remove line on watchlist and remove from user watchlist(in database)
  $(document).on("click", ".removeBtn", function () {
    const symbol = $(this).attr("symbol");
    $(`#line-${symbol}`).remove();
    deleteStockUser(symbol);
  });
  // Autocomplete function to get stocks name and symbols from JSON file hosted on URL
  var arrayReturn = [];
  $.ajax({
    url: "https://api.npoint.io/d8f251b3646602071881",
    async: true,
    dataType: "json",
    success: function (data) {
      for (var i = 0, len = data.length; i < len; i++) {
        var symbol = data[i].symbol;
        arrayReturn.push({ value: data[i].name, data: symbol });
      }
      loadSuggestions(arrayReturn);
    },
  });
  function loadSuggestions(options) {
    $("#autocomplete").autocomplete({
      lookup: options,
      onSelect: function (suggestion) {
        $("#selected_option").html(suggestion.data);
      },
    });
  }
  $(document).on("click", ".newsBtn", function () {
    console.log($(this).attr("symbol"));
    const symbolUser = $(this).attr("symbol");
    $.ajax({
      type: "GET",
      url: "/api/user_data",
      dataType: "json",
    }).then((resonseUser) => {
      const id = resonseUser.id;
      $.ajax({
        type: "GET",
        url: `/find/${id}`,
        dataType: "json",
      }).then((res) => {
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
    getStockInfo(symbol).then((stock) => {
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
`);
    });
  };

  // Function to add a stock to the user watchlist (in database)
  const addStockUser = async (symbol) => {
    const user = await getUserInfo();
    return $.ajax({
      type: "POST",
      url: `/api/users/${user.id}/stocks/${symbol}`,
    });
  };

  // Function to delete a stock from the user watchlist (in database)
  const deleteStockUser = async (symbol) => {
    const user = await getUserInfo();
    return $.ajax({
      type: "DELETE",
      url: `/api/users/${user.id}/stocks/${symbol}`,
    });
  };

  // Function to get info from stock
  const getStockInfo = (symbol) => {
    return $.ajax({
      type: "GET",
      url: `/api/external/stocks/${symbol}`,
    }).then((stock) => {
      console.log("api from GetStockInfo", stock);
      return stock;
    });
  };

  // Function to get information from user logged in
  const getUserInfo = async () => {
    return $.ajax({
      type: "GET",
      url: "/api/user_data",
    });
  };

  // Function to load the watchlist from the user (database)
  const loadWatchlist = async () => {
    const user = await getUserInfo();
    $.ajax({
      type: "GET",
      url: `/api/users/${user.id}/watchlist`,
    }).then((userStocks) => {
      console.log(userStocks);
      console.log(userStocks.stocksArray);
      let stocks = userStocks.stocksArray;
      stocks.forEach((symbol) => {
        renderWatchList(symbol.symbol);
      });
    });
  };

  // Function to know if the user as stocks in watchlist
  const userStocks = async () => {
    const user = await getUserInfo();
    return $.ajax({
      type: "GET",
      url: `/api/users/${user.id}/watchlist`,
    });
    // .then((userStocks) => {
    //   return userStocks
    //   console.log(userStocks.stocksArray);
    // });
  };
});

// Function to get array of popular stocks
const objStock = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "/api/stock",
      dataType: "json",
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

// Function to get the symbol of an array of stocks
const getSymbol = (objStock) => {
  return new Promise((resolve, reject) => {
    let tempArrPromise = [];
    for (i = 0; i < objStock.length; i++) {
      tempArrPromise.push(
        $.ajax({
          type: "GET",
          url: `/api/logo/${objStock[i].symbol}`,
          dataType: "json",
        })
      );
    }
    Promise.all(tempArrPromise)
      .then((responses) => {
        resolve(responses);
      })
      .catch((err) => reject(err));
  });
};

// Function to display stocks on the caroussel
function displayStocksCarousel() {
  objStock()
    .then((responseObjStockStatic) => {
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
      getSymbol(objStock)
        .then((resLogo) => {
          console.log(resLogo[0].companyLogo.url);
          console.log(objStock[0].companyName);
          console.log(objStock.length);
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
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}
