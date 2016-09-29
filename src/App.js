import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import {Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import {Link} from 'react-router';
import {NavSidebar} from './Components';
import {EmptyView} from './Containers';

import { getTables } from './api'

import './App.css';



class App extends Component {

    state = {
        isFetching: false,
        tables: [],
        navCollapsed: false,
    };

    componentDidMount() {
        this.setState({isFetching: true});
        getTables().then(tables => {
            this.setState({tables, isFetching: false})
        })
    }

    render() {
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
                            <NavDropdown id="user-dropdown" eventKey={1} title="User Name">
                                <MenuItem>Logout</MenuItem>
                            </NavDropdown>
                        </Nav>
                    </Navbar>
                    {/*</nav>*/}
                </header>
                {/* Left side column. contains the logo and sidebar */}
                <NavSidebar tables={this.state.tables} />
                {/* Content Wrapper. Contains page content */}

                {this.props.children || <EmptyView />}

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



export default App;
