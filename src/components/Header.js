import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Menu,
  MenuItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { withRouter } from "react-router";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

const Header = (props) => {
  const [signedIn, setSignedIn] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    if (props.user && Object.keys(props.user).length !== 0) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  }, [props.user]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    window.location.reload();
    setAnchorEl(null);
    setSignedIn(false);
  };

  return (
    <AppBar
      position="static"
      style={{ backgroundColor: "maroon", marginBottom: 20 }}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <div
          onClick={() => props.history.push("/")}
          style={{ cursor: "pointer" }}
        >
          <Typography variant="h6">FoodWeb</Typography>
        </div>
        <div style={{ position: "absolute", right: "15%" }} className="row">
          <Button style={{ marginRight: 10, color: "white" }}>
            Restaurant Bookings/ Order Online
          </Button>
          <Button style={{ marginRight: 10, color: "white" }}>Blogs</Button>
        </div>
        <div style={{ marginLeft: "auto", marginRight: 0 }}>
          {!signedIn ? (
            <>
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
            </>
          ) : (
            <>
              <Avatar
                alt="user"
                style={{ backgroundColor: "#000000" }}
                onClick={handleClick}
              >
                {props.user && props.user.name
                  ? props.user.name.slice(0, 1)
                  : ""}
              </Avatar>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem style={{ fontWeight: "bold" }}>
                  {props.user ? props.user.name : ""}
                </MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </Menu>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
