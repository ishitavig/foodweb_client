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
import OrderDetails from "../../components/OrderDetails";
import moment from "moment";
import { SERVER_LINK } from "../../constants";

const Options = (props) => {
  const [tableBooking, setTableBooking] = useState(0);
  const [onlineFoodOrder, setOnlineFoodOrder] = useState(0);
  const [foodMenu, setFoodMenu] = useState([]);
  const [addItem, setAddItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tableBookings, setTableBookings] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(false);

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
          `${SERVER_LINK}/restaurants/menu/${props.user.user.businessId}/getAll`
        );
        if (result.data && result.data.length !== 0) {
          console.log(result.data, "data");
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
      `${SERVER_LINK}/restaurants/deleteMenuItem/${props.user.user.businessId}/${selectedItem.itemId}`
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
      `${SERVER_LINK}/users/business/${props.user.user.businessId}`,
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
      `${SERVER_LINK}/users/business/${props.user.user.businessId}`,
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

  useEffect(() => {
    const fetchTableBookings = async () => {
      await axios
        .get(
          `${SERVER_LINK}/restaurants/getTableBookings/business/${props.user.user.businessId}`
        )
        .then((result) => {
          if (result.data) {
            setTableBookings(result.data);
          } else {
            setTableBookings([]);
          }
        });
    };

    const fetchFoodOrders = async () => {
      await axios
        .get(
          `${SERVER_LINK}/restaurants/getFoodOrders/business/${props.user.user.businessId}`
        )
        .then((result) => {
          if (result.data) {
            const groupOrders = result.data.reduce((r, a) => {
              r[a.orderId] = [...(r[a.orderId] || []), a];
              return r;
            }, {});
            setFoodOrders(Object.entries(groupOrders));
          } else {
            setFoodOrders([]);
          }
        });
    };

    fetchTableBookings();
    fetchFoodOrders();
  }, []);

  return (
    <div className="row" style={{ width: "95vw" }}>
      <div
        className="col-3"
        style={{
          border: "2px solid black",
          marginLeft: 20,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            margin: 20,
            color: "maroon",
          }}
        >
          <Typography variant="h4" style={{ fontFamily: "cursive" }}>
            Bookings and Orders
          </Typography>
        </div>
        {tableBookings.length === 0 ? (
          <Typography variant="h6">No active table bookings</Typography>
        ) : (
          <div
            style={{
              maxHeight: "85%",
              overflowY: "scroll",
              minHeight: "300px",
            }}
          >
            <Typography
              variant="h6"
              style={{ color: "maroon", fontWeight: "bold" }}
            >
              Table Bookings
            </Typography>
            {tableBookings.map((tableBooking) => {
              return (
                <>
                  <div>
                    <Typography
                      variant="h6"
                      style={{
                        margin: 10,
                        fontWeight: "bold",
                      }}
                    >
                      {tableBooking.name}
                    </Typography>
                    <Typography variant="body1">
                      Booking Date and Time:{" "}
                      <b>
                        {moment(tableBooking.bookingDateTime).format(
                          "DD/MM/YYYY hh:mm A"
                        )}
                      </b>
                    </Typography>
                    <Typography variant="body1">
                      Guest Count:
                      <b>{tableBooking.guestCount}</b>
                    </Typography>
                    <Typography variant="body1">
                      Status:
                      <b>
                        {+tableBooking.bookingStatus === 1 &&
                        moment(tableBooking.bookingDateTime).isAfter(moment())
                          ? "Active"
                          : "Cancelled or Inactive"}
                      </b>
                    </Typography>
                    <Divider />
                  </div>
                </>
              );
            })}
          </div>
        )}
        {foodOrders.length === 0 ? (
          <Typography variant="h6">No active food orders</Typography>
        ) : (
          <div
            style={{
              maxHeight: "85%",
              overflowY: "scroll",
              minHeight: "300px",
            }}
          >
            <Typography
              variant="h6"
              style={{ color: "maroon", fontWeight: "bold" }}
            >
              Food Orders
            </Typography>
            {foodOrders.map((foodOrder) => {
              return (
                <>
                  <Typography
                    variant="h6"
                    style={{
                      cursor: "pointer",
                      margin: 10,
                      fontWeight: "bold",
                    }}
                    onClick={() => {
                      setSelectedOrder(foodOrder[1]);
                      setViewOrder(true);
                    }}
                  >
                    {foodOrder[1] ? foodOrder[1][0].name : ""}
                  </Typography>
                  {/* <Typography variant="body1">
                    Booking Date and Time:{" "}
                    <b>
                      {moment(tableBooking.bookingDateTime).format(
                        "DD/MM/YYYY hh:mm A"
                      )}
                    </b>
                  </Typography>*/}
                  <Typography variant="body1">
                    Status:
                    <b>
                      {foodOrder[1] && +foodOrder[1][0].orderStatus === 1
                        ? "Active"
                        : "Cancelled or Inactive"}
                    </b>
                  </Typography>
                  <Divider />
                </>
              );
            })}
            <Divider style={{ margin: 20 }} />
          </div>
        )}
      </div>
      <div className="col-8" style={{ marginLeft: "auto" }}>
        <Paper
          style={{
            width: "100%",
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
                width: "100%",
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
                    Currently you have no items in menu. Please add items to
                    view them in this list.
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
                            style={{
                              backgroundColor: "maroon",
                              color: "white",
                            }}
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
            <OrderDetails
              open={viewOrder}
              setOpen={setViewOrder}
              order={selectedOrder}
            />
          </>
        )}
      </div>
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
