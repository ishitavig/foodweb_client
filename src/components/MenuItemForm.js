import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormGroup,
  TextField,
  FormControlLabel,
  Switch,
  DialogActions,
  Button,
  InputLabel,
  Input,
  InputAdornment,
  FormControl,
} from "@material-ui/core";
import { AttachMoney } from "@material-ui/icons";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { SERVER_LINK } from "../constants";

const MenuItemForm = (props) => {
  const { open } = props;
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [itemDetails, setItemDetails] = useState({
    itemName: "",
    price: "",
    availabilityStatus: 1,
  });

  useEffect(() => {
    setOpenForm(open);
  }, [open]);

  const handleClose = () => {
    setOpenForm(false);
    props.setOpen(false);
    props.setEditing(false);
    setItemDetails({
      itemName: "",
      price: "",
      availabilityStatus: 1,
    });
  };

  useEffect(() => {
    if (props.edit) {
      setEditing(props.edit);
      setItemDetails({
        itemName: props.item.itemName,
        price: props.item.price,
        availabilityStatus: props.item.availabilityStatus || 0,
      });
    } else {
      setEditing(false);
    }
  }, [props.edit, props.item]);

  const handleAddItem = async () => {
    if (props.user && props.user.user && props.user.user.businessId) {
      if (editing && props.item) {
        await axios.put(
          `${SERVER_LINK}/restaurants/updateMenuItem/${props.user.user.businessId}/${props.item.itemId}`,
          itemDetails
        );
        props.updateItem({ ...props.item, ...itemDetails });
        handleClose();
      } else {
        await axios.post(
          `${SERVER_LINK}/restaurants/addMenuItem/${props.user.user.businessId}`,
          itemDetails
        );
        props.updateItem({ ...props.item, ...itemDetails });
        handleClose();
      }
    }

    setItemDetails({
      itemName: "",
      price: "",
      availabilityStatus: 1,
    });
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
          {editing ? "Edit" : "Add"} Item
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
              value={itemDetails.itemName}
              onChange={(e) =>
                setItemDetails({ ...itemDetails, itemName: e.target.value })
              }
              placeholder="Name"
              style={{ width: "90%", margin: 20 }}
            />
            <FormControl style={{ width: "90%", margin: 20 }}>
              <InputLabel htmlFor="price">Price</InputLabel>
              <Input
                id="price"
                startAdornment={
                  <InputAdornment position="start">
                    <AttachMoney />
                  </InputAdornment>
                }
                value={itemDetails.price}
                onChange={(e) => {
                  return !isNaN(e.target.value)
                    ? setItemDetails({ ...itemDetails, price: e.target.value })
                    : "";
                }}
              />
            </FormControl>
            <FormGroup
              style={{ textAlign: "center", width: "90%", margin: 20 }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={itemDetails.availabilityStatus === 1}
                    onChange={() => {
                      setItemDetails({
                        ...itemDetails,
                        availabilityStatus:
                          itemDetails.availabilityStatus === 1 ? 0 : 1,
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
            onClick={() => handleAddItem()}
          >
            {editing ? "Update" : "Add"}
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

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemForm);
