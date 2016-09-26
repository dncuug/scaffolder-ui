import React, { Component } from 'react';

import {default as GrommetApp} from 'grommet/components/App';
import Split from 'grommet/components/Split';
import Article from 'grommet/components/Article';

import { getTables } from './api'

import 'grommet/scss/vanilla/index.scss';
import './App.css';


import { NavSidebar } from './Components';

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
            <GrommetApp centered={false}>
                <Split flex="right">
                    <NavSidebar tables={this.state.tables} />
                    <Article full={true} pad="medium">
                        {this.props.children}
                    </Article>
                </Split>
            </GrommetApp>
        )
    }
}



export default App;
