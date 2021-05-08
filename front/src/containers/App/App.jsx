import React, { Fragment, useEffect, useState } from 'react';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import store from './store';
import Scroll from './Scroll';
import * as serviceWorker from '../../serviceWorker';
import '../../scss/index.scss';
import Router from './Router';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import { SnackbarProvider } from 'notistack';
import Notifier from './Notifier';

serviceWorker.unregister();

const App = () => {
    useEffect(() => {
    }, []);

    return (

        <Provider store={store}>
            <SnackbarProvider maxSnack={10}>
                <Notifier />
                <BrowserRouter>
                    <Scroll>
                        <Fragment>
                            <Router />
                        </Fragment>
                    </Scroll>
                </BrowserRouter>
            </SnackbarProvider>
        </Provider>
    )
}

export default hot(module)(App);
