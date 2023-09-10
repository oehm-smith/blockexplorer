import React, { useContext } from "react"
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { DispatchContext, StateContext } from "./AppContext"

export function BlocksTableRender({ columns, data }) {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const rerender = React.useReducer(() => ({}), {})[1]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const cellAlignment = (id) => {
        const items = id.split('_');
        const name = items[items.length - 1]
        // console.log(`cellAlignment: ${name}`)
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
    const onClickHandler = (cell) => {
        const items = cell.id.split('_');
        const name = items[items.length - 1]
        // console.log(`onClickHandler: ${name}`)
        switch (name) {
            case 'transactions':
                // console.log(` inside transactions - ${cell.getValue().length}`)
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
                                            <button onClick={() => onClickHandler(cell)}>
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
            <button onClick={() => rerender()} className="border p-2">
                Rerender
            </button>
        </div>
    )
}

export function BlocksTable({ blocks }) {
    const succinctise = input => {
        return input.length < 11 ? input : input.substring(0, 6) + "..." + input.substring(input.length - 6)
    }

    const age = timestamp => {
        const floor = val => Math.floor(val);
        const floorOut = val => floor(val).toString(10)

        const now = new Date().getTime()
        const ms = (now - (timestamp * 1000))
        const secs = ms / 1000
        const mins = secs / 60
        const hours = mins / 60
        const days = hours / 24
        const months = days / 30.44
        const years = days / 365.24
        const monthsDiff = months - floor(years) * 12
        const daysDiff = days - floor(months) * 30.44
        const hoursDiff = hours - floor(days) * 24
        const minsDiff = mins - floor(hours) * 60
        const secsDiff = secs - floor(mins) * 60

        const output = [];
        const whatDone = new Map()

        if (years > 1) {
            output.push(floorOut(years) + ' years')
            whatDone.set('years', true)
        }
        if (monthsDiff > 1) {
            output.push(floorOut(monthsDiff) + ' months')
            whatDone.set('months', true)
        }
        if (daysDiff > 1) {
            output.push(floorOut(daysDiff) + ' days')
            whatDone.set('days', true)
        }
        if (hoursDiff > 1) {
            output.push(floorOut(hoursDiff) + ' hours')
            whatDone.set('hours', true)
        }
        if (minsDiff > 1) { //} && whatDone.size === 0) {
            output.push(floorOut(minsDiff) + ' mins')
            whatDone.set('mins', true)
        }
        if (secsDiff > 1) { // && whatDone.size === 0) {
            output.push(floorOut(secsDiff) + ' secs')
            whatDone.set('secs', true)
        }

        // console.log(`x timestamp: ${timestamp} - now: ${now}, ms: ${ms}, sec: ${secs}, secsDiff: ${secsDiff}, min: ${mins}, minsDiff: ${minsDiff}, hours: ${hours} - ${output.join(', ')}`)
        return output.join(' ')
    }

    const format = number => new Intl.NumberFormat().format(number)

    const clickedRow = transactions => {
        console.log(`clickedRow - transactions: ${transactions}`)
    }

    const columnHelper = createColumnHelper()

    const columns = [
        columnHelper.accessor('hash', {
            cell: info => succinctise(info.getValue()),
            // footer: info => info.column.id,
        }),
        columnHelper.accessor('number', {
            cell: info => format(info.getValue()),
            header: () => <span>block<br/>number</span>,
            // footer: info => info.column.id,
        }),
        columnHelper.accessor('timestamp', {
            header: () => 'age',
            cell: info => age(info.getValue()),
            // footer: info => info.column.id,
        }),
        columnHelper.accessor('gasLimit', {
            header: () => <span>gasLimit</span>,
            cell: info => format(info.getValue())
            // footer: info => info.column.id,
        }),
        columnHelper.accessor('gasUsed', {
            header: 'gasUsed',
            cell: info => format(info.getValue())
            // footer: info => info.column.id,
        }),
        columnHelper.accessor('miner', {
            header: 'miner',
            cell: info => succinctise(info.getValue()),
            // footer: info => info.column.id,
        }),
        columnHelper.accessor('transactions', {
            header: '# transactions',
            cell: info => info.getValue()?.length
            // {
            //     return (
            //         <span onClick={console.log(`yep: ` + info.getValue().length)}>Frog: {info.getValue()?.length}</span>
            //     )
            // },
            // footer: info => info.column.id,

        }),
    ]

    // const columns = [
    //     columnHelper.accessor('firstName', {
    //         cell: info => info.getValue(),
    //         footer: info => info.column.id,
    //     }),
    //     columnHelper.accessor(row => row.lastName, {
    //         id: 'lastName',
    //         cell: info => <i>{info.getValue()}</i>,
    //         header: () => <span>Last Name</span>,
    //         footer: info => info.column.id,
    //     }),
    //     columnHelper.accessor('age', {
    //         header: () => 'Age',
    //         cell: info => info.renderValue(),
    //         footer: info => info.column.id,
    //     }),
    //     columnHelper.accessor('visits', {
    //         header: () => <span>Visits</span>,
    //         footer: info => info.column.id,
    //     }),
    //     columnHelper.accessor('status', {
    //         header: 'Status',
    //         footer: info => info.column.id,
    //     }),
    //     columnHelper.accessor('progress', {
    //         header: 'Profile Progress',
    //         footer: info => info.column.id,
    //     }),
    // ]

    return (
        <BlocksTableRender columns={columns} data={blocks}/>
    )
}
