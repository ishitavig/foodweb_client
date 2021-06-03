import axios from "axios";
import { SET_USER } from "./actionTypes";

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const updateUser = (userType, userId) => async (dispatch) => {
  await axios
    .get(`http://localhost:9000/users/${userType}/${userId}`)
    .then((res) => {
      if (res.data) {
        localStorage.setItem("user", res.data.token);
      }
    })
    .catch((error) =>
      console.error(
        `There was an error getting user ${userType}: ${userId} note: ${error}`
      )
    );
};
