import React from "react";
import { Typography, Container, makeStyles } from "@material-ui/core";
import { connect } from "react-redux";

const useStyles = makeStyles({
  title: {
    padding: "10px 0px",
  },
});

const ListTitle = ({ state }) => {
  const classes = useStyles();
  let language = state.user.language;
  return (
    <Container>
      <Typography className={classes.title} variant="h3" align="center">
        {language === "English" ? "Learning Activities" : "来做个游戏吧！"}
      </Typography>
    </Container>
  );
};

export default connect((state) => ({ state: state }), null)(ListTitle);
