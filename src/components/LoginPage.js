import React, { useContext, useEffect, useState } from "react";
// import { GlobalContext } from "./GlobalState";
import { Link } from "react-router-dom";
import { Button, Grid } from "@material-ui/core";
import Banner from "./Banner";
import Hero from "./Hero";
import GoogleSignIn from "./GoogleSignIn";
// import App2 from "./App2";

// const bgStyle = {
//   background: `url(${bgImg2}) no-repeat`,
//   backgroundPositionX: "50%",
//   width: "100%",
//   height: "100%"
// };



const LoginPage = ({ continueToHome }) => {
  const showSignIn = () => {
    // if user has already closed the popup dont show it
    if (localStorage.getItem("signInClosed") !== "true") {
      return <GoogleSignIn />;
    }
  };

  return (
    <Hero>
       <Grid  
      style={{ height: "80vh" }}
      container
      direction="column"
      justify="space-around"
      alignItems="center"
    > {showSignIn()}
        <Banner title="nDsMusic" subtitle="Enjoyable Music Experience Without ads">
        <Link to={"/page1/home"} className="btn-primary" onClick={continueToHome}>
          Continue
        </Link>
        
        </Banner>
    </Grid>
    </Hero>
   
  );
};
 
export default LoginPage;
