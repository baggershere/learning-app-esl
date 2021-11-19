const express = require("express");
const gameControllers = require("../controllers/gameControllers")
const gameRoutes = express.Router();

gameRoutes.post('/api/submitgamescore', gameControllers.submitGameScore)

module.exports = {
    gameRoutes
}