import React, { useEffect, useState } from "react";
import Restaurants from "./Customer/Restaurants";
import Options from "./Business/Options";
import { connect } from "react-redux";
import { withRouter } from "react-router";

const RestaurantOption = (props) => {
  const [isCustomer, setIsCustomer] = useState(true);

  useEffect(() => {
    if (
      props.user &&
      props.user.user &&
      Object.keys(props.user.user).length !== 0
    ) {
      if (props.user.user.businessId) {
        setIsCustomer(false);
      } else {
        setIsCustomer(true);
      }
    } else {
      props.history.push("/signin");
    }
  }, [props.user]);

  return <>{isCustomer ? <Restaurants /> : <Options />}</>;
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RestaurantOption)
);
