import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

//Components
import Navbar from "./component/layout/Navbar";
import Footer from "./component/layout/Footer";
import Landing from "./component/layout/Landing";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import Dashboard from "./component/dashboard/Dashboard";

import "./App.css";
import { clearCurrentProfile } from "./actions/profileActions";

//Check for token
if (localStorage.jwtToken) {
  //Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  //Decode token and get user info and exp
  const decode = jwt_decode(localStorage.jwtToken);
  //Set user and isAuthenticated
  store.dispatch(setCurrentUser(decode));
  //Check for expired token
  const currentTime = Date.now() / 1000;
  if (decode.exp < currentTime) {
    //Logout User
    store.dispatch(logoutUser);
    //Clear current Profile
    store.dispatch(clearCurrentProfile);
    //Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
