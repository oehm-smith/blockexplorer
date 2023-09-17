import { Alchemy, Network } from 'alchemy-sdk';
import React, { useEffect, useReducer } from 'react';

import './App.css';
import { DispatchContext, StateContext } from './AppContext'
import { Blocks } from "./Blocks"
import { AppReducer } from "./AppReducer"
import { AppInitialState } from "./AppInitialState"
import { Transactions } from "./Transactions"
import {Transaction} from "./Transaction";
import {WalletLookup} from "./WalletLookup";

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
    alchemy: null
};
const alchemy = new Alchemy(settings);
settings.alchemy = alchemy;

function App() {
    const [state, dispatch] = useReducer(AppReducer, AppInitialState);

    async function getBlockNumber() {
        let blockNumber = 0;
        while (blockNumber < 1000000) {
            blockNumber = await alchemy.core.getBlockNumber();
        }
        dispatch({ type: 'setBlockNumber', payload:  blockNumber});
    }

    useEffect(async () => {

        async function setSettings() {
            dispatch({ type: 'setSettings', payload: settings });
        }

        await setSettings();
        await getBlockNumber();
    }, []);

    useEffect(() => {
        setInterval(async () => {
            await getBlockNumber()
            // Poll for new blocks
        }, 12000)
    }, [])

    return (
        <DispatchContext.Provider value={ dispatch }>
            <StateContext.Provider value={ state }>
                <div className="wrapper">
                    <div className="box header">Blockscan by Brooke</div>
                    {/*<div className="box sidebar">Not using at the moment</div>*/}
                    <div className="box content1"><Blocks/></div>
                    {/*<div className="box sidebar2">Not using at the moment</div>*/}
                    <div className="box content2"><Transactions/></div>
                    <div className="box content3"><Transaction/></div>
                    <div className="box content4"><WalletLookup/></div>
                    <div className="box footer">Blockscan</div>
                </div>
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}

export default App;
