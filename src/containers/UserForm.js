import {
  Paper,
  TextField,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  Grid,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { setUser } from "../store/actions/usersAction";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const UserForm = (props) => {
  const [isCustomer, setIsCustomer] = useState(true);
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    customer: true,
    abn: "",
    tableBookingStatus: 0,
    foodOrderStatus: 0,
    address: "",
    openingHoursFrom: "",
    openingHoursTo: "",
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
    setFormDetails({ ...formDetails, customer: isCustomer });
    if (isSignUp) {
      return await axios.post(
        `http://localhost:9000/users/${
          isCustomer ? "customer" : "business"
        }/signup`,
        formDetails
      );
    } else {
      return await axios
        .post(
          `http://localhost:9000/users/${
            isCustomer ? "customer" : "business"
          }/signin`,
          formDetails
        )
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
          <Typography variant="h3">
            Sign {isSignUp ? "Up" : "In"} as{" "}
            {isCustomer ? "Customer" : "Business"}
          </Typography>
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
            type="password"
            value={formDetails.password}
            onChange={(e) =>
              setFormDetails({ ...formDetails, password: e.target.value })
            }
          />
          {isSignUp && (
            <>
              <TextField
                placeholder="Mobile"
                variant="standard"
                style={{ width: "80%", margin: 20 }}
                value={formDetails.mobile}
                onChange={(e) =>
                  setFormDetails({ ...formDetails, mobile: e.target.value })
                }
              />
              {!isCustomer && (
                <>
                  <TextField
                    placeholder="ABN"
                    variant="standard"
                    style={{ width: "80%", margin: 20 }}
                    value={formDetails.abn}
                    onChange={(e) =>
                      setFormDetails({ ...formDetails, abn: e.target.value })
                    }
                  />
                  <TextField
                    placeholder="Address"
                    variant="standard"
                    style={{ width: "80%", margin: 20 }}
                    value={formDetails.address}
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        address: e.target.value,
                      })
                    }
                  />
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardTimePicker
                        margin="normal"
                        label="Opening Hours From"
                        value={formDetails.openingHoursFrom}
                        onChange={(date) =>
                          setFormDetails({
                            ...formDetails,
                            openingHoursFrom: date,
                          })
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change time",
                        }}
                      />
                      <KeyboardTimePicker
                        margin="normal"
                        label="Opening Hours To"
                        value={formDetails.openingHoursTo}
                        onChange={(date) =>
                          setFormDetails({
                            ...formDetails,
                            openingHoursTo: date,
                          })
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change time",
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  <FormGroup
                    row
                    style={{
                      width: "80%",
                      margin: "auto",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formDetails.tableBookingStatus === 1}
                          onChange={() => {
                            setFormDetails({
                              ...formDetails,
                              tableBookingStatus:
                                formDetails.tableBookingStatus === 1 ? 0 : 1,
                            });
                          }}
                        />
                      }
                      label="Allow Table Booking"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formDetails.foodOrderStatus === 1}
                          onChange={() => {
                            setFormDetails({
                              ...formDetails,
                              foodOrderStatus:
                                formDetails.foodOrderStatus === 1 ? 0 : 1,
                            });
                          }}
                        />
                      }
                      label="Allow Online Food Orders"
                    />
                  </FormGroup>
                </>
              )}
            </>
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
          onClick={() => {
            if (isCustomer) {
              handleSubmit();
            } else {
              setFormDetails({
                name: "",
                email: "",
                password: "",
                mobile: "",
                customer: true,
                abn: "",
                tableBookingStatus: 0,
                foodOrderStatus: 0,
              });
              setIsCustomer(true);
            }
          }}
        >
          Sign {isSignUp ? "Up" : "In"} {!isCustomer ? "as Customer" : ""}
        </Button>
        <Button
          variant="contained"
          style={{
            textTransform: "inherit",
            margin: 20,
            backgroundColor: "maroon",
            color: "white",
          }}
          onClick={() => {
            if (isCustomer) {
              setFormDetails({
                name: "",
                email: "",
                password: "",
                mobile: "",
                customer: false,
                abn: "",
                tableBookingStatus: 0,
                foodOrderStatus: 0,
              });
              setIsCustomer(false);
            } else {
              handleSubmit();
            }
          }}
        >
          Sign {isSignUp ? "Up" : "In"} {isCustomer ? "as Business" : ""}
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
