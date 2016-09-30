import React, { Component } from 'react';
import { DataGrid, LoadingBar, EntityEditor } from '../Components';
import { Grid, Row, Col } from 'react-bootstrap';

import Promise from 'es6-promise';
import { getTable, select, remove, update} from '../api';
import {getSchemaKey} from "../utils";

const makeCancelable = (promise) => {
    let _hasCanceled = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(val => _hasCanceled ? reject({isCanceled: true}) : resolve(val));
        promise.catch(error => _hasCanceled ? reject({isCanceled: true}) : reject(error));
    });

    return {
        promise: wrappedPromise,
        cancel() {
            _hasCanceled = true;
        },
    };
};


class LoginView extends Component {

    state = {
        password: '',
        login: ''
    };

    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }



    componentWillUnmount() {

    }

    onLoginClick(login, password) {

    }

    render() {
        const { schema, isFetching, editEntity } = this.state;

        return (
            <div className="content-wrapper" style={{minHeight: 'calc(100vh - 5vw)'}}>
                <section className="content-header">
                    <h3>Authorization</h3>
                </section>
                <div className="content">

                    <div class="loginmodal-container">
                        <h1>Login to Your Account</h1>
                        <br />
                        <form>
                            <input type="text" name="user" placeholder="Username" />
                            <input type="password" name="pass" placeholder="Password" />
                            <input type="submit" name="login" className="login loginmodal-submit" value="Login" />
                            <div className="alert alert-danger">
                                <strong>Authoization!</strong> Incorrect login or password
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default GridView;
