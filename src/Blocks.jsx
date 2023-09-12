import { Alchemy, Network } from 'alchemy-sdk';

import { useContext, useEffect } from "react"
import { StateContext, DispatchContext } from "./AppContext"
import { BlocksTable } from "./BlocksTable"

export function Blocks() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const alchemy = new Alchemy(state.settings);

    const getBlocks = async (howMany) => {
        const { blockNumber } = state;
        if (blockNumber) {
            console.log(`getBlocks(${howMany}) - blockNumber: ${blockNumber}`)
            for (let i = howMany; i > 0 ; ) {
                let wait = false;
                try {
                    if (!wait) {
                        const block = await alchemy.core.getBlock(blockNumber - i + 1);
                        // sometimes seeing random blocks - only accept if within block number range
                        i -= 1;
                        if (block.number <= blockNumber && block.number > blockNumber - state.maxNumberBlocks - 10) {    // also because dummy blocks are coming through
                            dispatch({ type: 'prependWithBlock', payload: block })
                            console.log(`accepted block #: ${blockNumber - i} w trx: ${block.transactions.length}`)
                        } else {
                            console.log(`NOT WANT block #: ${blockNumber - i} w trx: ${block.transactions.length}`)
                        }
                    }
                } catch (e) {
                    // TODO - check this is a 429 error
                    console.error(`Error getting block - ${e}`)
                    wait = true;
                    setTimeout(() => wait = false, 1000)
                }
            }
        }
    };

    useEffect(async () => {
        const numberOfBlocksToLookup = (() => {
            if (state.blocks.length === 0) {
                return state.maxNumberBlocks;
            }
            // It should be index 0 but need to double check
            const maxBlockNumberStored = Math.max(state.blocks[0].number, state.blocks[state.blocks.length - 1].number)
            const diff = state.blockNumber - maxBlockNumberStored;
            return diff > 0 ? diff : 0;
        })();
        await getBlocks(numberOfBlocksToLookup);
    }, [state.blockNumber])

    return (
        <>
            <h4>Latest Blocks from {state.blockNumber}</h4>
            <BlocksTable blocks={state.blocks}/>
        </>
    )
}
