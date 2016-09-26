import React, {Component} from 'react';
import {Table, Column, Cell} from 'fixed-data-table';
import Dimensions from 'react-dimensions';
import 'fixed-data-table/dist/fixed-data-table.min.css';

const SORT_ASC = 'ASC';
const SORT_DESC = 'DESC';

// const DateCell = ({rowIndex, data, col, ...props}) => (
//     <Cell {...props}>
//         {data.getObjectAt(rowIndex)[col].toLocaleString()}
//     </Cell>
// );

// const LinkCell = ({rowIndex, data, col, ...props}) => (
//     <Cell {...props}>
//         {/*<a href="#">{data.getObjectAt(rowIndex)[col]}</a>*/}
//     </Cell>
// );

// const TextCell = ({rowIndex, data, col, ...props}) => (
//     <Cell {...props}>
//         {data[rowIndex].title}
//     </Cell>
// );

class SortHeaderCell extends React.Component {

    static propTypes = {
        sortDir: React.PropTypes.oneOf([SORT_ASC, SORT_DESC]),
        onSortChange: React.PropTypes.func.isRequired
    };

    render() {
        const {sortDir, children} = this.props;
        return (
            <Cell>
                <a onClick={this._onSortChange.bind(this)}>
                    {children} {sortDir ? (sortDir === SORT_DESC ? '↓' : '↑') : ''}
                </a>
            </Cell>
        );
    }

    _onSortChange(e) {
        e.preventDefault();
        if (!this.props.onSortChange) return;
        this.props.onSortChange(
            this.props.columnKey,
            this.props.sortDir !== SORT_DESC ? SORT_DESC : SORT_ASC
        );
    }
}


class DataGrid extends Component {

    static propTypes = {
        schema: React.PropTypes.object.isRequired,
        items: React.PropTypes.array.isRequired,
        onEditClick: React.PropTypes.func.isRequired,
        onDeleteClick: React.PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            items: [],
            columnWidths: {},
            colSortDirs: {},
        };

        this._onColumnResizeEndCallback = this._onColumnResizeEndCallback.bind(this);
    }

    _onColumnResizeEndCallback(newColumnWidth, columnKey) {
        this.setState(({columnWidths}) => ({
            columnWidths: {
                ...columnWidths,
                [columnKey]: newColumnWidth,
            }
        }));
    }

    _onSortChange(columnKey, sortDir) {
        this.setState(({colSortDirs}) => ({
            colSortDirs: {
                ...colSortDirs,
                [columnKey]: sortDir,
            },
        }));
    }

    render() {
        const { items, schema } = this.props;
        const {columnWidths, colSortDirs} = this.state;

        if (!items.length) {
            return <p>No Data</p>
        }

        const visibleColumns = schema.columns.filter(col => col.showInGrid);

        const defaultColWidth = this.props.containerWidth / visibleColumns.length;

        const renderColHeaderCell = (col) => (
            <SortHeaderCell
                onSortChange={this._onSortChange.bind(this)}
                sortDir={colSortDirs[col.name]}>
                {col.title}
            </SortHeaderCell>
        );

        const getCellData = (rowIndex, colIndex) => {
            const row = this.props.items[rowIndex];
            return row[visibleColumns[colIndex].name];
        };

        return (
            <Table
                rowHeight={38}
                headerHeight={50}
                rowsCount={items.length}
                onColumnResizeEndCallback={this._onColumnResizeEndCallback.bind(this)}
                isColumnResizing={false}
                width={this.props.containerWidth}
                height={500}>
                {visibleColumns.map((col, colIndex) => (
                    <Column key={col.name}
                        columnKey={col.name}
                        header={renderColHeaderCell(col)}
                        cell={({rowIndex}) => <Cell>{getCellData(rowIndex, colIndex)}</Cell>}
                        width={columnWidths[visibleColumns[colIndex].name] || defaultColWidth}
                        isResizable={true} />
                ))}
            </Table>
        )
    }
}

export default Dimensions()(DataGrid);

