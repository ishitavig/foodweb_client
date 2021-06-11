import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@material-ui/core";
import axios from "axios";

const ForgotPasswordForm = (props) => {
  const { open, isCustomer } = props;
  const [openForm, setOpenForm] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setOpenForm(open);
  }, [open]);

  const handleClose = () => {
    setOpenForm(false);
    props.setOpen(false);
    setEmail("");
  };

  const handleForgotPassword = async () => {
    await axios
      .post(`/users/${isCustomer ? "customer" : "business"}/forgotPassword`, {
        email,
      })
      .then(() => handleClose());
  };

  return (
    <Dialog
      open={openForm}
      onClose={() => handleClose()}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle style={{ textAlign: "center" }}>
        Please enter your email and we'll send you a link to reset your
        password.
      </DialogTitle>
      <DialogContent>
        <div
          className="text-center"
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            marginBottom: 20,
          }}
        >
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            variant="outlined"
            style={{ marginBottom: 20 }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          style={{
            textTransform: "inherit",
            backgroundColor: "maroon",
            color: "white",
            margin: 10,
          }}
          onClick={() => handleForgotPassword()}
        >
          Send Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordForm;
