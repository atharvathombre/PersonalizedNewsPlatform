import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginContext from "./contexts/islogin";

import { LoginComponent } from "./login/login";
import { NewscardComponent } from "./newscard/newscard";
import { PlatformselectComponent } from "./platformselect/platformselect";

function MainComponent() {
  const [isLogin, setisLogin] = useState({
    login: false,
    uid: "",
    name: "",
    email: "",
    platform_selected: [],
  });
  const isLoginvalue = { isLogin, setisLogin };

  useEffect(() => {}, []);

  return (
    <>
      <Router>
        <LoginContext.Provider value={isLoginvalue}>
          <AuthProvider>
            <Switch>
              <Route path="/" exact={true} component={LoginComponent} exact />
              <Route
                path="/platform_select"
                exact={true}
                component={PlatformselectComponent}
              />
              <Route path="/news" exact={true} component={NewscardComponent} />
            </Switch>
          </AuthProvider>
        </LoginContext.Provider>
      </Router>
      {/*
       * end of routing
       */}
    </>
  );
}

export { MainComponent };
