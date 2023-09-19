import React, { useContext, useEffect } from "react"
import { DispatchContext, StateContext } from "./AppContext"
import { Alchemy } from "alchemy-sdk"
import { TransactionsTable } from "./TransactionsTable"

export function Transactions() {
    return (
        <>
            <h4>Matching transactions</h4>
            <TransactionsTable/>
        </>
    )
}
