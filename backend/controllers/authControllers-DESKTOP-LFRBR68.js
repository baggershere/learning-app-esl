const { getCon } = require("../DB/getcon");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const jwt = require("jsonwebtoken");
const { NONAME } = require("dns");

const singupErrorHandler = (error) => {
  let errors = {
    message: "",
  };

  if (error.message === "Name too short") {
    errors.message = "Please enter your name";
    return errors;
  }
  if (error.message === "Email too short") {
    errors.message = "Please enter your email";
    return errors;
  }

  if (error.code && error.code === "23505") {
    errors.message = "This email already exists";
    return errors;
  }

  if (error.message == "Your password is too short") {
    errors.message = "Your password must be mat least 6 characters";
    return errors;
  }

  return errors;
};

module.exports.signup = async (req, res) => {
  console.log("signup route");
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const hashPassword = process.env.HASHINGPASSWORD;
  const pool = getCon();

  try {
    if (name.length === 0) {
      throw new Error("Name too short");
    }
    if (email.length === 0) {
      throw new Error("Email too short");
    }
    if (name.length > 49 || email.length > 49) {
      throw new Error("One of the fields are too long");
    }
    if (password.length < 6) {
      throw new Error("Your password is too short");
    }
    if (password.length > 50) {
      throw new Error("Your password is too long");
    }

    await bcrypt.genSalt(saltRounds, async function (err, salt) {
      await bcrypt.hash(password, salt, async function (err, hash) {
        await pool
          .query(`INSERT INTO users VALUES ($1,$2,$3)`, [email, name, hash])
          .then((resp) => res.status(200).send({ status: "200" }))
          .catch((e) => {
            console.log(e);
            res.status(400).json({
              error: singupErrorHandler(e),
            });
          });
      });
    });
  } catch (error) {
    res.status(400).json({
      error: singupErrorHandler(error),
    });
  }
};

const getStoredPassword = async (email) => {
  const pool = getCon();
  const resp = await pool.query(
    `SELECT password FROM users WHERE email = '${email}'`
  );
  return resp;
};

const getFirstChild = async (email, req) => {
  const pool = getCon();
  await pool
    .query(
      "SELECT child_name FROM children WHERE email = $1 ORDER BY date_added LIMIT 1",
      [email]
    )
    .then((resp) => (req.session.child = resp.rows[0]));
};

module.exports.login = async (req, res) => {
  console.log("login route");
  const email = req.body.email;
  const password = req.body.password;
  const pool = getCon();
  try {
    getStoredPassword(email).then(async (resp) => {
      if (resp.rows.length > 0) {
        const match = await bcrypt.compare(password, resp.rows[0].password);

        if (match) {
          let user = {
            email: email,
          };
          await pool
            .query("SELECT name from users where email = $1", [email])
            .then((resp) => {
              user.name = resp.rows[0].name;
            });
          user.token = jwt.sign(user, "" + process.env.HASHINGPASSWORD);
          res
            .status(200)
            .cookie("authorization", user.token, {
              sameSite: "none",
              secure: true,
            })
            .json({ user });
        } else {
          res.status(400).json({ message: "Wrong password" });
        }
      }

      if (resp.rows.length === 0) {
        res.status(400).json({ message: "Email or password is incorrect" });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.logout = async (req, res) => {
  req.session.isAuth = false;
  req.session.child = null;
  res.status(200).json({ message: "logged out" });
};

module.exports.sessionStatus = async (req, res) => {
  console.log("sessionStatus route");
  const header = req.cookies.authorization;

  const token = header; //header && header.split(" ")[1];
  if (token === null) return res.sendStatus(400);

  jwt.verify(token, process.env.HASHINGPASSWORD, (err, user) => {
    if (err) return res.sendStatus(400);
    res.status(200).json({ message: "authed", user: user, token });
  });
};
