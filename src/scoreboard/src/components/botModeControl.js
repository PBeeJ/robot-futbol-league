import React from "react";
import styled from "styled-components";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

import { BOT_MODES, BOT_MODE_NAMES } from "../selectors/enums";
import { sendBotMode } from "../websockets";
import { Label } from "./styledComponents";

export default function BotModeControl({ bot }) {
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
