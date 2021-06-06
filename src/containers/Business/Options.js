import {
  Paper,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
  Divider,
  Tooltip,
  Fab,
  IconButton,
  Chip,
} from "@material-ui/core";
import { Add, Delete, Edit } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MenuItemForm from "../../components/MenuItemForm";
import axios from "axios";
import ConfirmDialog from "../../components/ConfirmDialog";
import { updateUser } from "../../store/actions/usersAction";

const Options = (props) => {
  const [tableBooking, setTableBooking] = useState(0);
  const [onlineFoodOrder, setOnlineFoodOrder] = useState(0);
  const [foodMenu, setFoodMenu] = useState([]);
  const [addItem, setAddItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (props.user && props.user.user && props.user.user.businessId) {
      setTableBooking(+props.user.user.tableBookingStatus);
      setOnlineFoodOrder(+props.user.user.foodOrderStatus);
    }
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      if (props.user && props.user.user && props.user.user.businessId) {
        const result = await axios.get(
          `http://localhost:9000/restaurants/menu/${props.user.user.businessId}/getAll`
        );
        if (result.data && result.data.length !== 0) {
          setFoodMenu(result.data);
        } else {
          setFoodMenu([]);
        }
      }
    };
    fetchMenu();
  }, []);

  const handleDeleteItem = async () => {
    await axios.delete(
      `http://localhost:9000/restaurants/deleteMenuItem/${props.user.user.businessId}/${selectedItem.itemId}`
    );
    setFoodMenu(
      foodMenu.filter((item) => +item.itemId !== +selectedItem.itemId)
    );
  };

  const handleUpdateMenu = (data) => {
    const existingItem = foodMenu
      .map((item) => +item.itemId)
      .includes(data.itemId);
    if (!existingItem) {
      setFoodMenu([...foodMenu, data]);
    } else {
      setFoodMenu(
        foodMenu.map((item) =>
          +item.itemId === +data.itemId ? { ...item, ...data } : item
        )
      );
    }
  };

  const updateTableBooking = async () => {
    setTableBooking(tableBooking === 1 ? 0 : 1);
    await axios.put(
      `http://localhost:9000/users/business/${props.user.user.businessId}`,
      { tableBookingStatus: tableBooking === 1 ? 0 : 1 }
    );
    if (props.user && props.user.user) {
      props.updateUser(
        props.user.user.businessId ? "business" : "customer",
        props.user.user.businessId
          ? props.user.user.businessId
          : props.user.user.customerId
      );
    }
  };

  const updateOnlineFoodOrder = async () => {
    setOnlineFoodOrder(onlineFoodOrder === 1 ? 0 : 1);
    await axios.put(
      `http://localhost:9000/users/business/${props.user.user.businessId}`,
      { foodOrderStatus: onlineFoodOrder === 1 ? 0 : 1 }
    );
    if (props.user && props.user.user) {
      props.updateUser(
        props.user.user.businessId ? "business" : "customer",
        props.user.user.businessId
          ? props.user.user.businessId
          : props.user.user.customerId
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
        <Typography
          variant="h5"
          style={{ fontFamily: "cursive", color: "maroon" }}
        >
          Business Options
        </Typography>
        <FormGroup row style={{ paddingLeft: "25%" }}>
          <FormControlLabel
            control={
              <Switch
                checked={tableBooking === 1}
                onChange={() => {
                  updateTableBooking();
                }}
              />
            }
            label="Allow Table Booking"
          />
          <FormControlLabel
            control={
              <Switch
                checked={onlineFoodOrder === 1}
                onChange={() => {
                  updateOnlineFoodOrder();
                }}
              />
            }
            label="Allow Online Food Orders"
          />
        </FormGroup>
      </Paper>
      <Divider style={{ margin: 20 }} />
      {onlineFoodOrder === 1 && (
        <>
          <Paper
            style={{
              width: "50%",
              textAlign: "center",
              margin: "auto",
              position: "relative",
            }}
          >
            <div
              style={{
                textAlign: "center",
                margin: 20,
                color: "maroon",
              }}
            >
              <Typography variant="h5" style={{ fontFamily: "cursive" }}>
                Food Menu
              </Typography>
              <div style={{ position: "absolute", top: 5, right: 50 }}>
                <Tooltip title="Create New Item" aria-label="add">
                  <Fab color="secondary" onClick={() => setAddItem(true)}>
                    <Add />
                  </Fab>
                </Tooltip>
              </div>
            </div>
            {foodMenu.length === 0 ? (
              <>
                <Typography variant="h6">
                  Currently you have no items in menu. Please add items to view
                  them in this list.
                </Typography>
              </>
            ) : (
              <div style={{ padding: 50, position: "relative" }}>
                {" "}
                {foodMenu.map((item) => {
                  return (
                    <>
                      <div className="row" style={{ margin: 10 }}>
                        <Typography
                          variant="h5"
                          style={{ fontWeight: "bold", marginRight: 20 }}
                        >
                          {item.itemName}
                        </Typography>
                        <Typography
                          variant="h6"
                          style={{ fontWeight: "bold", marginRight: 20 }}
                        >
                          $ {item.price}
                        </Typography>
                        <Chip
                          label={
                            item.availabilityStatus === 1
                              ? "Available"
                              : "Unavailable"
                          }
                          disabled={item.availabilityStatus === 0}
                          style={{ backgroundColor: "maroon", color: "white" }}
                        />
                        <div style={{ position: "absolute", right: 150 }}>
                          <IconButton
                            onClick={() => {
                              setSelectedItem(item);
                              setAddItem(true);
                              setEditing(true);
                            }}
                          >
                            <Edit style={{ color: "maroon" }} />
                          </IconButton>
                        </div>
                        <div style={{ position: "absolute", right: 100 }}>
                          <IconButton
                            onClick={() => {
                              setSelectedItem(item);
                              setDeleteDialog(true);
                            }}
                          >
                            <Delete style={{ color: "maroon" }} />
                          </IconButton>
                        </div>
                      </div>
                      <Divider />
                    </>
                  );
                })}
              </div>
            )}
          </Paper>
          <MenuItemForm
            open={addItem}
            setOpen={setAddItem}
            edit={editing}
            setEditing={setEditing}
            item={selectedItem}
            updateItem={(data) => handleUpdateMenu(data)}
          />
          <ConfirmDialog
            open={deleteDialog}
            setOpen={setDeleteDialog}
            item={selectedItem}
            confirmDelete={() => handleDeleteItem()}
          />
        </>
      )}
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
    updateUser: (userType, userId) => dispatch(updateUser(userType, userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Options);
