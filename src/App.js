import MainLayout from "./containers/MainLayout";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import LandingPage from "./containers/LandingPage";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/">
            <MainLayout component={LandingPage} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
