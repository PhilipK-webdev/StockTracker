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
        register(User).then(register => {
            console.log(register);
            window.location.href = "/";
        }).catch(err => console.log(err));
    });
});

const register = (User) => {
    return new Promise((resovle, reject) => {
        $.ajax({
            type: "POST",
            url: "/api/register",
            data: User
        }).then(res => {
            resovle(res);

        }).catch(err => reject(err));
    })
}