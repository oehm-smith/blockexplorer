export const AppReducer = (state, action) => {
    switch (action.type) {
        case 'setBlockNumber':
            return {
                ...state,
                blockNumber: action.payload
            }
        case 'setSettings':
            return {
                ...state,
                settings: action.payload
            }
        case 'setBlocks':
            // changing to appendWithBlock
            return {
                ...state,
                blocks: action.payload
            }
        case 'appendWithBlock':
            const blocks = state.blocks || []
            return {
                ...state,
                blocks: [...blocks, action.payload]
            }
        case 'prependWithBlock':
            // This is when there is on new block (and it is from a new block) - so prepend and delete the last one
            const blocksPre = state.blocks.slice(0,-1) || []
            return {
                ...state,
                blocks: [action.payload, ...blocksPre]
            }
        case 'setBlockTransactions':
            return {
                ...state,
                blockTransactions: action.payload
            }
        case 'appendWithTransaction':
            const transactions = state.transactions || []
            // console.log(`reducer - appendWithTransaction - index: ${action.payload.transactionIndex}`)
            return {
                ...state,
                transactions: [...transactions, action.payload]
            }
        case 'clearTransactions':
            return {
                ...state,
                transactions: []
            }
        default:
            return state
    }
}
