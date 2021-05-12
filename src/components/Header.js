import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Avatar,
  Button,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import { withRouter } from "react-router";

const Header = (props) => {
  return (
    <AppBar
      position="static"
      style={{ backgroundColor: "maroon", marginBottom: 20 }}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">FoodWeb</Typography>
        <div style={{ marginLeft: "auto", marginRight: 0 }}>
          <Button
            variant="contained"
            style={{
              textTransform: "inherit",
              marginRight: 20,
              backgroundColor: "black",
              color: "white",
            }}
            onClick={() => props.history.push("/signin")}
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            style={{
              textTransform: "inherit",
              backgroundColor: "black",
              color: "white",
            }}
            onClick={() => props.history.push("/signup")}
          >
            Sign Up
          </Button>
          {/* <Avatar alt="user" style={{ backgroundColor: "#000000" }}>
              U
            </Avatar> */}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Header);
