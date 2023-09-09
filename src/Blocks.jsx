import { useContext } from "react"
import { StateContext, DispatchContext } from "./AppContext"

export function Blocks() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const { blockNumber } = state;

    return (
        <>
            <h4>Latest Blocks</h4>
            Block Number: {blockNumber}
        </>
    )
}
