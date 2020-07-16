$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    console.log(id);

    $.ajax({
        type: "GET",
        url: `/find/${id}`,
        dataType: "json"
    }).then(res => {

        console.log(res);
        $.ajax({
            type: "GET",
            url: `/api/external/stocks/${res[0].symbol}`
        }).then(allData => {

            console.log(allData);
            $.ajax({
                type: "GET",
                url: `/api/news/${allData.companyName}`,
                dataType: "json"
            }).then(res => console.log(res));
        })

    });



});
