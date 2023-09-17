import React, {useContext} from "react";
import {DispatchContext, StateContext} from "./AppContext";
import {printHex, printHexField} from "./utils";

export function Transaction() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    if (state.selectedTransaction) {
        const tx = state.transactions[state.selectedTransaction]
        return (
            <>
                <h4>Transaction</h4>
                <span>Got a tx: {state.selectedTransaction}</span>
                <p>To: {tx.to} </p>
                <p>From: {tx.from} </p>
                <p>Value: {printHexField(tx.value)} </p>
                <p>contractAddress: {tx.contractAddress} </p>
                <p>transactionIndex: {tx.transactionIndex} </p>
                <p>root: {tx.root} </p>
                <p>gasUsed: {printHexField(tx.gasUsed)} </p>
                <p>gasLimit {printHexField(tx.gasLimit)} </p>
                <p>gasPrice: {printHexField(tx.gasPrice)} </p>
                <p>maxFeePerGas: {printHexField(tx.maxFeePerGas)} </p>
                <p>maxPriorityFeePerGas: {printHexField(tx.maxPriorityFeePerGas)} </p>
                <p>logsBloom: {tx.logsBloom} </p>
                <p>transactionHash: {tx.transactionHash} </p>
                <p>logs: {tx.logs} </p>
                <p>blockNumber: {tx.blockNumber} </p>
                <p>type: {tx.type} </p>
                <p>status: {tx.status} </p>
                <p>cummulativeGasUsed: {tx.cummulativeGasUsed} </p>
                <p>effectiveGasPrice: {tx.effectiveGasPrice} </p>
                <p>confirmation: {tx.confirmation} </p>
                <p>nonce: {tx.nonce} </p>
            </>
        )
    }
    return (
        <>
            <h4>Transaction</h4>
            <p>Click transactions id in list</p>
        </>
    )
}
