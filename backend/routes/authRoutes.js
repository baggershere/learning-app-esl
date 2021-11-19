const express = require("express");
const authControllers = require("../controllers/authControllers");
const authRoutes = express.Router();

authRoutes.post("/api/signup", authControllers.signup);
authRoutes.post("/api/login", authControllers.login);
authRoutes.get("/api/logout", authControllers.logout);
authRoutes.get("/api/sessionstatus", authControllers.sessionStatus);

module.exports = {
  authRoutes,
};