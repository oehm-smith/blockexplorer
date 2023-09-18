import React, {useContext} from "react";
import {DispatchContext, StateContext} from "./AppContext";
import {printEth, printHexField, succinctise} from "./utils";
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {Utils} from "alchemy-sdk";

function TransactionTableRender({columns, data}) {
    const dispatch = useContext(DispatchContext);
// const table = useReactTable({
    //     data,
    //     columns,
    //     getCoreRowModel: getCoreRowModel(),
    // })

    const hasClickHandler = (id) => {
        const items = id.split('_');
        const name = items[items.length - 1].toLowerCase()

        switch (name) {
            case 'to':
            case 'from':
                return true;
        }
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

    const onClickHandler = (name, value) => {
        switch (name.toLowerCase()) {
            case 'to':
            case 'from':
                dispatch({type: 'setAddressToLookup', payload: value})
            default:
                return undefined
        }
    }

    return (
        <div>
            <h4>Transaction</h4>
            <table className="styled-table transactionTable">
                <thead>
                <tr>
                    <th>Field</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                {data.map(d => {
                    const key = Object.keys(d)[0]
                    if (hasClickHandler(key)) {
                        return (
                            <tr key={key}>
                                <td className="Align-right">{key}</td>
                                <td className="Align-left">
                                    <button onClick={() => onClickHandler(key, d[key])}>
                                        {d[key]}
                                    </button>
                                </td>
                            </tr>
                        )
                    }
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
        </div>
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
            {Value: printEth(tx.value)},
            {contractAddress: tx.contractAddress},
            {transactionIndex: tx.transactionIndex},
            {root: tx.root},
            {gasUsed: printHexField(tx.gasUsed)},
            {gasLimit: printHexField(tx.gasLimit)},
            {gasPrice: printEth(tx.gasPrice)},
            {maxFeePerGas: printEth(tx.maxFeePerGas)},
            {maxPriorityFeePerGas: printEth(tx.maxPriorityFeePerGas)},
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
