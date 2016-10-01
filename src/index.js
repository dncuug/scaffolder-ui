import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import App from './App';
import { HomeView, GridView, StorageView, LoginView } from './Containers';
import {auth} from "./api";

import 'bootstrap.native';

import './AdminLTE.css';
import './AdminLTE-override.css';
import './skin-blue.css';
import './index.css';


function requireAuth(nextState, replace) {
    if (!auth.authenticated()) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}
function requireNotAuth(nextState, replace) {
    if (auth.authenticated()) {
        replace({
            pathname: '/'
        })
    }
}

const NotFound = () => <h2>Not found</h2>;

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App} >
            <IndexRoute component={HomeView} onEnter={requireAuth} />
            <Route path="login" component={LoginView} onEnter={requireNotAuth} />
            <Route path="grid/:table" component={GridView} onEnter={requireAuth} />
            <Route path="storage/" component={StorageView} onEnter={requireAuth} />
            {/*<Route path="detail/:table/:id" component={DetailView} />*/}

            <Route path="*" component={NotFound} />
        </Route>
    </Router>,
    document.getElementById('root')
);

