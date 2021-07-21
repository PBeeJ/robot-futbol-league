import React from "react";
import Button from "@material-ui/core/Button";

import { ConfirmDialog } from "./confirmDialog";

const CONFIRM_QUESTION = "Are you sure you want to end the game?";
const CONFIRM_HELP_TEXT =
  "Ending the game is not resumable and a new game will need to be started";

export function ConfirmDialogEndGame({ isOpen, onCancel, onConfirm }) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      confirmQuestion={CONFIRM_QUESTION}
      helpText={CONFIRM_HELP_TEXT}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
