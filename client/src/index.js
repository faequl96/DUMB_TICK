import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContextProvider } from './contexts/UserContext';
import { AppContextProvider } from "./contexts/AppContext";

const client = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <React.StrictMode>
      <UserContextProvider>
         <QueryClientProvider client={client}>
            <Router>
               <AppContextProvider>
                  <App />
               </AppContextProvider>
            </Router>
         </QueryClientProvider>
      </UserContextProvider>
   </React.StrictMode>
);