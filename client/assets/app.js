document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".carousel");
  var instances = M.Carousel.init(elems);
});

$(document).ready(function () {
  $(".carousel").carousel();

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
