$(document).ready(function () {

    const password = $("#password");
    const email = $("#email");
    const firstname = $("#first_name");
    const lastname = $("#last_name");
    const username = $("#username");

    $("#btn_register").on("click", function (event) {
        event.preventDefault();
        console.log("hello");
        const UserRegister = {
            firstname: firstname.val(),
            lastname: lastname.val(),
            username: username.val(),
            email: email.val(),
            password: password.val(),
        }
        register(UserRegister).then(register => {
            console.log(register);
            window.location.href = "/dashboard";
        }).catch(err => console.log(err));
    });
    $("#btn_return").on("click", function (event) {
        event.preventDefault();
        window.location.href = "index.html";
    });

});

const register = (UserRegister) => {
    return new Promise((resovle, reject) => {
        $.ajax({
            type: "POST",
            url: "/api/register",
            data: UserRegister
        }).then(res => {
            resovle(res);

        }).catch(err => reject(err));
    })
}