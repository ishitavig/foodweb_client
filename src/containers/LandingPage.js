import React, { useState } from "react";
import Logo from "../assets/images/logo.png";
import { Button, Card, Paper, TextField, Typography } from "@material-ui/core";
import axios from "axios";
import Chat from "../components/Chat";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const LandingPage = (props) => {
  const [place, setPlace] = useState("");
  const [restaurantResults, setRestaurantResults] = useState([]);

  const searchRestaurants = async () => {
    setRestaurantResults([]);
    const result = await axios.post(
      `http://localhost:9000/users/search-restaurants?city=${place}`
    );
    setRestaurantResults(result.data);
  };

  return (
    <div className="text-center">
      <img src={Logo} width="20%" alt="logo" />
      <div className="col-12">
        <div className="col-12 text-center">
          <Paper
            style={{
              width: "60%",
              textAlign: "center",
              margin: "auto",
            }}
          >
            <div
              style={{
                width: "100%",
                textAlign: "center",
                margin: "auto",
                padding: 20,
              }}
            >
              <Typography variant="h3" style={{ fontFamily: "cursive" }}>
                Search city or suburb for restaurants
              </Typography>
              <TextField
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                style={{ margin: 20, width: "40%" }}
                variant="outlined"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => searchRestaurants()}
                style={{
                  margin: 30,
                  backgroundColor: "maroon",
                  color: "white",
                }}
              >
                Search
              </Button>
            </div>
          </Paper>
        </div>
        <div className="col-12 text-center" style={{ marginTop: 20 }}>
          {restaurantResults.length !== 0 && (
            <Paper
              style={{
                width: "50%",
                textAlign: "center",
                margin: "auto",
                maxHeight: "500px",
                overflowY: "scroll",
              }}
            >
              {restaurantResults &&
                restaurantResults.map((restaurant) => (
                  <Card
                    elevation={3}
                    style={{ padding: 20, backgroundColor: "pink" }}
                  >
                    <Typography variant="h5">{restaurant.name}</Typography>
                    <Typography variant="h6">
                      {restaurant.formatted_address}
                    </Typography>
                    <Typography variant="h6">
                      {restaurant.opening_hours &&
                      restaurant.opening_hours.open_now
                        ? "Open"
                        : "Closed"}
                    </Typography>
                    <Typography variant="h6">
                      Rating: {restaurant.rating}
                    </Typography>
                  </Card>
                ))}
            </Paper>
          )}
        </div>
      </div>
      {Object.keys(props.user).length !== 0 && (
        <div
          style={{
            position: "absolute",
            right: 20,
            width: "25%",
            backgroundColor: "whitesmoke",
          }}
        >
          <Chat />
        </div>
      )}
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
  connect(mapStateToProps, mapDispatchToProps)(LandingPage)
);
