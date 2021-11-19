const { getCon } = require("../DB/getcon");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
const expect = chai.expect;
const seeder = require("../seeder");
const noOfGames = 3;

chai.use(chaiHttp);
let cookieString;

describe("Sign up to app", () => {
  before(() => {
    seeder();
  });
  it("should return 200 and be inserted in the database", (done) => {
    chai
      .request(server)
      .post("/api/signup")
      .send({
        email: "test@test.com",
        name: "John",
        password: "password",
      })
      .end(async (err, resp) => {
        resp.should.have.status(200);

        let pool = getCon();
        await pool
          .query("SELECT * FROM users WHERE email = 'test@test.com'")
          .then((resp) => {
            resp.rows.should.have.lengthOf(1);
          })
          .catch((e) => console.log(e));
        done();
      });
  });
  it("Should return 400", (done) => {
    chai
      .request(server)
      .post("/api/signup")
      .send({
        email: "test@test.com",
        name: "Xavier",
        password: "password",
      })
      .end((err, resp) => {
        resp.should.have.status(400);
        done();
      });
  });
});

describe("Login to app", () => {
  it("should return 200 and session authed", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .end((err, resp) => {
        resp.should.have.status(200);
        cookieString = resp.header["set-cookie"][0];
        chai
          .request(server)
          .get("/api/sessionstatus")
          .set("Cookie", cookieString)
          .end((err, resp) => {
            expect(resp.body.message).to.equal("authed");
            done();
          });
      });
  });
  it("should return 400 and session not authed", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({
        email: "test123@test.com",
        password: "password",
      })
      .end((err, resp) => {
        resp.should.have.status(400);
        done();
      });
  });
});

describe("add child", () => {
  it("should add a child and store in database", (done) => {
    chai
      .request(server)
      .post("/api/addchild")
      .set("Cookie", cookieString)
      .send({ childName: "sophie" })
      .end(async (err, resp) => {
        resp.should.have.status(200);
        let pool = getCon();
        await pool
          .query(
            "SELECT * FROM children WHERE email = $1 AND child_name = $2",
            ["test@test.com", "sophie"]
          )
          .then((resp) => {
            resp.rows.should.have.lengthOf(1);
          })
          .catch((e) => console.log(e));
        done();
      });
  });
});

describe("Submit a game score", () => {
  it("Should submit a gamescore and be inserted into the database", (done) => {
    chai
      .request(server)
      .post("/api/submitgamescore")
      .set("Cookie", cookieString)
      .send({
        gameName: "Nouns",
        gameScore: 77,
        email: "test@test.com",
        childName: "sophie",
      })
      .end(async (err, resp) => {
        resp.should.have.status(200);
        const pool = getCon();
        await pool
          .query("SELECT * FROM game_scores WHERE email = $1", [
            "test@test.com",
          ])
          .then((resp) => resp.rows.should.have.lengthOf.above(0));
        done();
      });
  });
});

describe("Return student information", () => {
  it("Should return game score data for child", (done) => {
    chai
      .request(server)
      .post("/api/returnscores")
      .set("Cookie", cookieString)
      .send({ childName: "sophie" })
      .end((err, resp) => {
        console.log(resp.data);
        resp.should.have.status(200);
        expect(resp.body).to.have.all.keys("data");
        done();
      });
    done();
  });

  it("Should return the average scores for each game", (done) => {
    chai
      .request(server)
      .get("/api/returnscoresavg")
      .set("Cookie", cookieString)
      .end((err, resp) => {
        resp.should.have.status(200);
        resp.body.should.have.all.keys("data");
        resp.body.data.should.have.lengthOf(3);
        done();
      });
  });

  it("should return recent scores by game", (done) => {
    chai
      .request(server)
      .get("/api/returnscoresavg")
      .set("Cookie", cookieString)
      .end((err, resp) => {
        resp.body.data.should.have.lengthOf(noOfGames);
        done();
      });
  });
});

describe("Remove child", () => {
  it("should send back 200 status and child should not exist in databse", (done) => {
    chai
      .request(server)
      .post("/api/removechild")
      .set("Cookie", cookieString)
      .send({ childName: "sophie" })
      .end(async (err, resp) => {
        resp.should.have.status(200);
        const pool = getCon();
        await pool
          .query(
            "SELECT * FROM children WHERE child_name = $1 AND email = $2",
            ["sophie", "test@test.com"]
          )
          .then((resp) => {
            resp.rows.should.have.lengthOf(0);
          });
        done();
      });
  });
});

describe("Logout successfully", () => {
  it("Should send back a 200 HTTP response", (done) => {
    chai
      .request(server)
      .get("/api/logout")
      .set("Cookie", cookieString)
      .end((err, resp) => {
        resp.should.have.status(200);
        done();
      });
    done();
  });
});
