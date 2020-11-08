import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import SimpleAppBar from "./header/SimpleAppBar";
// import MainPlayer from "./player/MainPlayer";
import SwipeMenu from "./SwipeMenu";
// import SnackbarMessage from "./SnackbarMessage";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blueGrey, blue } from "@material-ui/core/colors";

import { useCheckDarkmode } from "./sections/SettingsPage";
import { GlobalContext } from "./GlobalState";
import CurrentSection from "./CurrentSection";

const body = document.querySelector("body");

const defaultTheme = {
  palette: {
    primary: blueGrey,
    third: blue,
    secondary: {
      main: "#263238"
    }
  },
  typography: {
    useNextVariants: true
  }
};

const darkTheme = {
  palette: {
    type: "dark",
    primary: blueGrey,
    third: blue,
    secondary: {
      main: "#263238"
    }
  },
  typography: {
    useNextVariants: true
  }
};

const muiDarkTheme = createMuiTheme(darkTheme);
const muiDefaultTheme = createMuiTheme(defaultTheme);

const App2 = () => {
  const [{ themeSelectValue }, dispatch] = useContext(GlobalContext);

  const { checkDarkMode } = useCheckDarkmode();

  useEffect(() => {
    checkDarkMode();

    if (navigator.userAgent.match(/Android/i)) {
      body.style.overscrollBehavior = "none";
      // this is to disable pull refresh on android
    }
  }, []);

  useEffect(() => {
    if (themeSelectValue === "Dark") {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }, [themeSelectValue]);

  return (
    <MuiThemeProvider theme={themeSelectValue === "Dark" ? muiDarkTheme : muiDefaultTheme}>
      <Switch>
      <Router>
            <SimpleAppBar />
            <Route component={CurrentSection} />
            <SwipeMenu />
        </Router> 
      </Switch>
       
    </MuiThemeProvider>
  );
};
export default App2;
