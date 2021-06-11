import { Paper, TextareaAutosize, TextField, Button } from "@material-ui/core";
import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import axios from "axios";

const BlogForm = (props) => {
  const [blogContent, setBlogContent] = useState({ heading: "", content: "" });

  const handleSubmit = async () => {
    return await axios
      .post(`/blogs/create`, {
        ...blogContent,
        [`${props.user.businessId ? "businessId" : "customerId"}`]:
          props.user.businessId || props.user.customerId,
      })
      .then((res) => {
        if (res.data) {
          props.history.push("/blogs");
        }
      })
      .catch((error) =>
        console.error(
          `There was an error creating blog ${blogContent.email} note: ${error}`
        )
      );
  };

  return (
    <>
      <div className="text-center col-12">
        <Paper
          style={{
            width: "50%",
            textAlign: "center",
            margin: "auto",
          }}
        >
          <div
            style={{
              width: "100%",
              textAlign: "center",
              margin: "auto",
              marginBottom: 20,
            }}
          >
            <TextField
              placeholder="Heading"
              variant="standard"
              style={{ width: "80%", margin: 20 }}
              value={blogContent.heading}
              onChange={(e) =>
                setBlogContent({ ...blogContent, heading: e.target.value })
              }
            />
          </div>
          <div>
            <TextareaAutosize
              placeholder="Content"
              variant="standard"
              style={{
                width: "80%",
                margin: 20,
                minHeight: "500px",
                padding: 20,
              }}
              value={blogContent.content}
              onChange={(e) =>
                setBlogContent({ ...blogContent, content: e.target.value })
              }
            />
          </div>
          <Button
            variant="contained"
            style={{
              textTransform: "inherit",
              margin: 20,
              backgroundColor: "maroon",
              color: "white",
            }}
            onClick={() => handleSubmit()}
          >
            Create
          </Button>
        </Paper>
      </div>
    </>
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BlogForm)
);
