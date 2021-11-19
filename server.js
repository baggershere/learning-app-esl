const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { authRoutes } = require("./backend/routes/authRoutes.js");
const { gameRoutes } = require("./backend/routes/gameRoutes");
const { profileRoutes } = require("./backend/routes/profileRoutes");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDBSession = require("connect-mongodb-session")(session);
const mongoURI = `mongodb+srv://baggers:bubblebath9@matt-project.zbj1q.mongodb.net/english-session?retryWrites=true&w=majority`;
const { isAuth } = require("./backend/middlewear/authMiddlewear");

const app = express();
app.use(cookieParser());

app.use(express.json());
const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.enable("trust proxy");
app.get("/testroute", (req, res) => {
  res.send("test route");
});
app.use(express.static("frontend/build"));
app.use(authRoutes);
app.use(isAuth, gameRoutes);
app.use(isAuth, profileRoutes);
console.log(process.env.NODE_ENV);
// Serve static assets from react app if in production

// app.get("*", (req, res) => {
//   console.log("react page route");
//   res.sendFile(path.join(__dirname, "frontend/build"));
// });

app.listen(process.env.PORT, () =>
  console.log(`Running on port ${process.env.PORT}`)
);

module.exports = app;
