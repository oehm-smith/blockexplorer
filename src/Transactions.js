import React, { useContext, useEffect } from "react"
import { DispatchContext, StateContext } from "./AppContext"
import { Alchemy } from "alchemy-sdk"
import { BlocksTable } from "./BlocksTable"
import { TransactionsTable } from "./TransactionsTable"

export function Transactions() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const alchemy = new Alchemy(state.settings);

    useEffect(async () => {
        console.log(`  Transactions - new blockTransactions: ${state.blockTransactions.length}`)
    }, [state.blockTransactions])

    return (
        <>
            <h4>Matching transactions</h4>
            <TransactionsTable transactions={state.transactions}/>
        </>
    )
}
