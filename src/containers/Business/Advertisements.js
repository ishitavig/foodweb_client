import {
  Paper,
  Typography,
  Divider,
  Tooltip,
  Fab,
  Card,
  Button,
  Chip,
  IconButton,
} from "@material-ui/core";
import { Add, Edit, Delete } from "@material-ui/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PurchaseForm from "../../components/PurchaseForm";
import AdForm from "../../components/AdForm";
import ConfirmDialog from "../../components/ConfirmDialog";
import moment from "moment";

const Advertisements = (props) => {
  const [plan, setPlan] = useState(null);
  const [ads, setAds] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [purchase, setPurchase] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [createAd, setCreateAd] = useState(false);
  const [selectedAd, setSelectedAd] = useState({});
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchAdPlans = async () => {
      await axios.get(`/advertisements/getAdPlans`).then((res) => {
        if (res.data) {
          setAvailablePlans(res.data);
        } else {
          setAvailablePlans([]);
        }
      });
    };

    fetchAdPlans();
  }, []);

  useEffect(() => {
    console.log(props.user, "user");
    setPlan(props.user.planId);
  }, [props.user]);

  useEffect(() => {
    const fetchAds = async () => {
      await axios
        .get(`/advertisements/getAdsByBusinessId/${props.user.businessId}`)
        .then((result) => {
          if (result.data) {
            setAds(result.data);
          } else {
            setAds([]);
          }
        });
    };
    fetchAds();
  }, [props.user, createAd]);

  const handleDeleteAd = async () => {
    await axios.delete(
      `/advertisements/delete/${props.user.businessId}/${selectedAd.adId}`
    );
    setAds(ads.filter((item) => +item.adId !== +selectedAd.adId));
  };

  const handleUpdateAd = (data) => {
    setAds(
      ads.map((item) =>
        +item.adId === +data.adId ? { ...item, ...data } : item
      )
    );
  };

  return (
    <>
      <div className="text-center">
        {!plan ? (
          <>
            <Typography>
              You have currently no plan selected for posting advertisements.
              Please buy a plan to continue.
            </Typography>
            <div className="text-center row" style={{ width: "100%" }}>
              {availablePlans.map((p) => {
                return (
                  <Card
                    elevation={3}
                    style={{
                      padding: 20,
                      backgroundColor: "maroon",
                      color: "white",
                      width: "31vw",
                      margin: 20,
                    }}
                  >
                    <Typography variant="h5" style={{ fontFamily: "cursive" }}>
                      {p.name}
                    </Typography>
                    <Typography variant="h5">
                      $ {p.price} / {p.periodInDays} days
                    </Typography>
                    <Button
                      variant="contained"
                      style={{ margin: 10 }}
                      onClick={() => {
                        setPurchase(true);
                        setSelectedPlan(p);
                      }}
                    >
                      Purchase
                    </Button>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <Paper
              style={{
                width: "50%",
                textAlign: "center",
                margin: "auto",
                position: "relative",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  margin: 20,
                  color: "maroon",
                }}
              >
                <Typography variant="h5" style={{ fontFamily: "cursive" }}>
                  Advertisements
                </Typography>
                <div style={{ position: "absolute", top: 5, right: 50 }}>
                  <Tooltip title="Create New Ad" aria-label="add">
                    <Fab color="secondary" onClick={() => setCreateAd(true)}>
                      <Add />
                    </Fab>
                  </Tooltip>
                </div>
              </div>
              {ads.length === 0 ? (
                <>
                  <Typography variant="body1">
                    Currently you have no posted advertisements. Please create
                    an ad to view them in this list.
                  </Typography>
                </>
              ) : (
                <div style={{ padding: 50 }}>
                  {ads.map((item) => {
                    return (
                      <>
                        <div
                          style={{ margin: 10, position: "relative" }}
                          className="text-left"
                        >
                          <div className="row">
                            <Typography
                              variant="h5"
                              style={{ fontWeight: "bold" }}
                            >
                              {item.heading}
                            </Typography>{" "}
                            <Chip
                              label={
                                item.visibilityStatus === 1
                                  ? "Visible"
                                  : "Invisible"
                              }
                              disabled={item.visibilityStatus === 0}
                              style={{
                                backgroundColor: "maroon",
                                color: "white",
                                marginLeft: 20,
                              }}
                            />
                          </div>
                          <Typography variant="body1">{item.text}</Typography>
                          <Typography>
                            Start Date:{" "}
                            {moment(item.startDate).format("DD/MM/yyyy")}
                          </Typography>
                          <Typography>
                            End Date:{" "}
                            {moment(item.endDate).format("DD/MM/yyyy")}
                          </Typography>
                          <div
                            style={{
                              position: "absolute",
                              right: 150,
                              top: 30,
                            }}
                          >
                            <IconButton
                              onClick={() => {
                                setSelectedAd(item);
                                setCreateAd(true);
                                setEditing(true);
                              }}
                            >
                              <Edit style={{ color: "maroon" }} />
                            </IconButton>
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              right: 100,
                              top: 30,
                            }}
                          >
                            <IconButton
                              onClick={() => {
                                setSelectedAd(item);
                                setDeleteDialog(true);
                              }}
                            >
                              <Delete style={{ color: "maroon" }} />
                            </IconButton>
                          </div>
                        </div>
                        <Divider />
                      </>
                    );
                  })}
                </div>
              )}
            </Paper>
          </>
        )}
      </div>
      <PurchaseForm open={purchase} setOpen={setPurchase} plan={selectedPlan} />
      <AdForm
        open={createAd}
        setOpen={setCreateAd}
        plan={props.user.planId}
        edit={editing}
        setEditing={setEditing}
        item={selectedAd}
        updateItem={(data) => handleUpdateAd(data)}
      />
      <ConfirmDialog
        open={deleteDialog}
        setOpen={setDeleteDialog}
        item={selectedAd}
        confirmDelete={() => handleDeleteAd()}
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

export default connect(mapStateToProps, mapDispatchToProps)(Advertisements);
