import React, {useContext, useState} from "react";
import {DispatchContext, StateContext} from "./AppContext";
import {hexToDecimal, printHexField, succinctise} from "./utils";
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {Alchemy} from "alchemy-sdk";
const { Utils } = require("alchemy-sdk");

export function WalletLookup({columns, data}) {
    const [walletAddr, setWalletAddr] = useState('bbos.eth')
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
    return (
        <div className="walletLookup">
            <h4>Wallet Lookup</h4>
            <input type="text" name="walletAddress" value={walletAddr} onChange={e => setWalletAddr(e.target.value)}/>
            <button type="button" onClick={() => lookup()}>Lookup</button>
            <p>Value of wallet: {balance} Eth</p>
            <p>Transactions sent from wallet: {transactionsSent}</p>
        </div>
    )
}
