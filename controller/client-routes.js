const express = require("express");
const router = express.Router();
const path = require("path");
const isAuthenticated = require("../config/middleware/isAuthenticated");

router.get("/", (req, res) => {
  if (req.user) {
    res.redirect("/dashboard");
  }
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

router.get("/login", (req, res) => {
  if (req.user) {
    res.redirect("/dashboard");
  }
  res.sendFile(path.join(__dirname, "../client/login.html"));
});

router.get("/register", (req, res) => {
  if (req.user) {
    res.redirect("/dashboard");
  }
  res.sendFile(path.join(__dirname, "../client/register.html"));
});

router.get("/dashboard", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dashboard.html"));
});

router.get("/stockDetails", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/stockDetails.html"));
});

module.exports = router;
