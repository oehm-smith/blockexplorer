import { Alchemy, Network } from 'alchemy-sdk';
import React, { useEffect, useReducer } from 'react';

import './App.css';
import { BlockNumber } from "./BlockNumber"

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

// https://hswolff.com/blog/how-to-usecontext-with-usereducer/
const StateContext = React.createContext();
const DispatchContext = React.createContext();

const appReducer = (state, action) => {
    switch (action.type) {
        case 'setBlockNumber':
            return {
                ...state,
                blockNumber: action.payload
            }
        default:
            return state
    }
}

function App() {
    const initialState = {
        blockNumber: null
    }
    const [state, dispatch] = useReducer(appReducer, initialState);
    const { blockNumber } = state;

    useEffect(() => {
        async function getBlockNumber() {
            // setBlockNumber(await alchemy.core.getBlockNumber());
            dispatch({ type: 'setBlockNumber', payload: await alchemy.core.getBlockNumber() });
        }

        getBlockNumber();
    });

    // return <div className="App">Block Number: {blockNumber}</div>;
    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                <div className="wrapper">
                    <div class="box header">Header</div>
                    <div class="box sidebar">Sidebar</div>
                    <div class="box sidebar2"><BlockNumber blockNumber={blockNumber}/></div>
                    <div class="box content">Content
                        <br/> More content than we had before so this column is now quite tall.
                    </div>
                    <div class="box footer">Footer</div>
                </div>
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}

export default App;
