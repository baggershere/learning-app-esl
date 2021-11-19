import React from "react";
import NounsGame from "./NounsGame";
import { Container, makeStyles, Typography } from "@material-ui/core";
import { capitalize } from "@material-ui/core";
import "./gameStyles.css";
import Sentences from "./Sentences";
import Spelling from "./Spelling";
import Questions from "./Questions";

const useStyles = makeStyles({
  flexbox: {
    display: "flex",
    justifyContent: "center",
  },
});

const Game = ({ name }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Container>
        <Typography variant="h2" align="center">
          {capitalize(name)}
        </Typography>
      </Container>
      <Container className={classes.flexbox}>
        {name === "nouns" ? (
          <NounsGame />
        ) : name === "sentences" ? (
          <Sentences />
        ) : name === "spelling" ? (
          <Spelling />
        ) : name === "questions" ? (
          <Questions />
        ) : (
          <Typography align="center">
            Sorry, there is no game available under this name!
          </Typography>
        )}
      </Container>
    </React.Fragment>
  );
};

export default Game;
