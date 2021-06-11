import axios from "axios";
import { SET_USER } from "./actionTypes";
import jwt from "jsonwebtoken";

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const updateUser = (userType, userId) => async (dispatch) => {
  await axios
    .get(`/users/${userType}/${userId}`)
    .then(async (res) => {
      if (res.data) {
        localStorage.setItem("user", res.data.token);
        const decoded = res.data.token
          ? jwt.verify(res.data.token, "foodwebsecretcode")
          : {};
        if (
          decoded &&
          Object.keys(decoded).length !== 0 &&
          decoded.constructor === Object
        ) {
          dispatch(setUser(decoded.data[0]));
        }
      }
    })
    .catch((error) =>
      console.error(
        `There was an error getting user ${userType}: ${userId} note: ${error}`
      )
    );
};
