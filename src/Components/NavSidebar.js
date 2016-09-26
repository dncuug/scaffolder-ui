import React, {Component, PropTypes} from 'react';

import Sidebar from 'grommet/components/Sidebar';
import Header from 'grommet/components/Header';
import Search from 'grommet/components/Search';
import Menu from 'grommet/components/Menu';
import Title from 'grommet/components/Title';

import HomeIcon from 'grommet/components/icons/base/Home';
import ConfigurationIcon from 'grommet/components/icons/base/Configuration';
import TableIcon from 'grommet/components/icons/base/Table';

import {Link} from 'react-router';

import { LoadingBar } from './index';

import './Components.css';


class NavSidebar extends Component {

    render() {
        const { tables }  = this.props;
        const filter = this.state && this.state.filter;
        const onSearchDomChange = (e) => {
            this.setState({filter: e.target.value})
        };

        // {icon}
        const MenuRow = ({to, icon, title}) => (
            <Link to={to} activeClassName="active">
                <span className="NavSidebar-item-text">{title}</span>
            </Link>
        );

        return (
            <Sidebar size="small" colorIndex="neutral-1" fixed={true} separator="right">
                <Header large={true} justify="between" pad={{horizontal: 'medium'}}>
                    <Title>Scaffolder</Title>
                </Header>
                <Header small={true} justify="between" pad={{horizontal: 'medium'}}>
                    <Search inline={true} placeHolder="filter tables" onDOMChange={onSearchDomChange} fill={true} />
                </Header>

                <Menu primary={true}>
                    <MenuRow to="/" icon={<HomeIcon/>} title="Home" />
                    <MenuRow to="/administration" icon={<ConfigurationIcon/>} title="Administration" />
                    <div className="NavSidebar-heading">tables</div>
                    {!tables.length && <LoadingBar />}
                    {tables
                        .filter(table => !filter || table.title.search(new RegExp(filter, 'i')) >= 0)
                        .map(table => (
                            <MenuRow key={table.name} icon={<TableIcon />} to={`/grid/${table.name}`} title={table.title} />
                        ))
                    }
                </Menu>
            </Sidebar>
        )
    }
}

NavSidebar.PropTypes = {
    tables: PropTypes.arrayOf(PropTypes.shape({
        name: React.PropTypes.string,
        title: React.PropTypes.string
    }))
};

export default NavSidebar;
