import { SET_SINGLE_REQUEST} from "./Types";

export const setSingleRequest = (request) => {
    return {
        type: SET_SINGLE_REQUEST,
        payload: request
    }
}