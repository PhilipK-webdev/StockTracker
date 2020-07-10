// Declaration :
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const session = require("express-session");
const passport = require("passport");
const db = require("./models");

// 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static("./client/"));----- just a demo , we need to change the location of the folder of the client 

// Authentication:
app.use(passport.initialize());
app.use(passport.session());

// Connection with the database:
db.sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));
});

