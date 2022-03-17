import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";
import reportWebVitals from './reportWebVitals';

const providerConfig = {
  // domain and client identifier don't need to be kept secret
  domain: "dev-uvnir9ko.us.auth0.com",
  clientId: "mSuwRiJYiebu6SPseMyiNc2McPCDYbon",
  redirectUri: window.location.origin,
  // audience: "https://multitask-333.hasura.app/v1/graphql"
};


ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider {...providerConfig}>
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
