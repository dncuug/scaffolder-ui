import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
// import {Button, ButtonGroup, ButtonToolbar, FormControl, InputGroup, FormGroup} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import {getSchemaKey, COLUMN_TYPE} from "../utils";


function stopPropagationHandler(e) {
    e.stopPropagation()
}

const DefaultCell = ({value}) => (
    <div>{typeof value === 'object' ? JSON.stringify(value) : value}</div>
);
const TimeCell = ({value}) => (
    <div>{new Date(value).toLocaleTimeString()}</div>
);
const DateCell = ({value}) => (
    <div>{new Date(value).toLocaleDateString()}</div>
);
const DateTimeCell = ({value}) => (
    <div>{new Date(value).toLocaleString()}</div>
);
const ImageCell = ({value}) => (
    <img href={value} alt="" />
);
const HTMLCell = ({value}) => (
    <pre>{value}</pre>
);
const PasswordCell = ({value}) => (
    <div>*********</div>
);
const UrlCell = ({value}) => (
    <a href={value} onClick={stopPropagationHandler}>{value}</a>
);
const EmailCell = ({value}) => (
    <a href={`mailto:${value}`} onClick={stopPropagationHandler}>{value}</a>
);
const BooleanCell = ({value}) => (
    <input type="checkbox" readOnly value={value} />
);


const cellTypes = {
    [COLUMN_TYPE.Email]: EmailCell,
    [COLUMN_TYPE.Url]: UrlCell,
    [COLUMN_TYPE.HTML]: HTMLCell,
    [COLUMN_TYPE.Password]: PasswordCell,
    [COLUMN_TYPE.Date]: DateCell,
    [COLUMN_TYPE.Time]: TimeCell,
    [COLUMN_TYPE.DateTime]: DateTimeCell,
    [COLUMN_TYPE.Image]: ImageCell,
    [COLUMN_TYPE.Boolean]: BooleanCell
};


class ToolsCell extends React.Component {
    componentDidMount() {
        if (this.props.indeterminate === true) {
            this._setIndeterminate(true);
        }
    }

    componentDidUpdate(previousProps) {
        if (previousProps.indeterminate !== this.props.indeterminate) {
            this._setIndeterminate(this.props.indeterminate);
        }
    }

    _setIndeterminate(indeterminate) {
        this._input.indeterminate = indeterminate;
    }

    _onEditClick(rowIndex, e) {
        e.stopPropagation();
        this.props.onEditBtnClick(rowIndex);
    }

    render() {
        const { rowIndex } = this.props;
        if (rowIndex === 'Header') {
            return <input ref={c => this._input = c}
                          type="checkbox"
                          checked={this.props.checked}
                          onChange={this.props.onChange} />
        }

        return (
            <Button bsSize="xsmall" bsStyle="info" onClick={this._onEditClick.bind(this, rowIndex)} >
                <FontAwesome name="pencil" />
            </Button>
        );
    }
}



class DataGrid extends Component {

    static propTypes = {
        schema: React.PropTypes.shape({
            columns: React.PropTypes.array.isRequired,
        }).isRequired,
        items: React.PropTypes.array.isRequired,
        totalItemsCount: React.PropTypes.number.isRequired,
        pageSize: React.PropTypes.number.isRequired,
        currentPage: React.PropTypes.number.isRequired,
        onEditClick: React.PropTypes.func.isRequired,

        onCellEdit: React.PropTypes.func.isRequired,
        onDeleteRow: React.PropTypes.func.isRequired,
    };

    render() {
        const {schema} = this.props;
        const visibleColumns = schema.columns.filter(col => col.showInGrid || col.isKey); // always leave key field in table

        const formatter = (cell, row, colSchema) => {
            let value = cell;
            if (colSchema.reference) {
                value = row[`${colSchema.reference.table}_${colSchema.reference.textColumn}`];
            }
            const CellComponent = cellTypes[colSchema.type] || DefaultCell;
            return <CellComponent value={value} />
        };

        const onEditBtnClick = (rowIndex) => {
            const keyField = getSchemaKey(schema);
            const id = this.props.items[rowIndex][keyField];
            this.props.onEditClick(id);
        };

        return (
            <BootstrapTable key={schema.name}
                            data={this.props.items}
                            remote={true}
                            search={true}
                            hover={true}
                            multiColumnSearch={true}
                            insertRow={true}
                            deleteRow={true}
                            selectRow={{
                                mode: 'checkbox',
                                clickToSelectAndEditCell: true,
                                bgColor: '#f9f2f4',
                                selected: [],
                                customComponent: (props) => <ToolsCell onEditBtnClick={onEditBtnClick} {...props} />
                            }}
                            pagination={true}
                            ignoreSinglePage={true}
                            fetchInfo={{dataTotalSize: this.props.totalItemsCount}}
                            tableHeaderClass='table-layout-fixed'
                            tableStyle={{overflowX: 'auto'}}

                            tableBodyClass='dataTable'
                            cellEdit={{mode: "dbclick", blurToSave: true}}
                            options={{
                                pageStartIndex: 1,
                                hideSizePerPage: true,
                                paginationShowsTotal: true,
                                page: this.props.currentPage,
                                sizePerPage: this.props.pageSize,
                                /*sizePerPageList: [5, 10, 25, 50],*/

                                onAddRow: this.props.onAddRow,
                                onCellEdit: this.props.onCellEdit,
                                onDeleteRow: this.props.onDeleteRow,
                                onPageChange: this.props.onPageChange,
                                onSortChange: this.props.onSortChange,
                                onFilterChange: this.props.onFilterChange,
                                onSizePerPageList: this.props.onSizePerPageList
                            }}>
                {visibleColumns.map((col, colIndex) => (
                    <TableHeaderColumn key={col.name}
                        isKey={col.isKey}
                        hidden={!col.showInGrid}
                        editable={!col.readOnly && !col.reference}
                        dataField={col.name}
                        dataFormat={formatter}
                        formatExtraData={col}
                        className='td-header-force-size'

                        dataSort={true}>
                        {col.reference ? col.reference.table + ' ' +col.reference.textColumn : col.title}
                    </TableHeaderColumn>
                ))}
            </BootstrapTable>
        )
    }
}

export default DataGrid;



