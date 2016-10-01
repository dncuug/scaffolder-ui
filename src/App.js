import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import {Nav, Navbar, NavItem} from 'react-bootstrap';
import {Link, withRouter} from 'react-router';
import {NavSidebar} from './Components';

import { getTables, auth} from './api'

import './App.css';



class App extends Component {

    state = {
        isFetching: false,
        tables: [],
        navCollapsed: false,
    };

    handleLogout() {
        auth.logout();
        this.props.router.replace('/login');
    }

    componentDidMount() {
        this.setState({isFetching: true});
        getTables().then(tables => {
            this.setState({tables, isFetching: false})
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.tables && this.state.tables.length) {
            return;
        }

        this.setState({isFetching: true});
        getTables().then(tables => {
            this.setState({tables, isFetching: false})
        });

    }

    render() {
        if (!auth.authenticated()) {
            return (
                <div className="container">
                    <div className="col-md-6 col-md-offset-3">
                        <div className="content">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className={this.state.navCollapsed ? 'wrapper sidebar-mini sidebar-collapse' : 'wrapper'} style={{overflow: 'visible'}}>
                <header className="main-header">
                    <Link to="/" className="logo">
                        <span className="logo-mini">Sca</span>
                        <span className="logo-lg">Scaffolder</span>
                    </Link>
                    <Navbar staticTop={true} fluid={true}>
                        <Nav>
                            <NavItem onClick={() => this.setState({navCollapsed: !this.state.navCollapsed})}>
                                <FontAwesome name="bars" />
                            </NavItem>
                        </Nav>
                        <Nav pullRight>
                            <NavItem onClick={this.handleLogout.bind(this)}>Logout</NavItem>
                        </Nav>
                    </Navbar>
                </header>

                <NavSidebar tables={this.state.tables} />

                {this.props.children}

                <footer className="main-footer">
                    <div className="pull-right hidden-xs">
                        <b>Version</b> 0.0.1
                    </div>
                    <strong>Copyright © {new Date().getFullYear()} <a href="/">Studio</a>.</strong> All rights reserved.
                </footer>
            </div>
        )
    }
}


export default withRouter(App);
