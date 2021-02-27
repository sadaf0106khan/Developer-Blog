import * as ActionTypes from './ActionTypes'

const initialState = {
    isLoading: false,
    errmsg: null,
    posts: []
}

export default (state = initialState, action) => {
    switch(action.type){
        case ActionTypes.ADD_POSTS:
            return {...state, isLoading: false, errmsg: '', posts: [...state.posts,...action.posts]}
        case ActionTypes.POST_LOADING:
            return {...state, isLoading: true, errmsg: ''}
        case ActionTypes.POST_FAILED:
            return {...state, isLoading: false, errmsg: action.message}
        case ActionTypes.REMOVE_POST:
            return {...state, posts: state.posts.filter(s => s._id !== action.post._id)}
        default:
            return state
    }
}