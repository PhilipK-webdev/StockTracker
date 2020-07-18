$(document).ready(function () {
    const username = $("#username");
    const password = $("#password");

    $("#btn_login").on("click", function (event) {
        event.preventDefault();
        const UserLogin = {
            username: username.val(),
            password: password.val(),
        }
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: UserLogin
        }).then(res => {
            console.log(res);
            window.location.href = "/dashboard";
        }).catch(err => console.log(err));
    });
    $("#btn_return").on("click", function (event) {
        event.preventDefault();
        window.location.href = "index.html";
    });
});

