import React, { useEffect, useState } from "react";
import { Paper, TextField, Typography, Button } from "@material-ui/core";
import axios from "axios";
import jwt from "jsonwebtoken";
import { withRouter } from "react-router";

const ResetPassword = (props) => {
  const { token } = props.match.params;
  const [passwordObject, setPasswordObject] = useState({
    password: "",
    confirmPassword: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const [isCustomer, setIsCustomer] = useState(false);

  useEffect(() => {
    const emailData = token ? jwt.verify(token, "foodwebsecretcode") : {};
    console.log(emailData, "email");
    emailData && setUserEmail(emailData.email);
    emailData && setIsCustomer(+emailData.isCustomer === 1);
  }, [token]);

  const handleReset = async () => {
    await axios
      .put(
        `http://localhost:9000/users/${
          isCustomer ? "customer" : "business"
        }/resetPassword`,
        {
          userEmail,
          ...passwordObject,
        }
      )
      .then(() => {
        props.history.push("/signin");
      });
  };

  return (
    <div className="text-center col-12">
      <Paper
        style={{
          width: "50%",
          textAlign: "center",
          margin: "auto",
        }}
      >
        <div style={{ width: "100%", textAlign: "center", margin: "auto" }}>
          <Typography variant="h3">Reset Your Password</Typography>
          <TextField
            placeholder="Password"
            variant="standard"
            style={{ width: "80%", margin: 20 }}
            value={passwordObject.password}
            onChange={(e) =>
              setPasswordObject({ ...passwordObject, password: e.target.value })
            }
          />
          <TextField
            placeholder="Password"
            variant="standard"
            style={{ width: "80%", margin: 20 }}
            type="password"
            value={passwordObject.confirmPassword}
            onChange={(e) =>
              setPasswordObject({
                ...passwordObject,
                confirmPassword: e.target.value,
              })
            }
            error={passwordObject.password !== passwordObject.confirmPassword}
          />
        </div>
        <Button
          variant="contained"
          style={{
            textTransform: "inherit",
            margin: 20,
            backgroundColor: "maroon",
            color: "white",
          }}
          onClick={() => handleReset()}
        >
          Reset
        </Button>
      </Paper>
    </div>
  );
};

export default withRouter(ResetPassword);
