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
            // Keep the blocks list length to state.maxNumberBlocks at most
            let blocksPre
            if (state.blocks?.length >= state.maxNumberBlocks) {
                blocksPre = state.blocks.slice(0, -1)
            } else {
                blocksPre = state.blocks  || []
            }
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
            return {
                ...state,
                transactions: [...transactions, action.payload]
            }
        case 'clearTransactions':
            return {
                ...state,
                transactions: []
            }
        case 'setSelectedTransactions':
            return {
                ...state,
                selectedTransaction: action.payload
            }
        default:
            return state
    }
}
