import React from "react";
import Button from "@material-ui/core/Button";

import { ConfirmDialog } from "./confirmDialog";

const CONFIRM_QUESTION = "Start game with bots in Manual mode?";
const CONFIRM_HELP_TEXT = `
The bots come up in manual mode to prevent them flying off the bench when plugged in.
Select "Select 'Switch bots to auto and start game' below to first switch bots into autonomous mode
`;

export function ConfirmDialogStartWithBotsOffline({
  isOpen,
  onCancel,
  onConfirmAsIs,
  onConfirmSwitchToAuto,
}) {
  const confirmButtons = (
    <>
      <Button onClick={onCancel}>Cancel</Button>
      <Button onClick={onConfirmAsIs}>Start as is</Button>
      <Button onClick={onConfirmSwitchToAuto} color="primary" autoFocus>
        Switch bots to auto and start game!
      </Button>{" "}
    </>
  );
  return (
    <ConfirmDialog
      isOpen={isOpen}
      confirmQuestion={CONFIRM_QUESTION}
      helpText={CONFIRM_HELP_TEXT}
      buttons={confirmButtons}
    />
  );
}
