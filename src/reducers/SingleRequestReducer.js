import { SET_SINGLE_REQUEST } from "../actions/Types";

const SingleRequestReducer=(state={}, action)=>{
    switch(action.type){
        case SET_SINGLE_REQUEST:
            return Object.assign({}, state,{singleRequestData: action.payload});
        default:
            return state;
    }
}
export default SingleRequestReducer;