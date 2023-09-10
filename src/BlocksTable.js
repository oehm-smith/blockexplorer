import React from "react"
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

export function BlocksTableRender({ columns, data }) {
    const rerender = React.useReducer(() => ({}), {})[1]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

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
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
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
    // const data = state.blocks
    const data = [
        {
            firstName: 'tanner',
            lastName: 'linsley',
            age: 24,
            visits: 100,
            status: 'In Relationship',
            progress: 50,
        },
        {
            firstName: 'tandy',
            lastName: 'miller',
            age: 40,
            visits: 40,
            status: 'Single',
            progress: 80,
        },
        {
            firstName: 'joe',
            lastName: 'dirte',
            age: 45,
            visits: 20,
            status: 'Complicated',
            progress: 10,
        },
    ]

    const columnHelper = createColumnHelper()

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

    const columns = [
        columnHelper.accessor('hash', {
            cell: info => succinctise(info.getValue()),
            // footer: info => info.column.id,
        }),
        columnHelper.accessor('number', {
            cell: info => <i>{info.getValue()}</i>,
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
            // footer: info => info.column.id,
        }),
        columnHelper.accessor('gasUsed', {
            header: 'gasUsed',
            // footer: info => info.column.id,
        }),
        columnHelper.accessor('miner', {
            header: 'miner',
            cell: info => succinctise(info.getValue()),
            // footer: info => info.column.id,
        }),
        columnHelper.accessor('transactions', {
            header: '# transactions',
            cell: info => info.getValue()?.length,
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
