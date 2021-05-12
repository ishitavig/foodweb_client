import MainLayout from "./containers/MainLayout";
import { Route, Switch, withRouter } from "react-router-dom";
import LandingPage from "./containers/LandingPage";
import UserForm from "./containers/UserForm";

const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/">
          <MainLayout component={LandingPage} />
        </Route>
        <Route exact path="/signup">
          <MainLayout component={UserForm} />
        </Route>
        <Route exact path="/signin">
          <MainLayout component={UserForm} />
        </Route>
      </Switch>
    </div>
  );
};

export default withRouter(App);
