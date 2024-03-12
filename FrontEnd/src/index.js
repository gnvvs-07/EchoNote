import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import './global.css';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>

      <App />
      <ToastContainer>
        position = "bottom-center"
        autoClose = {2000}
        hideProgressBar = {true}
        theme = "colored"
        icon = {false}
      </ToastContainer>
    </BrowserRouter>
  </React.StrictMode>
);
reportWebVitals();
