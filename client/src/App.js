import React from "react";
import "@shopify/polaris/dist/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider, Frame } from "@shopify/polaris";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import "./App.css";
import Register from "./Register";
import Gallery from "./Gallery";
import SignIn from "./SignIn";
import useToken from "./useToken";
import AuthService from "./services/AuthService";

function App() {
  const { token, setToken } = useToken();

  return (
    <AppProvider features={{ newDesignLanguage: true }} i18n={enTranslations}>
      <Frame>
        <BrowserRouter>
          {!AuthService.getCurrentUser() && (
            <Switch>
              <Route path="/register">
                <Register></Register>
              </Route>
              <Route path="/">
                <SignIn setToken={setToken} />;
              </Route>
            </Switch>
          )}
          {AuthService.getCurrentUser() && (
            <Switch>
              <Route exact path="/">
                <Redirect to="gallery"></Redirect>
              </Route>
              <Route exact path="/gallery">
                <Gallery signOut={AuthService.signOut}></Gallery>
              </Route>
            </Switch>
          )}
        </BrowserRouter>
      </Frame>
    </AppProvider>
  );
}

export default App;
