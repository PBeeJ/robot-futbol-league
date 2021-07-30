import React from "react";
import styled from "styled-components";

import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

import BotModeControl from "./botModeControl";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function BotDialog({ bot, isOpen, onClose }) {
  const classes = useStyles();
  if (!bot) {
    return null;
  }

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {bot.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <FormContainer botMode={bot.mode}>
        <div className={classes.toggleContainer}>
          <BotModeControl bot={bot} />
        </div>
      </FormContainer>
    </Dialog>
  );
}

const FormContainer = styled(Container)`
  padding-top: 40px;
`;
