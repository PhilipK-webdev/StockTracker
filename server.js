// Declaration :
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const session = require("express-session");
const passport = require("passport");
const db = require("./models");
require("dotenv").config();
// 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./client"));

app.use(
  session({ secret: process.env.SECRET, resave: true, saveUninitialized: true })
);

// Authentication:
app.use(passport.initialize());
app.use(passport.session());

// Client-routes
const clientRoutes = require("./controller/client-routes");
app.use(clientRoutes);

// Api-routes
const apiRoutes = require("./controller/api-routes");
app.use(apiRoutes);


// Connection with the database:
db.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));
});