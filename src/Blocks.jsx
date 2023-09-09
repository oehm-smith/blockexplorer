import { Alchemy, Network } from 'alchemy-sdk';

import { useContext } from "react"
import { StateContext, DispatchContext } from "./AppContext"
import { BlocksTable } from "./BlocksTable"

export function Blocks() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const alchemy = new Alchemy(state.settings);

    const { blockNumber } = state;
    const getBlocksNew = (async () => {
        if (state.blocks.length === 0) {        // DEB - Don't keep getting
            const blocks = [];
            try {
                for (let i = 0; i < 10; i++) {
                    const block = await alchemy.core.getBlock(blockNumber - i);
                    blocks.unshift(block)
                }
            } catch (e) {
                throw Error(`Error getting block - ${e}`)
            }
            console.log(`getBlocks - ${JSON.stringify(blocks.map(b => ({
                number: b.number,
                tx_len: b.transactions.length
            })))}`)
            dispatch({ type: 'setBlocks', payload: blocks })
        }
    })()

    return (
        <>
            <h4>Latest Blocks</h4>
            <BlocksTable blocks={state.blocks}/>
        </>
    )
}
