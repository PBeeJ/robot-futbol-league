import React from "react";
import styled from "styled-components";

import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import { BOT_MODES, BOT_MODE_NAMES } from "../selectors/enums";
import { sendBotMode } from "../websockets";

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

  const handleBotModeChange = (evt) => {
    const newMode = parseInt(evt.target.value, 10);
    sendBotMode(bot.index, newMode);
    // update bot.mode directly to be more responsive
    // eslint-disable-next-line
    bot.mode = newMode;
  };

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
          <Grid container spacing={2}>
            <Grid item>
              <FormControl component="fieldset">
                <FormLabel component="legend">BotMode</FormLabel>
                <RadioGroup
                  aria-label="bot mode"
                  name="botMode1"
                  value={bot.mode}
                  onChange={handleBotModeChange}
                >
                  <FormControlLabel
                    value={BOT_MODES.manual}
                    control={<Radio />}
                    label={BOT_MODE_NAMES[BOT_MODES.manual]}
                  />
                  <FormControlLabel
                    value={BOT_MODES.auto}
                    control={<Radio />}
                    label={BOT_MODE_NAMES[BOT_MODES.auto]}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </div>
      </FormContainer>
    </Dialog>
  );
}

const FormContainer = styled(Container)`
  padding-top: 40px;
  background-color: ${(props) =>
    props.botMode === 0
      ? "rgba(0, 128, 28, .5)"
      : props.$botMode === 1
      ? "rgba(128, 0, 28, .5)"
      : "rgba(64, 64, 28, .4)"};
`;
