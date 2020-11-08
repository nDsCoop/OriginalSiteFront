import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import * as serviceWorker from './serviceWorker';
import {
  BrowserRouter as Router
} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
     <Auth0Provider
      domain="ndscoop.us.auth0.com"
      clientId="VjJpWQ2c7EELPIisJatPwQMM4Mh1DjsR"
      redirectUri={window.location.origin}
    >
        
          <App />
        
    </Auth0Provider>
    </Router>
    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
