import React, {useContext, useEffect, useState} from "react";
import {DispatchContext, StateContext} from "./AppContext";
import {hexToDecimal, printHexField, succinctise} from "./utils";
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {Alchemy} from "alchemy-sdk";

const {Utils} = require("alchemy-sdk");

export function WalletLookup({columns, data}) {
    const [walletAddr, setWalletAddr] = useState('vitalik.eth')
    const [balance, setBalance] = useState(0)
    const [transactionsSent, setTransactionsSent] = useState(0)

    const state = useContext(StateContext);
    const alchemy = new Alchemy(state.settings);

    const lookup = async () => {
        try {
            const balance = await alchemy.core.getBalance(walletAddr)
            setBalance(Utils.formatEther(balance._hex))
            const transactions = await alchemy.core.getTransactionCount(walletAddr)
            setTransactionsSent(transactions)
        } catch (e) {
            console.error(`getBalance Error - ` + e)
        }
    }

    useEffect(() => {
        setWalletAddr(state.addressToLookup)
        lookup()
    }, [state.addressToLookup])

    // useEffect(() => {
    //     lookup();
    // })

    return (
        <div className="walletLookup">
            <h4>Wallet Lookup</h4>
            <div className="walletLookupInput">
                <input type="text" name="walletAddress" value={walletAddr} onChange={e => setWalletAddr(e.target.value)}/>
                <button type="button" onClick={() => lookup()}>Lookup</button>
            </div>
            <table className="styled-table walletLookupTable">
                <tbody>
                <tr key="value">
                    <td className="Align-right tdTitle">Value of wallet</td>
                    <td className="Align-left">{balance} Eth</td>
                </tr>
                <tr key="transactionsSent">
                    <td className="Align-right tdTitle">Transactions sent from wallet</td>
                    <td className="Align-left">{transactionsSent}</td>
                </tr>
                </tbody>
            </table>
        </div>)
}
