import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Card, Typography, Button, Divider } from "@material-ui/core";
import moment from "moment";
import TableBooking from "../../components/TableBookingForm";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import OrderDetails from "../../components/OrderDetails";

const Restaurants = (props) => {
  const [restaurants, setRestaurants] = useState([]);
  const [bookTable, setBookTable] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState({});
  const [tableBookings, setTableBookings] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const result = await axios.get(`/restaurants/getAll`);
      if (result.data && result.data.length !== 0) {
        setRestaurants(result.data);
      } else {
        setRestaurants([]);
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const fetchTableBookings = async () => {
      await axios
        .get(`/restaurants/getTableBookings/customer/${props.user.customerId}`)
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
        .get(`/restaurants/getFoodOrders/customer/${props.user.customerId}`)
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
  }, [bookTable]);

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
        {restaurants && restaurants.length === 0 ? (
          <div>No restaurants</div>
        ) : (
          restaurants.map((restaurant) => {
            const openFrom = moment(restaurant.openingHoursFrom);
            const openTo = moment(restaurant.openingHoursTo);
            return (
              <>
                <div className="text-center" key={restaurant.businessId}>
                  <Paper
                    style={{
                      width: "50%",
                      textAlign: "center",
                      margin: "auto",
                      maxHeight: "500px",
                      overflowY: "scroll",
                    }}
                  >
                    <Card
                      elevation={3}
                      style={{ padding: 20, backgroundColor: "pink" }}
                    >
                      <Typography variant="h5" style={{ fontWeight: "bold" }}>
                        {restaurant.name}
                      </Typography>
                      <Typography variant="h6" style={{ fontWeight: "bold" }}>
                        {restaurant.address}
                      </Typography>
                      <Typography variant="h6">
                        Opening Hours:{" "}
                        <b>
                          {restaurant.openingHoursFrom
                            ? `From: ${openFrom.format(
                                "hh:mm A"
                              )} To: ${openTo.format("hh:mm A")}`
                            : "No information provided"}
                        </b>
                      </Typography>
                      <Typography variant="h6">
                        Rating:{" "}
                        <b>
                          {restaurant.rating
                            ? restaurant.rating
                            : "No information available"}
                        </b>
                      </Typography>
                      {restaurant.tableBookingStatus === 1 && (
                        <Button
                          variant="contained"
                          style={{
                            textTransform: "inherit",
                            backgroundColor: "maroon",
                            color: "white",
                            marginRight: 10,
                          }}
                          onClick={() => {
                            setSelectedRestaurant(restaurant);
                            setBookTable(!bookTable);
                          }}
                        >
                          Book a Table
                        </Button>
                      )}
                      {restaurant.foodOrderStatus === 1 && (
                        <Button
                          variant="contained"
                          onClick={() => {
                            props.history.push(
                              `/foodOrder/${restaurant.businessId}`
                            );
                          }}
                          style={{
                            textTransform: "inherit",
                            backgroundColor: "maroon",
                            color: "white",
                            marginRight: 10,
                          }}
                        >
                          Order Food
                        </Button>
                      )}
                    </Card>
                  </Paper>
                </div>
                <TableBooking
                  open={bookTable}
                  setOpen={setBookTable}
                  restaurant={selectedRestaurant}
                />
              </>
            );
          })
        )}
        <OrderDetails
          open={viewOrder}
          setOpen={setViewOrder}
          order={selectedOrder}
        />
      </div>
    </div>
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Restaurants)
);
