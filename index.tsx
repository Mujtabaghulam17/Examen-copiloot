import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Auth0Provider } from './auth/Auth0Provider.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Auth0Provider
        domain="glowexamen.eu.auth0.com"
        clientId="B8ODMupTDlK4fKcUwkOFDYujb5OQ39gq"
        redirectUri={window.location.origin}
    >
        <App />
    </Auth0Provider>
);