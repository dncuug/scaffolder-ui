import React, {Component, PropTypes} from 'react';
import {FormControl, InputGroup, Button} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import {Link} from 'react-router';

import { LoadingBar } from './index';

import './Components.css';


class NavSidebar extends Component {

    static PropTypes = {
        tables: PropTypes.arrayOf(PropTypes.shape({
            name: React.PropTypes.string,
            title: React.PropTypes.string
        }))
    };

    render() {
        const { tables = [] }  = this.props;
        const filter = this.state && this.state.filter;
        const onSearchChange = (e) => {
            this.setState({filter: e.target.value})
        };

        return (
            <aside className="main-sidebar">
                {/* sidebar: style can be found in sidebar.less */}
                <section className="sidebar">
                    {/* search form */}
                    <form className="sidebar-form">
                        <InputGroup>
                            <FormControl type="text" name="q" onChange={onSearchChange} placeholder="Search..." />
                            <InputGroup.Button>
                                <Button className="btn btn-flat"><FontAwesome name="search" /></Button>
                            </InputGroup.Button>
                        </InputGroup>
                    </form>
                    <ul className="sidebar-menu">
                        <li className="header">MAIN NAVIGATION</li>
                        <li className="active">
                            <Link to="/">
                                <FontAwesome name="dashboard" />
                                <span>Home</span>
                            </Link>
                        </li>
                        <li className="active">
                            <Link to="/administration">
                                <FontAwesome name="Administration" />
                                <span>Administration</span>
                            </Link>
                        </li>
                        <li className="header">Tables</li>
                        {!tables.length && <LoadingBar />}
                        {(tables)
                            .filter(table => !filter || table.title.search(new RegExp(filter, 'i')) >= 0)
                            .map(table => (
                                <li key={table.name}>
                                    <Link to={`/grid/${table.name}`}><FontAwesome name="table" /><span>{table.title}</span></Link>
                                </li>
                            ))
                        }

                    </ul>
                </section>
            </aside>
        )
    }
}

export default NavSidebar;
