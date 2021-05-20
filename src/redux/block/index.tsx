// Types


const UPDATE_BLOCK_HASH = "UPDATE_BLOCK_HASH";

const INITIAL_STATE = {
	blockHash: undefined,
};

// Actions


export const updateBlockHash = ({blockHash}) => {
	return {
		type: UPDATE_BLOCK_HASH,
		payload: blockHash
	};
};


// Reducer


export const BlockReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case UPDATE_BLOCK_HASH:
			return { blockHash: action.payload }
		default:
			return state;
	}
};
