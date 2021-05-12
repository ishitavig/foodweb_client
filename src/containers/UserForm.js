import { Paper, TextField, Typography, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { setUser } from "../store/actions/usersAction";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const UserForm = (props) => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (props.match.url === "/signup") {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }
  }, [props.match.url]);

  const handleSubmit = async () => {
    if (isSignUp) {
      const result = await axios.post(
        "http://localhost:9000/users/signup",
        formDetails
      );
    } else {
      const result = await axios
        .post("http://localhost:9000/users/signin", formDetails)
        .then((res) => {
          if (res.data && res.data.token) {
            res.data && props.setUser(res.data);
            localStorage.setItem("user", res.data.token);
            props.history.push("/");
          }
        })
        .catch((error) =>
          console.error(
            `There was an error logging in user ${formDetails.email} note: ${error}`
          )
        );
      console.log(result, "result");
    }
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
          <Typography variant="h3">Sign {isSignUp ? "Up" : "In"}</Typography>
          {isSignUp && (
            <TextField
              placeholder="Name"
              variant="standard"
              style={{ width: "80%", margin: 20 }}
              value={formDetails.name}
              onChange={(e) =>
                setFormDetails({ ...formDetails, name: e.target.value })
              }
            />
          )}
          <TextField
            placeholder="Email"
            variant="standard"
            style={{ width: "80%", margin: 20 }}
            value={formDetails.email}
            onChange={(e) =>
              setFormDetails({ ...formDetails, email: e.target.value })
            }
          />
          <TextField
            placeholder="Password"
            variant="standard"
            style={{ width: "80%", margin: 20 }}
            value={formDetails.password}
            onChange={(e) =>
              setFormDetails({ ...formDetails, password: e.target.value })
            }
          />
          {isSignUp && (
            <TextField
              placeholder="Mobile"
              variant="standard"
              style={{ width: "80%", margin: 20 }}
              value={formDetails.mobile}
              onChange={(e) =>
                setFormDetails({ ...formDetails, mobile: e.target.value })
              }
            />
          )}
        </div>
        <Button
          variant="contained"
          style={{
            textTransform: "inherit",
            margin: 20,
            backgroundColor: "maroon",
            color: "white",
          }}
          onClick={handleSubmit}
        >
          Sign {isSignUp ? "Up" : "In"}
        </Button>
      </Paper>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (data) => dispatch(setUser(data)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UserForm)
);
