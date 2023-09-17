import React, {useContext} from "react";
import {DispatchContext, StateContext} from "./AppContext";
import {printHexField, succinctise} from "./utils";
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";

function TransactionTableRender({columns, data}) {
    // const table = useReactTable({
    //     data,
    //     columns,
    //     getCoreRowModel: getCoreRowModel(),
    // })

    const hasClickHandler = () => {
        return false;
    }

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

    const onClickField = (cell) => {
        // NOP - and will never be called    
    }

    return (
        <table className="styled-table">
            <thead>
            <tr>
                <th>Field</th>
                <th>Value</th>
            </tr>
            </thead>
            <tbody>
            {data.map(d => {
                const key = Object.keys(d)[0]
                return (
                    <tr key={key}>
                        <td className="Align-right">{key}</td>
                        <td className="Align-left">{d[key]}</td>
                    </tr>
                )
            })
            }
            </tbody>
        </table>
        // <div className="p-2">
        //     <table>
        //         <thead>
        //         {table.getHeaderGroups().map(headerGroup => (
        //             <tr key={headerGroup.id}>
        //                 {headerGroup.headers.map(header => (
        //                     <th key={header.id}>
        //                         {header.isPlaceholder
        //                             ? null
        //                             : flexRender(
        //                                 header.column.columnDef.header,
        //                                 header.getContext()
        //                             )}
        //                     </th>
        //                 ))}
        //             </tr>
        //         ))}
        //         </thead>
        //         <tbody>
        //         {table.getRowModel().rows.map(row => (
        //             <tr key={row.id}>
        //                 {row.getVisibleCells().map(cell => {
        //                     if (hasClickHandler(cell.id)) {
        //                         return (
        //                             <td key={cell.id} className={cellAlignment(cell.id)}>
        //                                 <button onClick={() => onClickField(cell)}>
        //                                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
        //                                 </button>
        //                             </td>
        //                         )
        //                     } else {
        //                         return (
        //                             <td key={cell.id} className={cellAlignment(cell.id)}>
        //                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
        //                             </td>
        //                         )
        //
        //                     }
        //                 })}
        //             </tr>
        //         ))}
        //         </tbody>
        //         <tfoot>
        //         {table.getFooterGroups().map(footerGroup => (
        //             <tr key={footerGroup.id}>
        //                 {footerGroup.headers.map(header => (
        //                     <th key={header.id}>
        //                         {header.isPlaceholder
        //                             ? null
        //                             : flexRender(
        //                                 header.column.columnDef.footer,
        //                                 header.getContext()
        //                             )}
        //                     </th>
        //                 ))}
        //             </tr>
        //         ))}
        //         </tfoot>
        //     </table>
        //     <div className="h-4"/>
        // </div>
    )
}

export function Transaction() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    if (state.selectedTransaction) {
        const tx = state.transactions[state.selectedTransaction]
        const data = [
            {To: tx.to},
            {From: tx.from},
            {Value: printHexField(tx.value)},
            {contractAddress: tx.contractAddress},
            {transactionIndex: tx.transactionIndex},
            {root: tx.root},
            {gasUsed: printHexField(tx.gasUsed)},
            {gasLimit: printHexField(tx.gasLimit)},
            {gasPrice: printHexField(tx.gasPrice)},
            {maxFeePerGas: printHexField(tx.maxFeePerGas)},
            {maxPriorityFeePerGas: printHexField(tx.maxPriorityFeePerGas)},
            {logsBloom: tx.logsBloom},
            {transactionHash: tx.transactionHash},
            {logs: tx.logs},
            {blockNumber: tx.blockNumber},
            {type: tx.type},
            {status: tx.status},
            {cummulativeGasUsed: tx.cummulativeGasUsed},
            {effectiveGasPrice: tx.effectiveGasPrice},
            {confirmation: tx.confirmation},
            {nonce: tx.nonce},
        ]


        const columnHelper = createColumnHelper()

        const columns = [
            columnHelper.accessor('field', {
                cell: info => succinctise(info.getValue()),
            }),
            columnHelper.accessor('value', {
                cell: info => succinctise(info.getValue()),
            }),
        ]

        return (
            <TransactionTableRender columns={columns} data={data}/>
        )
    }

    return (
        <>
            <h4>Transaction</h4>
            <p>Click transactions id in list</p>
        </>
    )
}
