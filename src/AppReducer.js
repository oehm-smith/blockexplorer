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
        default:
            return state
    }
}
