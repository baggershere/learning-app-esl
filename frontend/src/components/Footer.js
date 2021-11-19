import React from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
const useStyles = makeStyles((theme) => {
  return {
    footer: {
      padding: "0px",
      backgroundColor: theme.palette.primary.main,
    },
    text: {
      color: "black",
      textDecoration: "none",
      "&:hover": {
        color: "white",
      },
    },
  };
});

const Footer = ({ state }) => {
  const classes = useStyles();
  let language = state.user.language;
  return (
    <footer className={classes.footer}>
      <Box>
        <Container style={{ padding: "30px" }} maxWidth="lg">
          <Grid container spacing={5}>
            <Grid item xs={12} sm={4}>
              <Box display="flex" justifyContent="center">
                <Typography>
                  <Link to="/" className={classes.text}>
                    {language === "English" ? "Home" : "首页"}
                  </Link>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" justifyContent="center">
                <Typography>
                  <Link to="/profile" className={classes.text}>
                    {language === "English" ? "Profile" : "用户"}
                  </Link>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" justifyContent="center">
                <Typography>
                  <Link to="/" className={classes.text}>
                    {language === "English"
                      ? "Learning Activities"
                      : "学习活动"}
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </footer>
  );
};

export default connect((state) => ({ state: state }), null)(Footer);
