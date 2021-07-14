import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider} from '@shopify/polaris';
import AppContextProvider from './AppContext';

ReactDOM.render(
  <AppProvider i18n={enTranslations}>
    <AppContextProvider>
    <App/>
    </AppContextProvider>
  </AppProvider>,
  document.getElementById('root')
);


