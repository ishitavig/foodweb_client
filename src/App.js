import MainLayout from "./containers/MainLayout";
import { Route, Switch, withRouter } from "react-router-dom";
import jwt from "jsonwebtoken";
import store from "./store/index";
import React, { useEffect } from "react";
import { setUser } from "./store/actions/usersAction";
import LandingPage from "./containers/LandingPage";
import UserForm from "./containers/UserForm";
import Blogs from "./containers/Blogs";
import BlogFrom from "./containers/BlogForm";
import RestaurantOption from "./containers/RestaurantOption";
import Advertisements from "./containers/Business/Advertisements";
import Profile from "./containers/Profile";

const App = () => {
  const token = localStorage.getItem("user");
  useEffect(() => {
    const decodeToken = async () => {
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
  }, [token]);

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
        <Route exact path="/blogs">
          <MainLayout component={Blogs} />
        </Route>
        <Route exact path="/createBlog">
          <MainLayout component={BlogFrom} />
        </Route>
        <Route exact path="/restaurants">
          <MainLayout component={RestaurantOption} />
        </Route>
        <Route exact path="/advertisements">
          <MainLayout component={Advertisements} />
        </Route>
        <Route exact path="/profile">
          <MainLayout component={Profile} />
        </Route>
      </Switch>
    </div>
  );
};

export default withRouter(App);
