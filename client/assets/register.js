$(document).ready(function () {
  const password = $("#password");
  const email = $("#email");
  const firstname = $("#first_name");
  const lastname = $("#last_name");
  const username = $("#username");

<<<<<<< HEAD
  $("#btn_register").on("click", function (event) {
    event.preventDefault();
    const UserRegister = {
      firstname: firstname.val(),
      lastname: lastname.val(),
      username: username.val(),
      email: email.val(),
      password: password.val(),
    };
    register(UserRegister)
      .then((register) => {
        console.log(register);
        window.location.href = "/dashboard.html";
      })
      .catch((err) => console.log(err));
    $(".alert-success").show(); // << Successful registration alert
  });
  $("#btn_return").on("click", function (event) {
    event.preventDefault();
    window.location.href = "index.html";
  });
=======
    const password = $("#password");
    const email = $("#email");
    const firstname = $("#first_name");
    const lastname = $("#last_name");
    const username = $("#username");

    $("#btn_register").on("click", function (event) {
        event.preventDefault();
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

>>>>>>> 2dbba2c6d316916a8b94be1666df680055b79787
});

const register = (UserRegister) => {
  return new Promise((resovle, reject) => {
    $.ajax({
      type: "POST",
      url: "/api/register",
      data: UserRegister,
    })
      .then((res) => {
        resovle(res);
      })
      .catch((err) => reject(err));
  });
};
