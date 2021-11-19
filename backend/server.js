const express = require("express");
const cookieParser = require("cookie-parser");
const { authRoutes } = require("./routes/authRoutes.js");
const { gameRoutes } = require("./routes/gameRoutes");
const { profileRoutes } = require("./routes/profileRoutes");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDBSession = require("connect-mongodb-session")(session);
const mongoURI = `mongodb+srv://baggers:bubblebath9@matt-project.zbj1q.mongodb.net/english-session?retryWrites=true&w=majority`;
const { isAuth } = require("./middlewear/authMiddlewear");

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

app.use(authRoutes);
app.use(isAuth, gameRoutes);
app.use(isAuth, profileRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Running on port ${process.env.PORT}`)
);

module.exports = app;
