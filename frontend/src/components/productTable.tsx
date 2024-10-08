import './ProductTable.css'
import './productTable'
import { Fragment, useState, useMemo } from 'react'
import {
    Column,
    ColumnDef,
    PaginationState,
    Table,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    Row,
    getExpandedRowModel,
    SortingState,
  } from '@tanstack/react-table';
import { Product } from '../dataModels/Product';
import getProducts from '../api/GetProductAPI';

function ProductTable() {
    // table
    const columns = useMemo<ColumnDef<Product>[]>(
        () => [
            {
                accessorKey: 'productName',
                header: () => 'Product Name',
                enableSorting: false
            },
            {
                accessorKey: 'category',
                header: () => 'category',
                enableSorting: false
            },
            {
                accessorKey: 'price',
                header: () => 'price',
                enableSorting: true
            },
            {
                accessorKey: 'seller',
                header: () => 'Seller',
                enableSorting: false
            }
        ]
        ,[]
    )
    
    // setting
    const [data] = useState(() => getProducts(1000));

    const [sorting, setSorting] = useState<SortingState>([])

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // reactTable
    const table = useReactTable({
        columns,
        data,
        debugTable: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => true,
        state: {
          sorting,
          pagination,
        },
        // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
    });

    // expand
    const renderSubComponent = ({ row }: { row: Row<Product> }) => {
        return (
          <div className="productDetails">
            <p>{row.original.description}</p> 
            <div style={{textAlign:'right'}}>
              <button className='buyBtn'>Buy Now</button>
            </div>
          </div>
        )
    }

    // render
    return (
        <div className="main">
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id}>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <Fragment key={row.id}>
                    <tr onClick={row.getToggleExpandedHandler()}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    })}
                  </tr>
                  {row.getIsExpanded() && (
                    <tr>
                      <td colSpan={row.getVisibleCells().length}>
                      {renderSubComponent({row})}
                      </td>
                    </tr>
                  )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
          <div className="flex items-center">
            <button
              className="border rounded p-1"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount().toLocaleString()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-16"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div>
            Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
            {table.getRowCount().toLocaleString()} Rows
          </div>
          <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>
        </div>
    );
    
}

export default ProductTable;

