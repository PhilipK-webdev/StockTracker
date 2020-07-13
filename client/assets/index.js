$(document).ready(function () {

    const password = $("#password");
    const username = $("#username");
    $("#btn_login").on("click", function (event) {
        event.preventDefault();
        console.log("hello");
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
            window.location.href = "./test_dashboard.html";
        }).catch(err => console.log(err));
    });
});