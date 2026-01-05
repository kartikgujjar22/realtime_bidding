import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
// Ensure you are importing from the NEW context file we created
import { AuthProvider } from './context/AuthContext'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>     
      <AuthProvider>     
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);