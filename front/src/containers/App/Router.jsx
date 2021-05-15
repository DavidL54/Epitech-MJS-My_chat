import React from 'react';
import Loadable from "react-loadable";
import { Route, Switch } from "react-router-dom";
import LogIn from "../Login/index";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";
import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import Layout from './Layout';
import Loader from "react-loader-spinner";
import SignUp from '../SignUp/index';
import Recover from '../Recover/index';

const locationHelper = locationHelperBuilder({});

function Loading(props) {
    if (props.error) {
        return (
            <div>
                Error! <button onClick={props.retry}>Retry</button>
            </div>
        );
    } else if (props.pastDelay) {
        return <Loader type="ThreeDots" color="#7909c4" height={80} width={80} />;
    } else {
        return null;
    }
}

const userIsNotAuthenticated = connectedRouterRedirect({
    redirectPath: (state, ownProps) =>
        locationHelper.getRedirectQueryParam(ownProps) || "/home",
    allowRedirectBack: false,
    authenticatedSelector: state => state.authentication.loggedIn !== true,
    wrapperDisplayName: "UserIsNotAuthenticated"
});

const userIsAuthenticated = connectedRouterRedirect({
    redirectPath: "/",
    authenticatedSelector: state => state.authentication.loggedIn === true,
    wrapperDisplayName: "UserIsAuthenticated"
});


const Home = Loadable({
    loader: () => import("../Home/index.jsx"),
    loading: Loading
});
const Account = Loadable({
    loader: () => import("../Account/index.jsx"),
    loading: Loading
});

const Contact = Loadable({
    loader: () => import("../Contact/index.jsx"),
    loading: Loading
});

const Chat = Loadable({
    loader: () => import("../Chat/index.jsx"),
    loading: Loading
});

const wrappedRoutes = () => (
    <>
            <Layout>
            <Route exact path="/home" component={Home} />
                <Route exact path="/chat" component={Chat} />
                <Route exact path="/contact/:invitation?/:token?" component={Contact} />
                <Route exact path="/account" component={Account} />
            </Layout>
    </>
);

const Router = () => (
    <Switch>
        <Route exact path="/" component={userIsNotAuthenticated(LogIn)} />
        <Route exact path="/signup" component={userIsNotAuthenticated(SignUp)} />
        <Route path="/user/resetpassword/:token?" component={userIsNotAuthenticated(Recover)} />
        <Route path="/" component={userIsAuthenticated(wrappedRoutes)} />
    </Switch>
);

export default Router;