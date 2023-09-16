import React, { useContext, useEffect } from "react"
import { DispatchContext, StateContext } from "./AppContext"
import { Alchemy } from "alchemy-sdk"
import { TransactionsTable } from "./TransactionsTable"

export function Transactions() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    // const alchemy = new Alchemy(state.settings);

    // useEffect(async () => {
    //     console.log(`  Transactions - new blockTransactions: ${state.blockTransactions.length}`)
    //
    //     async function lookupTransactions() {
    //         const transactions = [];
    //         for (let i = 0; i < state.blockTransactions.length;) {
    //             let wait = false;
    //             try {
    //                 if (!wait) {
    //                     const transaction = await alchemy.transact.getTransaction(state.blockTransactions[i]);
    //                     i += 1;
    //                     dispatch({type:'appendWithTransaction', payload: transaction})
    //                 }
    //             } catch (e) {
    //                 console.error(`Error getting transaction - ${e}`)
    //                 wait = true;
    //                 setTimeout(() => wait=false, 1000)
    //             }
    //         }
    //     }
    //
    //     await lookupTransactions()
    // }, [state.blockTransactions])

    // useEffect(() => {
    //     console.log(`  Transactions - new transactions - length: ${state.transactions.length}`)
    // }, [state.transactions])
    return (
        <>
            <h4>Matching transactions</h4>
            <TransactionsTable/>
            {/*transactions={state.transactions}/>*/}
        </>
    )
}
