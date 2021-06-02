import { Dialog, DialogActions, DialogTitle, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";

const ConfirmDialog = (props) => {
  const { open } = props;
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    setOpenForm(open);
  }, [open]);

  const handleClose = () => {
    setOpenForm(false);
    props.setOpen(false);
  };

  return (
    <>
      <Dialog open={openForm} onClose={() => handleClose()} maxWidth="sm">
        <DialogTitle style={{ textAlign: "center" }}>
          Are you sure you want to delete this item?
        </DialogTitle>
        <DialogActions>
          <Button
            variant="contained"
            style={{
              textTransform: "inherit",
              backgroundColor: "maroon",
              color: "white",
            }}
            onClick={() => {
              props.confirmDelete();
              handleClose();
            }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleClose()}
            style={{
              textTransform: "inherit",
              color: "maroon",
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmDialog;
