import { Alchemy, Network } from 'alchemy-sdk';

import { useContext, useEffect } from "react"
import { StateContext, DispatchContext } from "./AppContext"
import { BlocksTable } from "./BlocksTable"

const forceRedownload = false;
const maxNumberBlocks = 10;

export function Blocks() {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const alchemy = new Alchemy(state.settings);

    let retrieveCount = {value: 0}; // increment to force retrieve new blocks

    const getBlocks = async (howMany) => {
        const { blockNumber } = state;
        if (blockNumber) {        // DEB - Don't keep getting
            console.log(`getBlocks(${howMany}) - blockNumber: ${blockNumber}`)
            // const blocks = [];
            for (let i = 0; i < howMany; ) {
                let wait = false;
                try {
                    if (!wait) {
                        const block = await alchemy.core.getBlock(blockNumber - i);
                        // sometimes seeing random blocks - only accept if within block number range
                        i += 1;
                        if (block.number <= blockNumber && block.number > blockNumber - maxNumberBlocks - 10) {    // also because dummy blocks are coming through
                            if (howMany === 1) {
                                dispatch({ type: 'prependWithBlock', payload: block })
                            } else {
                                dispatch({ type: 'appendWithBlock', payload: block })
                            }
                            console.log(`accepted block #: ${blockNumber - i} w trx: ${block.transactions.length}`)
                        } else {
                            console.log(`NOT WANT block #: ${blockNumber - i} w trx: ${block.transactions.length}`)
                        }
                    }
                } catch (e) {
                    console.error(`Error getting block - ${e}`)
                    wait = true;
                    setTimeout(() => wait = false, 1000)
                }
            }
            // console.log(`getBlocks - ${JSON.stringify(blocks.map(b => ({
            //     number: b.number,
            //     tx_len: b.transactions.length
            // })))}`)
            // dispatch({ type: 'setBlocks', payload: blocks })
        }
    };

    // useEffect(async () => {
    //     const { blockNumber } = state;
    //     console.log(`useEffect to getBlocksNew() - blockNumber: ${blockNumber}`)
    //     await getBlocksNew();
    // }, [])

    useEffect(async () => {
        // const getBlocksUpdate = async () => {
        //     if (blockNumber) {        // DEB - Don't keep getting
        //         let wait = false;
        //         try {
        //             if (!wait) {
        //                 const block = await alchemy.core.getBlock(blockNumber);
        //                 if (block.number <= blockNumber && block.number > blockNumber - maxNumberBlocks - 10) {    // also because dummy blocks are coming through
        //                     // blocks.unshift(block)
        //                     dispatch({ type: 'appendWithBlock', payload: block })
        //                     console.log(`accepted block #: ${blockNumber} w trx: ${block.transactions.length}`)
        //                 }
        //             }
        //         } catch (e) {
        //             console.error(`Error getting block - ${e}`)
        //             wait = true;
        //             setTimeout(() => wait = false, 1000)
        //         }
        //
        //     }
        // }
        const numberOfBlocksToLookup = state.blocks.length >= maxNumberBlocks ? 1 : maxNumberBlocks
        await getBlocks(numberOfBlocksToLookup);
    }, [state.blockNumber])

    return (
        <>
            <h4>Latest Blocks from {state.blockNumber}</h4>
            <BlocksTable blocks={state.blocks}/>
        </>
    )
}
