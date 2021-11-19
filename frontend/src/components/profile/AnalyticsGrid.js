import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Container,
  Button,
  makeStyles,
} from "@material-ui/core";
import { useDispatch, useSelector } from "../../redux/react-redux-hooks";
import AverageScoresByGame from "./AverageScoresByGame";
import RecentList from "./RecentList";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => {
  return {
    button: {
      display: "flex",
      justifyContent: "space-evenly",
    },
    buttonContainer: {
      marginTop: "20px",
    },
    card: {
      backgroundColor: theme.palette.secondary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
    },
    active: {
      background: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
    },
  };
});

const AnalyticsGrid = ({ state }) => {
  const [loading, setLoading] = useState(true);
  const [gameType, setGameType] = useState("");
  const classes = useStyles();
  let language = state.user.language;

  const getUniqueGameNames = () => {
    const gameNames = [
      ...new Set(state.profile.averageOverallScores.map((a) => a.game_name)),
    ];
    return gameNames;
  };
  React.useEffect(() => {
    setLoading(false);
    setGameType(getUniqueGameNames()[0]);
  }, [state.profile]);

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Typography
            style={{ padding: "20px 0px" }}
            variant="h3"
            align="center"
          >
            <b>{language === "English" ? "Games" : "游戏"}</b>
          </Typography>
          <Grid container className={classes.buttonContainer} spacing={4}>
            {loading
              ? "Loading"
              : getUniqueGameNames().map((a) => {
                  return (
                    <Grid item xs={4} className={classes.button}>
                      <Button
                        onClick={() => setGameType(a)}
                        className={
                          a === gameType ? classes.active : classes.card
                        }
                        variant="contained"
                        colod="primary"
                      >
                        {a}
                      </Button>
                    </Grid>
                  );
                })}
          </Grid>
          <AverageScoresByGame
            child={state.user.selectedChild}
            game={gameType}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography variant="h3" align="center">
            <b>{language === "English" ? "Recent scores" : "最近成绩"} </b>
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <RecentList
            game={gameType}
            child={state.user.selectedChild}
            data={state.profile.recentScores}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default connect((state) => ({ state: state }), null)(AnalyticsGrid);
