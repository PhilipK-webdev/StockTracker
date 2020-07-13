$(document).ready(function () {

    const password = $("#password");
    const email = $("#email");
    const firstname = $("#first_name");
    const lastname = $("#last_name");
    const username = $("#username");

    $("#btn_register").on("click", function (event) {
        event.preventDefault();
        console.log("hello");
        const User = {
            firstname: firstname.val(),
            lastname: lastname.val(),
            username: username.val(),
            email: email.val(),
            password: password.val(),
        }

        $.ajax({
            type: "POST",
            url: "/api/register",
            data: User
        }).then(res => {
            console.log(res);
            window.location.href = "/";
        }).catch(err => console.log(err));
    });
});
