import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import ChatProvider from './context/ChatProvider';
import { ToastProvider } from './components/ui/Toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
