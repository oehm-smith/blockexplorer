import { Alchemy, Network } from 'alchemy-sdk';
import React, { useEffect, useReducer } from 'react';

import './App.css';
import { DispatchContext, StateContext } from './AppContext'
import { BlockNumber } from "./BlockNumber"
import { Blocks } from "./Blocks"
import { AppReducer } from "./AppReducer"
import { AppInitialState } from "./AppInitialState"

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
    // const { blockNumber } = state;

    useEffect(() => {
        async function getBlockNumber() {
            // setBlockNumber(await alchemy.core.getBlockNumber());
            dispatch({ type: 'setBlockNumber', payload: await alchemy.core.getBlockNumber() });
        }

        async function setSettings() {
            // setBlockNumber(await alchemy.core.getBlockNumber());
            dispatch({ type: 'setSettings', payload: settings });
        }

        getBlockNumber();
        setSettings();
    }, []);

    // return <div className="App">Block Number: {blockNumber}</div>;
    return (
        <DispatchContext.Provider value={ dispatch }>
            <StateContext.Provider value={ state }>
                <div className="wrapper">
                    <div className="box header">Header</div>
                    {/*<div className="box sidebar">Not using at the moment</div>*/}
                    <div className="box content1"><Blocks/></div>
                    {/*<div className="box sidebar2">Not using at the moment</div>*/}
                    <div className="box content2">Content
                        <br/> More content than we had before so this column is now quite tall.
                        <br/> More content than we had before so this column is now quite tall.
                        <br/> More content than we had before so this column is now quite tall.
                        <br/> More content than we had before so this column is now quite tall.
                        <br/> More content than we had before so this column is now quite tall.
                    </div>
                    <div className="box footer">Footer</div>
                </div>
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}

export default App;
