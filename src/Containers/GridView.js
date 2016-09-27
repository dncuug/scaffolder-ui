import React, { Component } from 'react';
import { DataGrid, LoadingBar } from '../Components';
import { Row } from 'react-bootstrap';

import Promise from 'es6-promise';
import { getTable, select} from '../api';

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

class GridView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            schema: {},
            items: [],
            totalItemsCount: 0
        };
    }

    componentDidMount() {
        this.fetchInitialData(this.props.routeParams.table);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.routeParams.table !== nextProps.routeParams.table) {
            this.fetchInitialData(nextProps.routeParams.table);
        }
    }

    fetchInitialData(tableName) {
        this.cancelRequest();
        this.setState({isFetching: true, schema: {}, items: []});
        this._requestPromise = makeCancelable(Promise.all([
            getTable(tableName),
            select(tableName),
        ]));
        this._requestPromise.promise.then(responses => {
            const selectData = responses[1];
            this.setState({schema: responses[0], ...selectData, isFetching: false});
        });
    }

    fetchMoreData(filter) {
        this.cancelRequest();
        this.setState({isFetching: true});

        select(this.state.schema.name, filter).then(response => {
            this.setState({...response, isFetching: false})
        });
    }

    cancelRequest() {
        if (this._requestPromise) {
            this._requestPromise.cancel();
        }
    }

    prevPage() {
        if (this.state.currentPage > 0) {
            this.fetchMoreData({currentPage: this.state.currentPage - 1})
        }
    }
    nextPage() {
        const {totalItemsCount, pageSize } = this.state;
        const totalPages = Math.trunc((totalItemsCount + pageSize - 1) / pageSize);
        if (this.state.currentPage < totalPages - 1) {
            this.fetchMoreData({currentPage: this.state.currentPage + 1})
        }
    }

    componentWillUnmount() {
        this.cancelRequest();
    }

    render() {
        const { schema, items, isFetching, totalItemsCount, pageSize } = this.state;
        const totalPages = Math.trunc((totalItemsCount + pageSize - 1) / pageSize);
        return (
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>{schema && schema.title ? schema.title : this.props.routeParams.table}</h1>
                </section>
                {/* Main content */}
                <section className="content">
                    <Row>
                        {isFetching && <LoadingBar />}
                        {totalItemsCount === 0 && <p>No Data</p>}
                        {!isFetching && totalItemsCount > 0 && <div>
                            <DataGrid schema={schema} items={items}
                                      onEditClick={() => {}}
                                      onDeleteClick={() => {}} />
                            {/*<Button onClick={this.prevPage.bind(this)} icon={<CaretPrevious />} />*/}
                            <p>{this.state.currentPage} / {totalPages}</p>
                            {/*<Button onClick={this.nextPage.bind(this)} icon={<CaretNext />} />*/}
                        </div>}
                    </Row>
                </section>
            </div>
        );
    }
}

export default GridView;
