import {
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";

const OrderDetails = (props) => {
  const { open, order } = props;
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    setOpenForm(open);
  }, [open]);

  const handleClose = () => {
    setOpenForm(false);
    props.setOpen(false);
  };

  const orderInfo = order && order[0] ? order[0] : {};

  return (
    <>
      <Dialog
        open={openForm}
        onClose={() => handleClose()}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle>
          Your order details from: <b>{orderInfo.name}</b>
        </DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "maroon",
                    border: "2px solid maroon",
                  }}
                >
                  Item
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "maroon",
                    border: "2px solid maroon",
                  }}
                >
                  Quantity
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(orderInfo).length !== 0 &&
                order.map((items, index) => {
                  return (
                    <TableRow>
                      <TableCell
                        style={{
                          backgroundColor: index % 2 !== 0 ? "pink" : "",
                        }}
                      >
                        {items.itemName}
                      </TableCell>
                      <TableCell
                        style={{
                          backgroundColor: index % 2 !== 0 ? "pink" : "",
                        }}
                      >
                        {items.quantity}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <div>
            <Typography variant="body1" style={{ margin: 10 }}>
              Total bill: ${orderInfo.billingCost}
            </Typography>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderDetails;
