import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
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
      </Toolbar>
    </AppBar>
  );
};

export default Header;
