import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  ButtonGroup,
  Container,
  TextField,
  Radio,
  radioGroup,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CssBaseline,
  Grid,
} from "@material-ui/core";
import store from "../../redux/store";
import AcUnitOutlinedIcon from "@material-ui/icons/AcUnitOutlined";
import ArrowForwardIosOutlinedIcon from "@material-ui/icons/ArrowForwardIosOutlined";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router";
import LockIcon from "@material-ui/icons/Lock";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import setCookie from "../utils/setCookie";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "../../redux/react-redux-hooks";
import { login, resetSelectedChild } from "../../redux/user/user.actions";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  form_container: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    marginTop: theme.spacing(4),
    minWidth: "40%",
  },
  link: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(3),
  },
  button: {
    marginTop: "15px",
  },
}));

const LoginForm = ({ state, login }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cookie, setCookie, removeCookie] = useCookies(["authorization"]);
  const history = useHistory();
  let language = state.user.language;

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };
  React.useEffect(() => {
    if (state.user.isAuth) {
      setCookie("authorization", state.user.token);
      history.push("/profile");
    }
  }, [state]);

  if (state.user.loadingLogin) {
    return <h1>LOGIN LOGIN</h1>;
  } else {
    return (
      <Container>
        <CssBaseline />
        <div className={classes.form_container}>
          <LockIcon />
          <Typography variant="h3">
            {language === "English" ? "Login" : "登录"}
          </Typography>
          <Typography variant="h3">
            {state.user.loading ? "LOADING" : ""}
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setEmail(e.target.value)}
                  label={state.user.language === "English" ? "Email" : "登录"}
                  variant="outlined"
                  fullWidth
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setPassword(e.target.value)}
                  label={
                    state.user.language === "English" ? "Password" : "密码"
                  }
                  variant="outlined"
                  fullWidth
                  required
                  type="password"
                />
              </Grid>
            </Grid>
            <Container>
              <Typography
                variant="h6"
                color="error"
                style={{ marginTop: "10px" }}
              >
                {state.user.error && state.user.error}
              </Typography>
            </Container>
            <Button
              onClick={(e) => handleSubmit(e)}
              className={classes.button}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              {language === "English" ? "Log in" : "登录"}
            </Button>
            <Grid container>
              <Grid className={classes.link} item xs={12}>
                <Link to="/signup">
                  {language === "English"
                    ? "Don't have an account? Sign up here"
                    : "没有账户？请在这里注册"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
};

export default connect(
  (state) => ({ state: state }),
  (dispatch) => ({
    login: (email, password) => dispatch(login(email, password)),
  })
)(LoginForm);
