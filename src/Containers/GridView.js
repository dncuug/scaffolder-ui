import React, { Component } from 'react';
import { DataGrid, LoadingBar } from '../Components';
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

const NoData = () => (
    <div className="box-header">
        <h3 className="box-title">No Data</h3>
    </div>
);

class GridView extends Component {

    state = {
        isFetching: false,
        schema: {},
        items: [],
        totalItemsCount: 0
    };

    constructor(props) {
        super(props);
        this.onEditClick = this.onEditClick.bind(this);
        this.onCellEdit = this.onCellEdit.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.onSizePerPageList = this.onSizePerPageList.bind(this);
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

    componentWillUnmount() {
        this.cancelRequest();
    }

    onDeleteRow(ids) {
        const promises = ids.map(id => remove(this.state.schema.name, id));
        const keyField = getSchemaKey(this.props.schema);
        Promise.all(promises).then(() => {
            this.setState({
                items: this.state.items.filter(item => ids.indexOf(item[keyField]) > -1),
                totalItemsCount: this.state.totalItemsCount - ids.length
            });
        })
    }

    onPageChange(pageIndex, pageSize) {
        this.setState({isFetching: true});
        select(this.state.schema.name, {
            sortColumn: this.state.sortColumn || '',
            sortOrder: this.state.sortOrder | '',
            currentPage: pageIndex,
            pageSize
        }).then(response => {
            this.setState({
                ...response,
                isFetching: false
            })
        })
    }

    onSortChange(sortName, sortOrder) {
        this.setState({isFetching: true});
        select(this.state.schema.name, {
            currentPage: 1,
            sortColumn: sortName,
            sortOrder
        }).then(response => {
            console.log(response);
            this.setState({
                ...response,
                sortColumn: sortName,
                sortOrder: sortOrder,
                isFetching: false
            })
        })
    }

    onSizePerPageList(pageIndex, pageSize) {
        // todo: for future use
    }

    onFilterChange() {
        // todo: for future use
    }

    onEditClick(id) {
        this.props.history.push(`/detail/${id}`);
    }

    onCellEdit(entity, colName, value) {
        const keyField = getSchemaKey(this.props.schema);
        const entityId = entity[keyField];
        const updatedEntity = {
            [keyField]: entityId,
            [colName]: value
        };
        update(this.state.schema.name, updatedEntity).then(() => {
            const newItems = this.state.items.map(item => {
                if (item[keyField] === entityId) {
                    item[colName] = value;
                }
                return item;
            });
            this.setState({items: newItems})
        })
    }

    render() {
        const { schema, isFetching, totalItemsCount } = this.state;

        return (
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>{schema && schema.title ? schema.title : this.props.routeParams.table}</h1>
                </section>
                {/* Main content */}
                <div className="content">
                    <Grid fluid={true}>
                        <Row>
                            <Col xs={12}>
                                <div className="box">
                                    {isFetching && <LoadingBar />}
                                    {totalItemsCount === 0 ? <NoData /> : (
                                        <div className="box-body">
                                            <DataGrid {...this.state}
                                                      onEditClick={this.onEditClick}
                                                      onDeleteRow={this.onDeleteRow}
                                                      onCellEdit={this.onCellEdit}
                                                      onPageChange={this.onPageChange}
                                                      onSortChange={this.onSortChange}
                                                      onFilterChange={this.onFilterChange}
                                                      onSizePerPageList={this.onSizePerPageList}
                                            />
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default GridView;
