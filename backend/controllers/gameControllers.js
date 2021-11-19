const { getCon } = require("../DB/getcon");

module.exports.submitGameScore = async (req, res) => {
  console.log("gamescore route")
  const childName = req.body.childName;
  const gameName = req.body.gameName;
  const gameScore = req.body.gameScore;
  const email = req.body.email;
  const time = req.body.time;
  console.log(childName, gameName, gameScore, email, time);

  const pool = getCon();
  try {
    await pool
      .query(
        "INSERT INTO game_scores (game_name,game_score,email,child_name, date_attempt) VALUES ($1,$2,$3,$4,$5)",
        [gameName, gameScore, email, childName, time]
      )
      .then((resp) => res.status(200).json({ message: "Inserted" }));
  } catch (error) {
    console.log(error);
  }
};