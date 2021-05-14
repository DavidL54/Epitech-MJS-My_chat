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
import { SocketContext, socket } from './SocketComponent';
serviceWorker.unregister();

const App = () => {

    return (

        <Provider store={store}>
            <SocketContext.Provider value={socket}>
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
                </SocketContext.Provider>
        </Provider>
    )
}

export default hot(module)(App);
