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
import { updateUser } from "../store/actions/usersAction";
import { SERVER_LINK } from "../constants";

const PurchaseForm = (props) => {
  const { open, plan } = props;
  const [openForm, setOpenForm] = useState(false);
  const elements = useElements();
  const stripe = useStripe();

  useEffect(() => {
    setOpenForm(open);
  }, [open]);

  const handleClose = () => {
    setOpenForm(false);
    props.setOpen(false);
  };

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    const cardElements = elements.getElement(CardElement);
    const result = await axios.post(
      `${SERVER_LINK}/advertisements/purchasePlan/${+props.user
        .businessId}/${+plan.planId}`,
      { email: props.user.email }
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
            props.updateUser("business", props.user.businessId);
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
        Purchase {plan.name}: $ {plan.price}
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

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseForm);
