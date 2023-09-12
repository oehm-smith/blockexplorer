import React, { useContext } from "react"
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { DispatchContext, StateContext } from "./AppContext"
import { age, numberFormat, succinctise } from "./utils"

export function BlocksTableRender({ columns, data }) {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const cellAlignment = (id) => {
        const items = id.split('_');
        const name = items[items.length - 1]
        const aligns = {
            'gasLimit': 'right',
            'gasUsed': 'right'
        }
        switch (name) {
            case 'gasLimit':
            case 'gasUsed':
                return 'Align-' + aligns[name]
            default:
                return 'Align-left'
        }
    }

    const hasClickHandler = id => {
        const items = id.split('_');
        const name = items[items.length - 1]
        switch (name) {
            case 'transactions':
                return true
            default:
                return false
        }
    }
    const onClickBlockTransactions = (cell) => {
        const items = cell.id.split('_');
        const name = items[items.length - 1]
        switch (name) {
            case 'transactions':
                dispatch({type: 'clearTransactions'})
                dispatch({type: 'setBlockTransactions', payload: cell.getValue()})
            default:
                return undefined
        }
    }
    /*
      Render the UI for your table
      - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
    */
    return (
        <div className="p-2">
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => {
                                if (hasClickHandler(cell.id)) {
                                    return (
                                        <td key={cell.id} className={cellAlignment(cell.id)}>
                                            <button onClick={() => onClickBlockTransactions(cell)}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </button>
                                        </td>
                                    )
                                } else {
                                    return (
                                        <td key={cell.id} className={cellAlignment(cell.id)}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    )

                                }
                            })}
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    {table.getFooterGroups().map(footerGroup => (
                        <tr key={footerGroup.id}>
                            {footerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.footer,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </tfoot>
            </table>
            <div className="h-4"/>
        </div>
    )
}

export function BlocksTable({ blocks }) {
    const clickedRow = transactions => {
        console.log(`clickedRow - transactions: ${transactions}`)
    }

    const columnHelper = createColumnHelper()

    const columns = [
        columnHelper.accessor('hash', {
            cell: info => succinctise(info.getValue()),
        }),
        columnHelper.accessor('number', {
            cell: info => numberFormat(info.getValue()),
            header: () => <span>block<br/>number</span>,
        }),
        columnHelper.accessor('timestamp', {
            header: () => 'age',
            cell: info => age(info.getValue()),
        }),
        columnHelper.accessor('gasLimit', {
            header: () => <span>gasLimit</span>,
            cell: info => numberFormat(info.getValue())
        }),
        columnHelper.accessor('gasUsed', {
            header: 'gasUsed',
            cell: info => numberFormat(info.getValue())
        }),
        columnHelper.accessor('miner', {
            header: 'miner',
            cell: info => succinctise(info.getValue()),
        }),
        columnHelper.accessor('transactions', {
            header: '# transactions',
            cell: info => info.getValue()?.length
        }),
    ]

    return (
        <BlocksTableRender columns={columns} data={blocks}/>
    )
}
