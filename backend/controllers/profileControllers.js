const { getCon } = require("../DB/getcon");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const errorHandler = (error) => {
  let errors = {
    name: "",
  };
  console.log(error);
  if (error.code && error.code === "23505") {
    errors.name = "You have already added this child";
  }

  if (error.message == "Please enter a name") {
    errors.name = "Please enter a name";
  }

  return errors;
};

module.exports.addChild = async (req, res) => {
  console.log("addchild route");
  console.log(req);
  const pool = getCon();
  const childName = req.body.childName;
  const email = req.email;
  try {
    if (childName.length === 0) {
      throw new Error("Please enter a name");
    }
    const insertChild = await pool.query(
      "INSERT INTO children (child_name, email) VALUES ($1,$2)",
      [childName, email]
    );
    // let user = {
    //   name,
    //   email,
    //   children: [],
    // };
    // const response = await pool.query(
    //   "SELECT child_name FROM children WHERE email = $1 ORDER BY date_added",
    //   [email]
    // );
    // response.rows.forEach((row) => {
    //   user.children.push(row.child_name);
    // });
    // console.log(user);
    // const accessToken = jwt.sign(user, process.env.HASHINGPASSWORD);
    res.sendStatus(200); //.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: errorHandler(error) });
  }
};

module.exports.removeChild = async (req, res) => {
  console.log("remove child route");
  console.log(req);
  const pool = getCon();
  const childName = req.body.childName;
  const email = req.email;
  try {
    const delQuery = await pool.query(
      "DELETE FROM children WHERE email = $1 AND child_name = $2",
      [email, childName]
    );

    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ error: e });
  }

  // .then((resp) => {
  //   req.session.child = null;
  //   res.status(200).send();
  // })
  // .catch((e) => res.status(400).json({ error: e }));
};

module.exports.returnAverageScoreByGameByChild = async (req, res) => {
  //console.log(req.session);
  const email = req.user.email;
  const childName = req.body.childName;
  const pool = getCon();
  await pool
    .query(
      `SELECT AVG(game_score), game_name FROM game_scores
  WHERE email = $1 AND child_name = $2
  GROUP BY game_name;`,
      [email, childName]
    )
    .then((resp) => {
      res.status(200).json({
        data: resp.rows,
      });
    })
    .catch((e) => res.status(400).json({ error: e }));
};

module.exports.returnAverageGameScore = async (req, res) => {
  const pool = getCon();

  await pool
    .query(
      `SELECT AVG(game_score), game_name FROM game_scores GROUP BY game_name`
    )
    .then((resp) => res.status(200).json({ data: resp.rows }))
    .catch((e) => {
      res.status(400).send();
      console.log(e);
    });
};

module.exports.returnRecentScoresByChild = async (req, res) => {
  const pool = getCon();
  const childName = req.body.childName;
  const email = req.session.email;
  await pool
    .query(
      `SELECT game_name, game_score, date_attempt FROM game_scores WHERE email = $1 
  AND child_name = $2 ORDER BY date_attempt DESC;`,
      [email, childName]
    )
    .then((resp) => res.status(200).json({ data: resp.rows }))
    .catch((e) => res.status(400).json({ error: e }));
};
module.exports.fetchUserInfo = async (req, res) => {
  const email = req.email;
  let user = {};
  user.email = email;
  user.name = req.name;
  const pool = getCon();
  const childrenResponse = await pool.query(
    "SELECT child_name FROM children WHERE email=$1 ORDER BY date_added",
    [email]
  );
  user.selectedChild =
    childrenResponse.rows.length > 0 ? childrenResponse.rows[0].child_name : "";

  res.json({ data: user });
};

module.exports.fetchProfileInfo = async (req, res) => {
  console.log("profile info route");
  console.log(req);
  const pool = getCon();
  const email = req.email;
  try {
    let data = {
      childrenArray: [],
      averageGameScoreByGame: {},
      recentScores: {},
    };
    const childrenResponse = await pool.query(
      "SELECT child_name FROM children WHERE email=$1 ORDER BY date_added",
      [email]
    );
    data.childrenArray = childrenResponse.rows.map((a) => a.child_name);
    const averageScoreByGameByChildResponse = await pool.query(
      `SELECT AVG(game_score), game_name, child_name FROM game_scores
    WHERE email = $1
    GROUP BY game_name, child_name;`,
      [email]
    );
    data.averageGameScoreByChild = averageScoreByGameByChildResponse.rows;
    const recentScoresByChildResponse = await pool.query(
      `SELECT game_name, game_score, child_name, date_attempt FROM game_scores WHERE email = $1 
    ORDER BY date_attempt DESC;`,
      [email]
    );
    data.recentScores = recentScoresByChildResponse.rows;
    const averageGameScoreResponse = await pool.query(
      `SELECT AVG(game_score), game_name FROM game_scores GROUP BY game_name`
    );
    data.averageOverallScores = averageGameScoreResponse.rows;
    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};
