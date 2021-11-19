import axios from "axios";
import AnalyticsGrid from "../components/profile/AnalyticsGrid";
import React from "react";
import { useHistory } from "react-router";
import Navbar from "../components/Navbar";
import ProfileChildren from "../components/profile/ProfileChildren";
import { fetchProfileInfo } from "../redux/API/API.actions";
import { connect } from "react-redux";
import Footer from "../components/Footer";
import {
  CircularProgress,
  CurcularProgress,
  makeStyles,
} from "@material-ui/core";

axios.defaults.withCredentials = true;
const useStyles = makeStyles((theme) => {
  return {
    loading: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  };
});
const Profile = ({ fetchProfileInfo, state }) => {
  const classes = useStyles();
  const history = useHistory();

  React.useEffect(() => {
    console.log("ran");
    if (!state.user.isAuth) {
      history.push("/login");
    }
    if (state.user.isAuth) {
      fetchProfileInfo();
    }
  }, []);

  if (state.profile.loading) {
    return (
      <React.Fragment>
        <Navbar />
        <div className={classes.loading}>
          <h1>Loading</h1>
          <CircularProgress />
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <ProfileChildren children={state.profile.children} />
        <AnalyticsGrid />
        <Footer />
      </div>
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
    fetchProfileInfo: () => dispatch(fetchProfileInfo()),
  })
)(Profile);
