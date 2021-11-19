import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Container,
  TextField,
  CssBaseline,
  Grid,
} from "@material-ui/core";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router";
import LockIcon from "@material-ui/icons/Lock";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "../../redux/react-redux-hooks";
import { signupUser, resetState } from "../../redux/signup/signup.actions";

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
const SignupForm = ({ state, signupUser, resetState }) => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const classes = useStyles();
  let language = state.user.language;

  const handleSubmit = async (e) => {
    e.preventDefault();
    signupUser(email, name, password);
    console.log();
  };

  React.useEffect(() => {
    if (state.signup.success === true) {
      resetState();
      history.push("/login");
    }
  }, [state.signup]);

  if (state.signup.loading) {
    return <h1>LOADING SIGNUP</h1>;
  } else {
    return (
      <Container data-test="signupComponent">
        <CssBaseline />
        <div className={classes.form_container}>
          <LockIcon />
          <Typography variant="h3">
            {language === "English" ? "Sign Up" : "注册"}
          </Typography>
          <form data-test="signupForm" className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setName(e.target.value)}
                  label={language === "English" ? "Full Name" : "姓名"}
                  variant="outlined"
                  fullWidth
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setEmail(e.target.value)}
                  label={language === "English" ? "Email" : "电子邮箱"}
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setPassword(e.target.value)}
                  label={language === "English" ? "Password" : "密码"}
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
                {state.signup.error ? <p>{state.signup.error.message}</p> : ""}
              </Typography>
            </Container>
            <Button
              onClick={handleSubmit}
              className={classes.button}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              {language === "English" ? "Sign up" : "注册"}
            </Button>
            <Grid container>
              <Grid className={classes.link} item xs={12}>
                <Link to="/login">
                  {language === "English"
                    ? "Already have an account? Login"
                    : "没有账户？请在这里注册"}{" "}
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
  (state) => {
    return {
      state: state,
    };
  },
  (dispatch) => ({
    signupUser: (email, name, password) =>
      dispatch(signupUser(email, name, password)),
    resetState: () => dispatch(resetState()),
  })
)(SignupForm);
