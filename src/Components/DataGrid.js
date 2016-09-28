import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
// import {Button, ButtonGroup, ButtonToolbar, FormControl, InputGroup, FormGroup} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import {getSchemaKey} from "../utils";



const COLUMN_TYPE = {
    Text: 10,
    Email: 11,
    Url: 12,
    Phone: 13,
    HTML: 14,
    Password: 15,
    Date: 20,
    Time: 21,
    DateTime: 22,
    File: 30,
    Integer: 40,
    Double: 50,
    Image: 60,
    Binary: 70,
    Lookup: 80,
    Boolean: 90
};

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
    <a href={value}>{value}</a>
);
const EmailCell = ({value}) => (
    <a href={`mailto:${value}`}>{value}</a>
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


class ToolsColumnControl extends React.Component {
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
            return <input ref={(c) => this._input = c}
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
        schema: React.PropTypes.object.isRequired,
        items: React.PropTypes.array.isRequired,
        totalItemsCount: React.PropTypes.number.isRequired,
        pageSize: React.PropTypes.number.isRequired,
        currentPage: React.PropTypes.number.isRequired,
        onEditClick: React.PropTypes.func.isRequired,

        onCellEdit: React.PropTypes.func.isRequired,
        onDeleteRow: React.PropTypes.func.isRequired,
    };

    render() {
        const visibleColumns = (this.props.schema.columns || []).filter(col => col.showInGrid || col.isKey); // leave key field in table

        const formatter = (cell, row, colSchema) => {
            if (colSchema.reference) {
                return row[`${colSchema.reference.table}_${colSchema.reference.textColumn}`];
            }
            const CellComponent = cellTypes[colSchema.type];
            return CellComponent ? <CellComponent value={cell} /> : cell
        };

        const onEditBtnClick = (rowIndex) => {
            const keyField = getSchemaKey(this.props.schema);
            const id = this.props.items[rowIndex][keyField];
            this.props.onEditClick(id);
        };

        return (
            <BootstrapTable data={this.props.items}
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
                                customComponent: (props) => <ToolsColumnControl onEditBtnClick={onEditBtnClick} {...props} />
                            }}
                            pagination={true}
                            ignoreSinglePage={true}
                            fetchInfo={{dataTotalSize: this.props.totalItemsCount}}
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
                        width={col.type === COLUMN_TYPE.Integer ? '100' : null}
                        dataSort={true}>
                        {col.reference ? col.reference.table + ' ' +col.reference.textColumn : col.title}
                    </TableHeaderColumn>
                ))}
            </BootstrapTable>
        )
    }
}

export default DataGrid;



