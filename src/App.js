import MainLayout from "./containers/MainLayout";
import { Route, Switch, withRouter } from "react-router-dom";
import LandingPage from "./containers/LandingPage";
import UserForm from "./containers/UserForm";
import jwt from "jsonwebtoken";
import store from "./store/index";
import React, { useEffect } from "react";
import { setUser } from "./store/actions/usersAction";

const App = () => {
  useEffect(() => {
    const decodeToken = async () => {
      const token = localStorage.getItem("user");
      const decoded = token ? jwt.verify(token, "foodwebsecretcode") : {};

      if (
        decoded &&
        Object.keys(decoded).length !== 0 &&
        decoded.constructor === Object
      ) {
        await store.dispatch(setUser(decoded.data[0]));
      }
    };
    decodeToken();
  }, []);

  return (
    <div>
      <Switch>
        <Route exact path="/">
          <MainLayout component={LandingPage} />
        </Route>
        <Route exact path="/signup">
          <MainLayout component={UserForm} />
        </Route>
        <Route exact path="/signin">
          <MainLayout component={UserForm} />
        </Route>
      </Switch>
    </div>
  );
};

export default withRouter(App);
