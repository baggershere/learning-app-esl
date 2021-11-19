import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

const useStyles = makeStyles({
  media: {
    height: 300,
  },
});

const GameCard = ({ state, name, details, imageUrl, link }) => {
  const classes = useStyles();
  const history = useHistory();
  let language = state.user.language;
  return (
    <Card>
      <CardActionArea onClick={() => history.push("/game/" + link)}>
        <CardMedia className={classes.media} image={imageUrl} title={name} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {details}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="large"
          color="error"
          onClick={() => history.push("/game/" + link)}
        >
          {language === "English" ? "Play" : "玩一下"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default connect((state) => ({ state: state }), null)(GameCard);
