$(document).ready(function () {
    const username = $("#username");
    const password = $("#password");
    const UserLogin = {
        username: username.val(),
        password: password.val(),
    }
    $("#btn_login").on("click", function (event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: UserLogin
        }).then(res => {
            console.log(res);
            // window.location.href = "/dashboard.html";
        }).catch(err => console.log(err));
    });
});

