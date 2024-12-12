import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import state from './states/store'
import {Provider} from "react-redux";
import {BrowserRouter} from 'react-router-dom';
import {AppRouter} from './AppRouter'
import {SnackbarProvider} from "notistack";
import AuthProvider from "./context/AuthContext";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={state}>
    <AuthProvider>
        <React.StrictMode>
                <SnackbarProvider/>
                <BrowserRouter>
                    <AppRouter/>
                </BrowserRouter>
        </React.StrictMode>
    </AuthProvider>
    </Provider>

);
