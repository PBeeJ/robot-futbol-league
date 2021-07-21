import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export function ConfirmDialog({
  isOpen,
  confirmQuestion,
  helpText,
  onConfirm,
  onCancel,
  buttons,
}) {
  const defaultButtons = (
    <>
      <Button onClick={onCancel} color="default">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="primary" autoFocus>
        Do it!
      </Button>{" "}
    </>
  );
  const renderButtons = buttons || defaultButtons;

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{confirmQuestion}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {helpText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>{renderButtons}</DialogActions>
    </Dialog>
  );
}
