import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Avatar,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";

const Header = (props) => {
  return (
    <AppBar position="static" style={{ backgroundColor: "maroon" }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">FoodWeb</Typography>
        <div style={{ marginLeft: "auto", marginRight: 0 }}>
          <Avatar alt="user" style={{ backgroundColor: "#000000" }}>
            U
          </Avatar>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
