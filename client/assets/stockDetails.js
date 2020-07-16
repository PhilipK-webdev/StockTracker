$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search.substring(0));
    const idAndSymbolString = urlParams.get("id");
    const arrOfSymbolAndId = idAndSymbolString.split("/");
    $.ajax({
        type: "GET",
        url: `/api/external/stocks/${arrOfSymbolAndId[1]}`
    }).then(allData => {
        console.log(allData);
        const name = allData.companyName;
        let company_name = name.split(" ");
        company_name[0] = company_name[0].replace(/,/g, "");
        $.ajax({
            type: "GET",
            url: `/api/news/${company_name[0].toLowerCase()}`,
            dataType: "json"
        }).then(responseNews => console.log(responseNews));
    });

});



