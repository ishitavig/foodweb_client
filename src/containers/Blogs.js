import { Tooltip, Typography, Fab, Paper, Divider } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

const Blogs = (props) => {
  const [blogList, setBlogList] = useState([]);
  const [viewBlog, setViewBlog] = useState(null);
  console.log(viewBlog, "view");

  useEffect(() => {
    const fetchBlogs = async () => {
      const result = await axios.get(`http://localhost:9000/blogs/getAll`);
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
            height: "87vh",
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
                  onClick={() => props.history.push("/createBlog")}
                >
                  <Add />
                </Fab>
              </Tooltip>
            </div>
          </div>
          {blogList.length === 0 ? (
            <Typography variant="h6">No blogs</Typography>
          ) : (
            <div style={{ overflow: "scroll", height: "85%" }}>
              {blogList.map((blog) => {
                return (
                  <>
                    <Typography
                      variant="h6"
                      style={{ cursor: "pointer", margin: 10 }}
                      onClick={() => {
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
              <Paper style={{ marginBottom: 20, padding: 20 }}>
                <Typography
                  variant="h5"
                  style={{ fontWeight: "bold", fontFamily: "cursive" }}
                >
                  {viewBlog.heading}
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

export default withRouter(Blogs);
