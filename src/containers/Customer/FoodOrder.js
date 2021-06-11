import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  ButtonGroup,
  Button,
  TextField,
} from "@material-ui/core";
import { connect } from "react-redux";
import FoodPaymentForm from "../../components/FoodPaymentForm";
import { SERVER_LINK } from "../../constants";

const FoodOrder = (props) => {
  const { businessId } = props.match.params;
  const [foodMenu, setFoodMenu] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderDetails, setOrderDetails] = useState({ address: "", mobile: "" });
  const [purchase, setPurchase] = useState(false);
  const [totalBill, setTotalBill] = useState(0);

  useEffect(() => {
    const fetchMenu = async () => {
      if (businessId) {
        const result = await axios.get(
          `${SERVER_LINK}/restaurants/getAvailableMenu/${businessId}`
        );
        if (result.data && result.data.length !== 0) {
          setFoodMenu(result.data);
        } else {
          setFoodMenu([]);
        }
      }
    };
    fetchMenu();
  }, [businessId]);

  const handleOrder = async () => {
    const prices = selectedItems.map((i) =>
      foodMenu.find((r) => +r.itemId === +i)
        ? foodMenu.find((r) => +r.itemId === +i).price
        : 0
    );
    setTotalBill(prices.reduce((a, b) => a + b, 0));
    if (
      Object.entries(orderDetails).filter((entry) => entry[1] === "").length ===
      0
    ) {
      setPurchase(true);
    }
  };

  return (
    <>
      {foodMenu.length === 0 ? (
        <div>
          <Typography>
            Oops! It appears like the business has not added a menu. Please try
            any other restaurant.
          </Typography>
        </div>
      ) : (
        <>
          <div
            className="text-center"
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "auto",
              width: "40%",
              marginBottom: 20,
            }}
          >
            <TextField
              value={orderDetails.address}
              onChange={(e) =>
                setOrderDetails({ ...orderDetails, address: e.target.value })
              }
              label="Address"
              variant="outlined"
              style={{ marginBottom: 20 }}
              error={orderDetails.address === ""}
            />
            <TextField
              value={orderDetails.mobile}
              onChange={(e) =>
                setOrderDetails({ ...orderDetails, mobile: e.target.value })
              }
              label="Mobile"
              variant="outlined"
              error={orderDetails.mobile === ""}
            />
          </div>
          <div className="text-center">
            <Typography variant="h5">Choose your order</Typography>
          </div>
          {foodMenu.map((item) => {
            return (
              <>
                <div className="text-center">
                  <Paper
                    style={{
                      width: "50%",
                      textAlign: "center",
                      margin: "auto",
                    }}
                  >
                    <div
                      className="row"
                      style={{
                        width: "90%",
                        margin: 20,
                        position: "relative",
                        height: 50,
                      }}
                    >
                      <Typography>{item.itemName}</Typography>
                      <ButtonGroup style={{ position: "absolute", right: 20 }}>
                        <Button
                          onClick={() => {
                            setSelectedItems([...selectedItems, +item.itemId]);
                          }}
                        >
                          +
                        </Button>
                        <Button>
                          {
                            selectedItems.filter((val) => +val === +item.itemId)
                              .length
                          }
                        </Button>
                        <Button
                          onClick={() => {
                            let targetItemArray = selectedItems.filter(
                              (val) => +val === +item.itemId
                            );
                            const remainingItems = selectedItems.filter(
                              (val) => +val !== +item.itemId
                            );
                            targetItemArray.pop();
                            targetItemArray.length !== 0
                              ? setSelectedItems([
                                  ...remainingItems,
                                  ...targetItemArray,
                                ])
                              : setSelectedItems([...remainingItems]);
                          }}
                        >
                          -
                        </Button>
                      </ButtonGroup>
                    </div>
                  </Paper>
                </div>
              </>
            );
          })}
          <div style={{ width: "100%" }} className="text-center">
            <Button
              variant="contained"
              style={{
                textTransform: "inherit",
                marginRight: 20,
                backgroundColor: "maroon",
                color: "white",
              }}
              onClick={() => handleOrder()}
            >
              Order
            </Button>
          </div>
        </>
      )}
      <FoodPaymentForm
        open={purchase}
        setOpen={setPurchase}
        orderDetails={orderDetails}
        selectedItems={selectedItems}
        businessId={businessId}
        totalBill={totalBill}
        setTotalBill={setTotalBill}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(FoodOrder);
