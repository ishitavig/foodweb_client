import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { updateUser } from "../store/actions/usersAction";

const FoodOrderForm = (props) => {
  const { open, businessId, selectedItems, orderDetails, totalBill } = props;
  const [openForm, setOpenForm] = useState(false);
  const elements = useElements();
  const stripe = useStripe();

  useEffect(() => {
    setOpenForm(open);
  }, [open]);

  const handleClose = () => {
    setOpenForm(false);
    props.setTotalBill(0);
    props.setOpen(false);
  };

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    const cardElements = elements.getElement(CardElement);
    const result = await axios.post(
      `/restaurants/createFoodOrder/${businessId}/${props.user.customerId}`,
      { itemIds: selectedItems, ...orderDetails }
    );
    if (result.data) {
      stripe
        .confirmCardPayment(result.data.clientSecret, {
          payment_method: {
            card: cardElements,
            billing_details: {
              name: props.user.name,
            },
          },
        })
        .then((res) => {
          if (res.error) {
            alert(res.error.message);
          } else {
            props.history.push("/restaurants");
          }
        });
    }
    handleClose();
  };

  return (
    <Dialog
      open={openForm}
      onClose={() => handleClose()}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle style={{ textAlign: "center" }}>
        Complete Payment for ${parseFloat(totalBill).toFixed(2)}
      </DialogTitle>
      <DialogContent>
        <CardElement />
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
          onClick={() => handlePayment()}
        >
          Pay
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
  return {
    updateUser: (userType, userId) => dispatch(updateUser(userType, userId)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FoodOrderForm)
);
