import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import {Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import { Link } from 'react-router';
import { NavSidebar } from './Components';

import { getTables } from './api'

import './App.css';



class App extends Component {

    state = {
        isFetching: false,
        tables: [],
    };

    componentDidMount() {
        this.setState({isFetching: true});
        getTables().then(tables => {
            this.setState({tables, isFetching: false})
        })
    }

    render() {
        return (
            <div className="wrapper" style={{overflow: 'visible'}}>
                <header className="main-header">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        {/* mini logo for sidebar mini 50x50 pixels */}
                        <span className="logo-mini">Scaffolder</span>
                        {/* logo for regular state and mobile devices */}
                        <span className="logo-lg">Scaffolder</span>
                    </Link>
                    <Navbar staticTop={true} fluid={true}>
                        <Nav>
                            <NavItem>
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
                <NavSidebar tables={this.state.tables}/>
                {/* Content Wrapper. Contains page content */}

                {this.props.children || <div className="content-wrapper" style={{minHeight: 500}}>Nothig Here</div>}

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


    // render() {
        //     return (
        //         <GrommetApp centered={false}>
        //             <Split flex="right">
        //                 <NavSidebar tables={this.state.tables} />
        //                 <Article full={true} pad="medium">
        //                     {this.props.children}
        //                 </Article>
        //             </Split>
        //         </GrommetApp>
        //     )
        // }
