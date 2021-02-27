import * as ActionTypes from './ActionTypes'

const initialState = {
    isLoading: false,
    errmsg: null,
    profiles: []
}

export default (state = initialState, action) => {
    switch(action.type){
        case ActionTypes.ADD_PROFILES:
            return {...state, isLoading: false, errmsg: '', profiles: [...state.profiles,...action.profiles]}
        case ActionTypes.PROFILE_LOADING:
            return {...state, isLoading: true, errmsg: ''}
        case ActionTypes.PROFILE_FAILED:
            return {...state, isLoading: false, errmsg: action.message}
        case ActionTypes.REMOVE_PROFILE:
            return {...state, profiles: state.profiles.filter(s => s._id !== action.profile._id)}
        default:
            return state
    }
}