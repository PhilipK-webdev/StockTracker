// document.addEventListener('DOMContentLoaded', function () {
//   var elems = document.querySelectorAll('.carousel');
//   var instances = M.Carousel.init(elems, options);
//   var instance = M.Carousel.getInstance(elem);


// });



$(document).ready(function () {

  // Object of stock with : company name, symbol,last value

  $('.carousel').carousel();
  displayStocksCarousel();


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

  // Function to add to watchlist table, launch requests to retreive close value, and add to user stocks

  $("#addBtn").on("click", () => {
    addStockUser()
  })

  const addWatchlist = () => {
    let company = $("#autocomplete").html()
    console.log(company);

    let symbol = $("#selected_option").html()

    $("tbody").append(`
            <tr>
              <td>${company}</td>
              <td>${symbol}</td>
              <td>200 $</td>
              <td>Remove</td>
            </tr>
`)

  }
  const addStockUser = () => {

    let symbol = $("#selected_option").html()


    $.ajax({
      type: "GET",
      url: "/api/user_data",
      data: { id: id },
    }).then(() => {
      return id
    });

    $.ajax({
      type: "POST",
      url: "/api/users/:id/stocks/:symbol",
      data: { id: id, symbol: symbol },
    }).then(() => {
      addWatchlist()
    });
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


