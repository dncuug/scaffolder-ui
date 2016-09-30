import React, {Component, PropTypes} from 'react';
import {FormControl, InputGroup, Button} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import {Link} from 'react-router';

import {LoadingBar} from './index';

import './Components.css';
import {cancelAllGetRequests} from "../api";

class NavLink extends Component {
    static contextTypes = {
        router: React.PropTypes.object
    };

    render() {
        const isActive = this.context.router.isActive(this.props.to, true);

        return (
            <li className={isActive ? "active" : ""}>
                <Link {...this.props} onClick={cancelAllGetRequests}>
                    {this.props.children}
                </Link>
            </li>
        );
    }
}


class NavSidebar extends Component {

    static PropTypes = {
        tables: PropTypes.arrayOf(PropTypes.shape({
            name: React.PropTypes.string,
            title: React.PropTypes.string
        }))
    };

    render() {
        const {tables = []}  = this.props;
        const filter = this.state && this.state.filter;
        const onSearchChange = (e) => {
            this.setState({filter: e.target.value})
        };

        return (
            <div>
                <aside className="main-sidebar">
                    {/* sidebar: style can be found in sidebar.less */}
                    <section className="sidebar">
                        {/* search form */}
                        <form className="sidebar-form">
                            <InputGroup>
                                <FormControl type="text" name="q" onChange={onSearchChange} placeholder="Search..."/>
                                <InputGroup.Button>
                                    <Button className="btn btn-flat"><FontAwesome name="search"/></Button>
                                </InputGroup.Button>
                            </InputGroup>
                        </form>
                        <ul className="sidebar-menu">
                            <li className="header">MAIN NAVIGATION</li>
                            <NavLink to="/">
                                <FontAwesome name="dashboard" /><span>Home</span>
                            </NavLink>
                            <NavLink to="/administration">
                                <FontAwesome name="sliders"/><span>Administration</span>
                            </NavLink>
                            <NavLink to="/storage">
                                <FontAwesome name="upload"/><span>Upload File</span>
                            </NavLink>
                            <li className="header">Tables</li>
                            {!tables.length && <LoadingBar />}
                            {tables
                                .filter(table => !filter || table.title.search(new RegExp(filter, 'i')) >= 0)
                                .map(table => (
                                    <NavLink key={table.name} to={`/grid/${table.name}`}>
                                        <FontAwesome name="table"/><span>{table.title}</span>
                                    </NavLink>
                                ))
                            }

                        </ul>
                    </section>
                </aside>
            </div>
        )
    }
}

export default NavSidebar;
