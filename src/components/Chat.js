import { TextField, Button, Typography, IconButton } from "@material-ui/core";
import React, { useState } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import { withRouter } from "react-router-dom";
import MinimizeIcon from "@material-ui/icons/Minimize";
import CloseIcon from "@material-ui/icons/Close";

const Chat = (props) => {
  const [messages, setMessages] = useState([]);
  const [senderMessage, setSenderMessage] = useState("");
  const [chatboxOpen, setChatboxOpen] = useState(false);

  const socket = io("http://localhost:9000", {
    transports: ["websocket"],
    upgrade: false,
  });

  socket.on("newMessage", ({ userId, name, message }) => {
    if (message && name) {
      setMessages([...messages, { name: name, message: message }]);
    }
  });

  const sendMessage = () => {
    socket.emit("newMessage", {
      userId: props.user.user.userId,
      name: props.user.user.name,
      message: senderMessage,
    });
    setSenderMessage("");
  };

  return (
    <>
      {chatboxOpen ? (
        <div
          style={{
            border: "5px dashed maroon",
            height: "50vh",
            position: "relative",
            cursor: "pointer",
          }}
          onClick={() => setChatboxOpen(!chatboxOpen)}
        >
          <div className="row text-center">
            <div className="col-12">
              <Typography
                variant="h5"
                style={{ marginTop: 12, fontWeight: "bold" }}
              >
                Live Chat
              </Typography>
            </div>
            <IconButton
              onClick={() => setChatboxOpen(!chatboxOpen)}
              style={{ position: "absolute", right: 20 }}
            >
              <CloseIcon style={{ color: "black" }} fontSize="medium" />
            </IconButton>
          </div>
          <div className="text-left">
            {messages.map((msg) => (
              <div style={{ padding: 20 }}>
                <b>{msg.name}:</b> {msg.message}
              </div>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 5,
              width: "100%",
              textAlign: "center",
              color: "white",
              border: "2px solid maroon",
            }}
          >
            <TextField
              style={{ width: "80%" }}
              value={senderMessage}
              onChange={(e) => setSenderMessage(e.target.value)}
            />
            <Button
              style={{
                marginLeft: 5,
                backgroundColor: "maroon",
                color: "white",
              }}
              variant="outlined"
              onClick={() => sendMessage()}
            >
              Send
            </Button>
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "maroon",
            color: "white",
            position: "fixed",
            bottom: 25,
            right: 20,
            width: "300px",
            cursor: "pointer",
          }}
          className="row"
          onClick={() => setChatboxOpen(!chatboxOpen)}
        >
          <div className="col-12">
            <Typography variant="h5" style={{ marginTop: 12 }}>
              Live Chat
            </Typography>
          </div>
          <IconButton
            onClick={() => setChatboxOpen(!chatboxOpen)}
            style={{ position: "absolute", right: 20 }}
          >
            <MinimizeIcon
              style={{ color: "white", marginTop: 0 }}
              fontSize="small"
            />
          </IconButton>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default withRouter(connect(mapStateToProps, {})(Chat));
