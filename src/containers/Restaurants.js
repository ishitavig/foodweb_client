import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Card, Typography } from "@material-ui/core";
import moment from "moment";

const Restaurants = (props) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const result = await axios.get(
        `http://localhost:9000/restaurants/getAll`
      );
      if (result.data && result.data.length !== 0) {
        setRestaurants(result.data);
      } else {
        setRestaurants([]);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div>
      {restaurants && restaurants.length === 0 ? (
        <div>No restaurants</div>
      ) : (
        restaurants.map((restaurant) => {
          console.log(restaurant, "restaurant");
          const openFrom = moment(restaurant.openingHoursFrom);
          const openTo = moment(restaurant.openingHoursTo);
          return (
            <>
              <div className="text-center">
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
                  </Card>
                </Paper>
              </div>
            </>
          );
        })
      )}
    </div>
  );
};

export default Restaurants;
