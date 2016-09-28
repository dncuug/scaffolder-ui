import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'
import App from './App';
import { GridView } from './Containers';

import 'bootstrap.native';

import './AdminLTE.css';
import './AdminLTE-override.css';
import './skin-blue.css';
import './index.css';


const NotFound = () => <h2>Not found</h2>;

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route path="grid/:table" component={GridView} />
            {/*<Route path="detail/:table/:id" component={DetailView} />*/}
            <Route path="*" component={NotFound} />
        </Route>
    </Router>,
    document.getElementById('root')
);
