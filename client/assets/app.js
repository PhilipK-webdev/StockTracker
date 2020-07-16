// document.addEventListener("DOMContentLoaded", function () {
//   var elems = document.querySelectorAll(".carousel");
//   var instances = M.Carousel.init(elems, options);
// });

$(document).ready(function () {

  // Object of stock with : company name, symbol,last value

  //Caroussel test
  $(document).ready(function () {
    $('.slider').slider({ full_width: true });
  });

  // New test
  //   setTimeout(function () {
  //     addItem()
  //   }, 2000);
  // });


  // function createItem() {
  //   //class="active" style="opacity: 1;"
  //   return '<li > ' +
  //     '<img src="http://lorempixel.com/580/250/nature/4"> ' +
  //     '<div class="caption center-align"> ' +
  //     '<h3>Novo item ' + itens.length + '!</h3> ' +
  //     '<h5 class="light grey-text text-lighten-3">Here our small slogan.</h5>' +
  //     '</div>' +
  //     '</li>';
  // }

  // let itens = [];
  // function addItem() {
  //   $('.slides').empty();
  //   $('.slider > .indicators').detach();

  //   itens.push(createItemSlider());

  //   for (i in itens) {
  //     $('.slides').append(itens[i]);
  //   }

  //   $('.slider').slider();

  //   showItem(i);
  // }

  function showItem(i) {
    $('.slider > .indicators > .indicator-item')[i].click();
  }
  // end new test

  const slidesStart = () => {
    let itens = [];
    $('.slides').empty();
    $('.slider > .indicators').detach();

    itens.push(createItemSlider());

    for (i in itens) {
      $('.slides').append(itens[i]);
    }

    $('.slider').slider();

    showItem(i);


    objStock().then(async (popularStock) => {
      console.log("my popular stocks", popularStock)
      // // console.log();
      for (i = 0; i < 5; i++) {
        let symbol = popularStock[i].symbol
        let company1 = popularStock[i].companyName.split(" ")[0]
        let company2 = company1.replace(",", "")

        await getNews(company2).then((res) => {
          urlImgArticle = res.map(a => {
            return a.urlToImage
          })
        })
        await getNews(company2).then((res) => {
          headlineArticle = res.map(a => {
            return a.title
          })
        })
        let imgTransit = JSON.stringify(urlImgArticle)
        let img1 = imgTransit.replace("[", "")
        let img2 = img1.replace("]", "")


        if (headlineArticle !== "") {
          console.log("company name", company2);
          console.log("title", headlineArticle);
          console.log("last img", img2);

          createItemSlider(img2, company2, headlineArticle)
        }
      }
    })
  }

  const createItemSlider = (imgLink, company, title) => {
    return '<li > ' +
      '<img src= ' + imgLink + '> ' +
      '<div class="caption left-align"> ' +
      '<h3>' + company + '</h3> ' +
      '<h5 class="light grey-text text-lighten-3">' + title + '</h5>' +
      '<h6 class="light grey-text text-lighten-3">' + title + '</h6>' +
      '</div>' +
      '</li>';

  }

  // $(".slides").prepend(`
  // <li class="" style="opacity: 0; transform: translateX(0px) translateY(0px);">
  // <img src="https://techcrunch.com/wp-content/uploads/2020/07/GettyImages-1227124569.jpg?w=600" style="background-image: url('https://techcrunch.com/wp-content/uploads/2020/07/GettyImages-1227124569.jpg?w=600');">
  //   <div class="caption left-align" style="opacity: 1; transform: translateX(0px) translateY(0px);">
  //     <h3>${company}</h3>
  //     <h5 class="light grey-text text-lighten-3">${title}</h5>
  //   </div>
  // </li>
  // `)
  // $(".indicators").append(`
  // <li class="indicator-item"></li>
  // `)


  // /api/news /:company
  // /api/logo/:symbol

  const getLogo = (symbol) => {
    return $.ajax({
      type: "GET",
      url: `/api/logo/${symbol}`,
    })

  }
  const getNews = (company) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url: `/api/news/${company}`,
      }).then((res) => {
        // console.log("these are the articles", res.articles.articles);
        resolve(res.articles.articles)


        return res.articles.articles
      })
        .catch(err => reject(err))
    })
  }

  //caroussel test end

  $('.carousel').carousel();
  displayStocksCarousel();

  // INIT FUNCTIONS

  setTimeout(function () { init(); }, 100);

  const init = async () => {
    if (window.location.href.endsWith("dashboard.html")) {
      await loadWatchlist()
      await slidesStart()
    }
  }


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
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
}


