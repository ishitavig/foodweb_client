import { Tooltip, Typography, Fab, Paper, Divider } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import blogBackground from "../assets/images/blogBackground.jpg";
import { SERVER_LINK } from "../constants";

const Blogs = (props) => {
  const [blogList, setBlogList] = useState([]);
  const [viewBlog, setViewBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      const result = await axios.get(`${SERVER_LINK}/blogs/getAll`);
      if (result.data && result.data.length !== 0) {
        setBlogList(result.data);
      } else {
        setBlogList([]);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <>
      <div className="row" style={{ width: "95vw" }}>
        <div
          className="col-3"
          style={{
            border: "2px solid black",
            marginLeft: 20,
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              margin: 20,
              color: "maroon",
            }}
          >
            <Typography variant="h3" style={{ fontFamily: "cursive" }}>
              Blogs
            </Typography>
            <div style={{ position: "absolute", top: 20, right: 50 }}>
              <Tooltip title="Create New Blog" aria-label="add">
                <Fab
                  color="secondary"
                  onClick={() => {
                    props.user
                      ? props.history.push("/createBlog")
                      : props.history.push("/signin");
                  }}
                >
                  <Add />
                </Fab>
              </Tooltip>
            </div>
          </div>
          {blogList.length === 0 ? (
            <Typography variant="h6">No blogs</Typography>
          ) : (
            <div
              style={{
                maxHeight: "85%",
                overflowY: "scroll",
                minHeight: "750px",
              }}
            >
              {blogList.map((blog) => {
                return (
                  <>
                    <Typography
                      variant="h6"
                      style={{ cursor: "pointer", margin: 10 }}
                      onClick={() => {
                        console.log(blog, "bog");
                        setViewBlog(blog);
                      }}
                    >
                      {blog.heading}
                    </Typography>
                    <Divider />
                  </>
                );
              })}
            </div>
          )}
        </div>
        <div className="col-8" style={{ marginLeft: "auto" }}>
          {viewBlog && (
            <>
              <Paper
                style={{
                  marginBottom: 20,
                  padding: 20,
                  backgroundImage: `url(${blogBackground})`,
                }}
              >
                <Typography
                  variant="h5"
                  style={{
                    fontWeight: "bold",
                    fontFamily: "cursive",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  {viewBlog.heading}
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: "bold",
                    fontFamily: "cursive",
                    color: "white",
                    textAlign: "center",
                    marginTop: 10,
                  }}
                >
                  - {viewBlog.name}
                </Typography>
              </Paper>
              <Paper style={{ padding: 20 }}>
                <Typography variant="h6">{viewBlog.content}</Typography>
              </Paper>
            </>
          )}
        </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Blogs));
