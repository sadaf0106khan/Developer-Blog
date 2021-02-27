import * as ActionTypes from './ActionTypes'
const initialState = {
    isLoading: false,
    isAuthenticated: localStorage.getItem('token')?true:false,
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')):null,
    errmsg: null
}
export default (state=initialState, action) => {
    switch(action.type){
        case ActionTypes.LOGIN_REQUEST:
            return {...state, isLoading:true, isAuthenticated: false,token:null, user:null,errmsg:null}
        case ActionTypes.LOGIN_SUCCESS:
            return {...state,isLoading: false, isAuthenticated: true,token:action.token,user:action.user}
        case ActionTypes.LOGIN_FAILED:
            return {...state, isLoading:false, errmsg:action.errmsg}
        case ActionTypes.LOGOUT_REQUEST:
            return {...state, isLoading:true}
        case ActionTypes.LOGOUT_SUCCESS:
            return {...state, isLoading:false, isAuthenticated: false, user: null, token: null}
        default:
            return state
    }
}
