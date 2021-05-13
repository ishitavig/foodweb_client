import React, { useEffect, useState } from "react";
import Logo from "../assets/images/logo.png";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";

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
      <div className="col-12 text-center">
        <TextField value={place} onChange={(e) => setPlace(e.target.value)} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => searchRestaurants()}
        >
          Search
        </Button>
      </div>
      <div>
        {restaurantResults &&
          restaurantResults.map((restaurant) => <div>{restaurant.name}</div>)}
      </div>
    </div>
  );
};

export default LandingPage;
