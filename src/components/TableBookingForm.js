import {
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  DialogActions,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";

const TableBooking = (props) => {
  const { open, restaurant } = props;
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [openForm, setOpenForm] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    bookingDateTime: Date.now(),
    guestCount: numberOfGuests,
    mobile: "",
  });

  useEffect(() => {
    setOpenForm(open);
  }, [open]);

  useEffect(() => {
    setBookingDetails({ ...bookingDetails, guestCount: numberOfGuests });
  }, [numberOfGuests]);

  const handleClose = () => {
    setOpenForm(false);
    props.setOpen(false);
  };

  const handleBooking = async () => {
    if (props.user && props.user.user) {
      await axios
        .post(
          `http://localhost:9000/restaurants/tableBooking/${restaurant.businessId}/${props.user.user.customerId}`,
          bookingDetails
        )
        .then(() => handleClose());
    }
  };

  return (
    <>
      <Dialog
        open={openForm}
        onClose={() => handleClose()}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle style={{ textAlign: "center" }}>
          Book a table for restaurant: <b>{restaurant.name}</b>
        </DialogTitle>
        <DialogContent>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "auto",
              width: "fit-content",
            }}
          >
            <div className="row">
              <Typography variant="body1" style={{ marginRight: 20 }}>
                Booking Date and Time:{" "}
              </Typography>
              <TextField
                type="datetime-local"
                value={bookingDetails.bookingDateTime}
                onChange={(e) =>
                  setBookingDetails({
                    ...bookingDetails,
                    bookingDateTime: e.target.value,
                  })
                }
              />
            </div>
            <div className="row" style={{ marginTop: 20 }}>
              <Typography variant="body1" style={{ marginRight: 20 }}>
                Number of Guests:{" "}
              </Typography>
              <ButtonGroup>
                <Button onClick={() => setNumberOfGuests(numberOfGuests + 1)}>
                  +
                </Button>
                <Button>{numberOfGuests}</Button>
                <Button onClick={() => setNumberOfGuests(numberOfGuests - 1)}>
                  -
                </Button>
              </ButtonGroup>
            </div>
            <div className="row" style={{ marginTop: 20 }}>
              <Typography variant="body1" style={{ marginRight: 20 }}>
                Contact Number:{" "}
              </Typography>
              <TextField
                value={bookingDetails.mobile}
                onChange={(e) =>
                  setBookingDetails({
                    ...bookingDetails,
                    mobile: e.target.value,
                  })
                }
              />
            </div>
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
            onClick={() => handleBooking()}
          >
            Book
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

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TableBooking);
