import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Route } from "react-router-dom";

const MainLayout = (props) => {
  const { component: Component, rest } = props;
  return (
    <div>
      <Header />
      <Route
        {...rest}
        render={(componentProps) => {
          return <Component {...componentProps} />;
        }}
      />
      <Footer />
    </div>
  );
};

export default MainLayout;
