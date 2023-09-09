import { StateContext } from "./AppContext"
import React, { useContext } from "react"

export function BlockNumber(props) {
    const state = useContext(StateContext);
    // const dispatch = useContext(DispatchContext);

    console.log(`StateContext: ${StateContext}`)
    const { blockNumber } = state;
    return (
        <>Block Number: {blockNumber}</>
    )
}
