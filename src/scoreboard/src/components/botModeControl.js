import styled from "styled-components";
import React, { useState } from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

import { Button, Grid, Slider } from "@material-ui/core";
import { BOT_MODES, BOT_MODE_NAMES } from "../selectors/enums";
import { sendBotMode, sendManualPosition } from "../websockets";
import { Label } from "./styledComponents";

export default function BotModeControl({ bot }) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
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
    <Grid style={{ display: "grid", gridGap: 20 }}>
      <OurContainer botMode={bot.mode}>
        <Label>BotMode</Label>
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
      </OurContainer>
      <OurContainer botMode={bot.mode}>
        <Label>X position</Label>
        <Slider
          style={{ marginTop: 10 }}
          label="x postition"
          value={x}
          onChange={(e, value) => setX(value)}
          step={0.1}
          valueLabelDisplay="on"
          max={10}
          min={-10}
        />
        <Label>Y position</Label>
        <Slider
          style={{ marginTop: 10, marginBottom: 10 }}
          label="y postition"
          value={y}
          onChange={(e, value) => setY(value)}
          step={0.1}
          valueLabelDisplay="on"
          max={5}
          min={-5}
        />
        <Button
          style={{ marginTop: 10, marginBottom: 10 }}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            sendManualPosition(0, x, y);
          }}
        >
          Send Manual position
        </Button>
      </OurContainer>
    </Grid>
  );
}

const OurContainer = styled(FormControl)`
  padding: 10px;
  background-color: ${(props) =>
    props.botMode === BOT_MODES.auto
      ? "rgba(0, 128, 28, .5)"
      : props.botMode === 1
      ? "rgba(128, 0, 28, .5)"
      : "rgba(64, 64, 28, .4)"};
`;
