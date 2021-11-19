import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  makeStyles,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import React, { useState } from "react";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "../../redux/react-redux-hooks";
import { SET_SELECTED_CHILD } from "../../redux/user/user.types";
import { capitalize } from "../utils/capitalize";
import { removeChild } from "../../redux/API/API.actions";
import { resetSelectedChild } from "../../redux/user/user.actions";

const useStyles = makeStyles((theme) => {
  return {
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

const ChildCard = ({
  name,
  state,
  resetSelectedChild,
  removeChild,
  setSelectedChild,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  let language = state.user.language;

  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);
    if (state.user.selectedChild === name) {
      resetSelectedChild();
    }
    removeChild(name);
  };

  const handleCardClick = (e) => {
    e.stopPropagation();
    setSelectedChild(name);
  };

  return (
    <React.Fragment>
      <Card>
        <CardActionArea onClick={handleCardClick}>
          <CardContent
            className={
              state.user.selectedChild === name ? classes.active : classes.card
            }
          >
            <Typography align="center" variant="h4">
              {capitalize(name)}
            </Typography>
            <Button onClick={handleOpen}>
              {language === "English" ? "Delete" : "删除"}
            </Button>
          </CardContent>
        </CardActionArea>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {language === "English" ? "Delete User" : "删除用户"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {language === "English"
              ? "Are you sure you want to delete this user?"
              : "你确定要删除用户吗？"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {language === "English" ? "No" : "否"}
          </Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
            {language === "English" ? "Yes" : "确定"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default connect(
  (state) => {
    return {
      state: state,
    };
  },
  (dispatch) => ({
    setSelectedChild: (name) =>
      dispatch({ type: SET_SELECTED_CHILD, payload: name }),
    resetSelectedChild: () => dispatch(resetSelectedChild()),
    removeChild: (name) => dispatch(removeChild(name)),
  })
)(ChildCard);
