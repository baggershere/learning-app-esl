const express = require("express");
const profileControllers = require("../controllers/profileControllers")
const profileRoutes = express.Router();

profileRoutes.post("/api/addchild", profileControllers.addChild);
profileRoutes.post("/api/removechild", profileControllers.removeChild);
profileRoutes.post("/api/returnscores", profileControllers.returnAverageScoreByGameByChild);
profileRoutes.get("/api/returnscoresavg", profileControllers.returnAverageGameScore);
profileRoutes.post("/api/returnrecentscores", profileControllers.returnRecentScoresByChild);
profileRoutes.post("/api/fetchuserinfo", profileControllers.fetchUserInfo);
profileRoutes.post("/api/fetchprofileinfo", profileControllers.fetchProfileInfo);


module.exports = {
    profileRoutes
}