import React, { useEffect, useState } from "react";
import Logo from "../assets/images/logo.png";
import {
  Badge,
  Button,
  Card,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import Chat from "../components/Chat";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const LandingPage = (props) => {
  const [place, setPlace] = useState("");
  const [restaurantResults, setRestaurantResults] = useState([]);
  const [lhsAds, setLhsAds] = useState([]);
  const [rhsAds, setRhsAds] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      await axios
        .get(`http://localhost:9000/advertisements/getAllAds`)
        .then((res) => {
          if (res.data) {
            const list = res.data;
            const halfAds = Math.ceil(list.length / 2);
            setLhsAds(list.splice(0, halfAds));
            setRhsAds(list.splice(-halfAds));
          }
        });
    };
    fetchAds();
  }, []);

  const searchRestaurants = async () => {
    setRestaurantResults([]);
    const result = await axios.post(
      `http://localhost:9000/users/search-restaurants?city=${place}`
    );
    setRestaurantResults(result.data);
  };

  return (
    <div className="text-center" style={{ position: "relative" }}>
      <img src={Logo} width="20%" alt="logo" />
      <div className="row" style={{ width: "100%" }}>
        <div className="col-2 text-center">
          {props.user.customerId &&
            lhsAds.map((ad) => {
              return (
                <>
                  <Badge
                    style={{
                      padding: 10,
                      border: "2px dashed maroon",
                      marginLeft: 20,
                      marginBottom: 20,
                      width: "100%",
                    }}
                    badgeContent="Ad"
                    color="secondary"
                  >
                    <Card
                      elevation={3}
                      style={{
                        padding: 20,
                        backgroundColor: "maroon",
                        color: "white",
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="h5"
                        style={{ fontFamily: "cursive" }}
                      >
                        {ad.heading}
                      </Typography>
                      <Typography variant="body1">{ad.content}</Typography>
                    </Card>
                  </Badge>
                </>
              );
            })}
        </div>
        <div className="col-8">
          <div className="col-12 text-center">
            <Paper
              style={{
                width: "100%",
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
                  width: "70%",
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
        <div className="col-2 text-center">
          {props.user.customerId &&
            rhsAds.map((ad) => {
              return (
                <>
                  <Badge
                    style={{
                      padding: 10,
                      border: "2px dashed maroon",
                      marginBottom: 20,
                      width: "100%",
                    }}
                    badgeContent="Ad"
                    color="secondary"
                  >
                    <Card
                      elevation={3}
                      style={{
                        padding: 20,
                        backgroundColor: "maroon",
                        color: "white",
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="h5"
                        style={{ fontFamily: "cursive" }}
                      >
                        {ad.heading}
                      </Typography>
                      <Typography variant="body1">{ad.content}</Typography>
                    </Card>
                  </Badge>
                </>
              );
            })}
        </div>
      </div>
      {Object.keys(props.user).length !== 0 && (
        <div
          style={{
            position: "absolute",
            right: 20,
            bottom: 0,
            width: "25%",
            backgroundColor: "whitesmoke",
            zIndex: "+1",
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
