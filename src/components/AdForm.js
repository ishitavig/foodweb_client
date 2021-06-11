import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextareaAutosize,
  TextField,
  FormGroup,
  Switch,
  FormControlLabel,
  DialogActions,
  Button,
  Grid,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import axios from "axios";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { SERVER_LINK } from "../constants";

const AdForm = (props) => {
  const { open } = props;
  const [openForm, setOpenForm] = useState(false);
  const [adDetails, setAdDetails] = useState({
    heading: "",
    content: "",
    visibilityStatus: false,
    startDate: moment(),
    endDate: moment().add("days", 7),
    planId: props.user.planId,
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setOpenForm(open);
  }, [open]);

  const handleClose = () => {
    setOpenForm(false);
    props.setOpen(false);
    props.setEditing(false);
    setAdDetails({
      heading: "",
      content: "",
      visibilityStatus: true,
      startDate: moment(),
      endDate: moment().add("days", 7),
      planId: props.user.planId,
    });
  };

  useEffect(() => {
    if (props.edit) {
      setEditing(props.edit);
      setAdDetails({
        heading: props.item.heading,
        content: props.item.content,
        visibilityStatus: props.item.visibilityStatus,
        startDate: props.item.startDate,
        endDate: props.item.endDate,
        planId: props.user.planId,
      });
    } else {
      setEditing(false);
    }
  }, [props.edit, props.item]);

  const handleCreateAd = async () => {
    if (props.user && props.user.businessId) {
      if (editing && props.item) {
        await axios.put(
          `${SERVER_LINK}/advertisements/update/${props.user.businessId}/${props.item.adId}`,
          adDetails
        );
        props.updateItem({ ...props.item, ...adDetails });
        handleClose();
      } else {
        await axios
          .post(
            `${SERVER_LINK}/advertisements/create/${props.user.businessId}`,
            adDetails
          )
          .then(() => {
            handleClose();
          });
      }
    }

    setAdDetails({
      heading: "",
      content: "",
      visibilityStatus: true,
      startDate: moment(),
      endDate: moment().add("days", 7),
      planId: props.user.planId,
    });
  };

  return (
    <Dialog
      open={openForm}
      onClose={() => handleClose()}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle style={{ textAlign: "center" }}>
        {editing ? "Update" : "Create an"} Ad
      </DialogTitle>
      <DialogContent>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <TextField
            value={adDetails.heading}
            onChange={(e) =>
              setAdDetails({ ...adDetails, heading: e.target.value })
            }
            style={{ width: "90%", margin: 20 }}
            placeholder="Heading"
          />
          <TextareaAutosize
            value={adDetails.content}
            onChange={(e) =>
              setAdDetails({ ...adDetails, content: e.target.value })
            }
            style={{ width: "90%", margin: 20, padding: 10 }}
            placeholder="Content"
          />
          <div className="row" style={{ width: "100%", margin: 10 }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-around">
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  label="Start Date"
                  value={adDetails.startDate}
                  onChange={(date) =>
                    setAdDetails({ ...adDetails, startDate: date })
                  }
                  KeyboardButtonProps={{
                    "aria-label": "start date",
                  }}
                />{" "}
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  label="End Date"
                  value={adDetails.endDate}
                  onChange={(date) =>
                    setAdDetails({ ...adDetails, endDate: date })
                  }
                  KeyboardButtonProps={{
                    "aria-label": "end date",
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </div>
          <FormGroup style={{ textAlign: "center", width: "90%", margin: 20 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={adDetails.visibilityStatus === 1}
                  onChange={() => {
                    setAdDetails({
                      ...adDetails,
                      visibilityStatus:
                        adDetails.visibilityStatus === 1 ? 0 : 1,
                    });
                  }}
                />
              }
              label="Available"
            />
          </FormGroup>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          style={{
            textTransform: "inherit",
            backgroundColor: "maroon",
            color: "white",
          }}
          onClick={() => handleCreateAd()}
        >
          {editing ? "Update" : "Create"}
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
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AdForm);
