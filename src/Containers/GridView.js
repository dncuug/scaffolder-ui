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


class GridView extends Component {

    state = {
        isFetching: false,
        schema: null,
        items: [],
        totalItemsCount: 0,
        editEntity: null, // turns on edit mode if set
    };

    constructor(props) {
        super(props);
        /* grid */
        this.onEditClick = this.onEditClick.bind(this);
        this.onCellEdit = this.onCellEdit.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.onSizePerPageList = this.onSizePerPageList.bind(this);
        /* editor */
        this.onEditorSaveClick = this.onEditorSaveClick.bind(this);
        this.onEditorCancelClick = this.onEditorCancelClick.bind(this);
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
        this.setState({isFetching: true, schema: null, items: [], editEntity: null});
        this._requestPromise = makeCancelable(Promise.all([
            getTable(tableName),
            select(tableName),
        ]));
        this._requestPromise.promise.then(responses => {
            const selectData = responses[1];
            this.setState({schema: responses[0], ...selectData, isFetching: false});
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
        const {schema} = this.state;
        const promises = ids.map(id => remove(schema.name, id));
        const timeout = setTimeout(() => {
            this.setState({isFetching: true})
        }, 500);
        Promise.all(promises).then(() => {
            clearTimeout(timeout);
            const keyField = getSchemaKey(schema);
            this.setState({
                items: this.state.items.filter(item => ids.indexOf(item[keyField]) > -1),
                totalItemsCount: this.state.totalItemsCount - ids.length
            });
        })
    }

    onPageChange(pageIndex, pageSize) {
        const timeout = setTimeout(() => {
            this.setState({isFetching: true})
        }, 500);
        select(this.state.schema.name, {
            sortColumn: this.state.sortColumn || '',
            sortOrder: this.state.sortOrder === 'desc' ? 1 : 0,
            currentPage: pageIndex,
            pageSize
        }).then(response => {
            clearTimeout(timeout);
            this.setState({
                ...response,
                isFetching: false
            })
        })
    }

    onSortChange(sortName, sortOrder) {
        const timeout = setTimeout(() => {
            this.setState({isFetching: true})
        }, 500);
        select(this.state.schema.name, {
            currentPage: 1,
            sortColumn: sortName,
            sortOrder: sortOrder === 'desc' ? 1 : 0,
        }).then(response => {
            clearTimeout(timeout);
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
        // this.props.history.push(`/detail/${id}`);
        const keyField = getSchemaKey(this.state.schema);
        const timeout = setTimeout(() => {
            this.setState({isFetching: true})
        }, 500);
        select(this.state.schema.name, {
            detailMode: true,
            Parameters: JSON.stringify({
                table: this.state.schema.name,
                [keyField]: id
            })
        }).then(response => {
            clearTimeout(timeout);
            this.setState({editEntity: response.items[0], isFetching: false})
        });
    }

    onCellEdit(entity, colName, value) {
        const keyField = getSchemaKey(this.state.schema);
        const entityId = entity[keyField];
        const updatedEntity = {
            [keyField]: entityId,
            [colName]: value
        };
        const timeout = setTimeout(() => {
            this.setState({isFetching: true})
        }, 500);
        update(this.state.schema.name, updatedEntity).then(() => {
            const newItems = this.state.items.map(item => {
                if (item[keyField] === entityId) {
                    item[colName] = value;
                }
                return item;
            });
            clearTimeout(timeout);
            this.setState({items: newItems, isFetching: false})
        })
    }

    onEditorSaveClick(data) {
        const keyField = getSchemaKey(this.state.schema);
        const entityId = data[keyField];
        const timeout = setTimeout(() => {
            this.setState({isFetching: true})
        }, 500);
        update(this.state.schema.name, data).then(() => {
            const newItems = this.state.items.map(item => {
                return item[keyField] === entityId ? data : item;
            });
            clearTimeout(timeout);
            this.setState({items: newItems, editEntity: null, isFetching: false})
        });
    }

    onEditorCancelClick(e) {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        this.setState({editEntity: null})
    }

    render() {
        const { schema, isFetching, editEntity } = this.state;

        const SchemaTitle = ({schema, tableName}) => {
            if (!schema) return <h1>{tableName}</h1>;
            return (
                <h1>
                    {schema.title}<br/>
                    {schema.description && <small>{schema.description}</small>}
                </h1>
            )
        };

        return (
            <div className="content-wrapper" style={{minHeight: 'calc(100vh - 5vw)'}}>
                <section className="content-header">
                    <SchemaTitle schema={schema} tableName={this.props.routeParams.table} />
                </section>
                <div className="content">
                    <Grid fluid={true}>
                        <Row>
                            <Col xs={12}>
                                <div className="box">
                                    {isFetching && <LoadingBar />}
                                    <div className="box-body">
                                        {schema && editEntity && (
                                            <EntityEditor schema={schema} entity={editEntity}
                                                          onSave={this.onEditorSaveClick}
                                                          onCancel={this.onEditorCancelClick} />

                                        )}
                                        {schema && !editEntity && (
                                            <DataGrid {...this.state}
                                                      onEditClick={this.onEditClick}
                                                      onDeleteRow={this.onDeleteRow}
                                                      onCellEdit={this.onCellEdit}
                                                      onPageChange={this.onPageChange}
                                                      onSortChange={this.onSortChange}
                                                      onFilterChange={this.onFilterChange}
                                                      onSizePerPageList={this.onSizePerPageList}
                                            />
                                        )}
                                    </div>
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
