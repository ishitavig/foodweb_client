import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateUser } from "../store/actions/usersAction";
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
import axios from "axios";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { withRouter } from "react-router";

const Profile = (props) => {
  const [userDetails, setUserDetails] = useState({});
  const [isCustomer, setIsCustomer] = useState(true);

  useEffect(() => {
    if (Object.keys(props.user).length === 0) {
      return props.history.push("/");
    }

    if (props.user.customerId) {
      setIsCustomer(true);
    } else {
      setIsCustomer(false);
    }
    setUserDetails(props.user);
  }, [props.user]);

  const updateDetails = async () => {
    await axios.put(
      `/users/${isCustomer ? "customer" : "business"}/${
        isCustomer ? userDetails.customerId : userDetails.businessId
      }`,
      userDetails
    );
    if (props.user) {
      props.updateUser(
        isCustomer ? "customer" : "business",
        isCustomer ? userDetails.customerId : userDetails.businessId
      );
    }
  };

  return (
    <>
      <div className="text-center col-12">
        <Paper
          style={{
            width: "50%",
            textAlign: "center",
            margin: "auto",
          }}
        >
          <div style={{ width: "100%", textAlign: "center", margin: "auto" }}>
            <Typography variant="h3">My Profile</Typography>

            <TextField
              placeholder="Name"
              variant="outlined"
              label="Name"
              style={{ width: "80%", margin: 20 }}
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
            />

            <TextField
              placeholder="Email"
              variant="outlined"
              label="Email"
              style={{ width: "80%", margin: 20 }}
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
            />
            <>
              <TextField
                placeholder="Mobile"
                variant="outlined"
                label="Mobile"
                style={{ width: "80%", margin: 20 }}
                value={userDetails.mobile}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, mobile: e.target.value })
                }
              />
              {!isCustomer && (
                <>
                  <TextField
                    placeholder="ABN"
                    variant="outlined"
                    label="ABN"
                    style={{ width: "80%", margin: 20 }}
                    value={userDetails.abn}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, abn: e.target.value })
                    }
                  />
                  <TextField
                    placeholder="Address"
                    variant="outlined"
                    label="Address"
                    style={{ width: "80%", margin: 20 }}
                    value={userDetails.address}
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        address: e.target.value,
                      })
                    }
                  />
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardTimePicker
                        margin="normal"
                        label="Opening Hours From"
                        value={userDetails.openingHoursFrom}
                        onChange={(date) =>
                          setUserDetails({
                            ...userDetails,
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
                        value={userDetails.openingHoursTo}
                        onChange={(date) =>
                          setUserDetails({
                            ...userDetails,
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
                          checked={userDetails.tableBookingStatus === 1}
                          onChange={() => {
                            setUserDetails({
                              ...userDetails,
                              tableBookingStatus:
                                userDetails.tableBookingStatus === 1 ? 0 : 1,
                            });
                          }}
                        />
                      }
                      label="Allow Table Booking"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={userDetails.foodOrderStatus === 1}
                          onChange={() => {
                            setUserDetails({
                              ...userDetails,
                              foodOrderStatus:
                                userDetails.foodOrderStatus === 1 ? 0 : 1,
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
          </div>
          <Button
            variant="contained"
            style={{
              textTransform: "inherit",
              margin: 20,
              backgroundColor: "maroon",
              color: "white",
            }}
            onClick={() => updateDetails()}
          >
            Update
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
              setUserDetails(props.user);
            }}
          >
            Cancel
          </Button>
        </Paper>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (userType, userId) => dispatch(updateUser(userType, userId)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Profile)
);
