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
            return {
                ...state,
                blocks: action.payload
            }
        case 'setBlockTransactions':
            return {
                ...state,
                blockTransactions: action.payload
            }
        case 'appendWithTransaction':
            const transactions = state.transactions || []
            console.log(`reducer - appendWithTransaction - index: ${action.payload.transactionIndex}`)
            return {
                ...state,
                transactions: [...transactions, action.payload]
            }
        default:
            return state
    }
}
