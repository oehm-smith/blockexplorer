import { Alchemy, Network } from 'alchemy-sdk';

import { useContext } from "react"
import { StateContext, DispatchContext } from "./AppContext"
import { BlocksTable } from "./BlocksTable"

const forceRedownload = false;

export function Blocks() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const alchemy = new Alchemy(state.settings);

    const { blockNumber } = state;
    const getBlocksNew = (async () => {
        if (forceRedownload || state.blocks.length === 0) {        // DEB - Don't keep getting
            const blocks = [];
            for (let i = 0; i < 10;) {
                let wait = false;
                try {
                    if (!wait) {
                        const block = await alchemy.core.getBlock(blockNumber - i);
                        // only accept if it has transactions
                        if (block.transactions.length > 0) {    // also because dummy blocks are coming through
                            blocks.unshift(block)
                            console.log(`accepted block #: ${blockNumber - i} w trx: ${block.transactions.length}`)
                        } else {
                            console.log(`NOT WANT block #: ${blockNumber - i} w trx: ${block.transactions.length}`)
                        }
                        i += 1;
                    }
                } catch (e) {
                    console.error(`Error getting block - ${e}`)
                    wait = true;
                    setTimeout(() => wait=false, 1000)
                }
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
