import * as ActionTypes from './ActionTypes'
import { toast } from 'react-toastify'
import { baseUrl } from '../baseUrl'
const getAuthHeader = () => {
    const auth_header = 'Bearer ' + localStorage.getItem('token').slice(1,-1) 
    if(parseInt(localStorage.getItem('expiry')) < Date.now()-5000)
        return null
    else
        return auth_header
}
export const loginRequest = () => ({
    type: ActionTypes.LOGIN_REQUEST
})

export const loginSuccess = (token, user) => ({
    type: ActionTypes.LOGIN_SUCCESS,
    token, 
    user
})

export const loginFailed = (errmsg) => ({
    type: ActionTypes.LOGIN_FAILED,
    errmsg
})

export const loginUser = (creds) =>
    (dispatch) => {
        dispatch(loginRequest())
        const url = baseUrl + 'login'
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(creds)
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                const {token, user, profile, expiresIn}= data
                localStorage.setItem('expiry',(Date.now()+expiresIn*1000).toString())
                localStorage.setItem('token', JSON.stringify(token))
                localStorage.setItem('user', JSON.stringify(user))
                dispatch(loginSuccess(token, user))
                toast.success('login success!!')
                if(profile) localStorage.setItem('profile', JSON.stringify(profile))
            }else{
                dispatch(loginFailed(data.message))
                toast.error(data.message)
            }
        })
        .catch(err => dispatch(loginFailed(err.message)))
    }

export const logoutRequest = () => ({
    type: ActionTypes.LOGOUT_REQUEST
})

export const logoutSuccess = () => ({
    type: ActionTypes.LOGOUT_SUCCESS
})

export const logoutUser = () =>
    (dispatch) => {
        dispatch(logoutRequest())       
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('profile')
        localStorage.removeItem('expiry')
        dispatch(logoutSuccess())  
        toast.success('logged out!!')  
    }

export const addProfile = (profiles) => ({
    type: ActionTypes.ADD_PROFILES,
    profiles
})

export const profileLoading = () => ({
    type: ActionTypes.PROFILE_LOADING
})

export const profileFailed = () => ({
    type: ActionTypes.PROFILE_FAILED
})

export const removeProfile = (profile) => ({
    type: ActionTypes.REMOVE_PROFILE,
    profile
})

export const fetchProfile = () =>
    (dispatch) => {
        dispatch(profileLoading())
        const url = baseUrl + 'profile'
        fetch(url)
            .then(response => response.json())
            .then(data =>{
                if(data.success){
                    dispatch(addProfile(data.profiles))
                }else{
                    console.log(data)
                    dispatch(profileFailed(data.message))
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(profileFailed(err))
            })
    }

export const addPost = (posts) => ({
    type: ActionTypes.ADD_POSTS,
    posts
})

export const postLoading = () => ({
    type: ActionTypes.POST_LOADING
})

export const postFailed = () => ({
    type: ActionTypes.POST_FAILED
})

export const removePost = (post) => ({
    type: ActionTypes.REMOVE_POST,
    post
})

export const fetchPost = () =>
    (dispatch) => {
        dispatch(postLoading())
        const url = baseUrl + 'post'
        fetch(url)
            .then(response => response.json())
            .then(data =>{
                if(data.success){
                    dispatch(addPost(data.posts))
                }else{
                    console.log(data)
                    dispatch(postFailed(data.message))
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(postFailed(err))
            })
    }
export const savePost = (data, history) => 
    (dispatch) => {
        const auth_header = getAuthHeader()
        if(auth_header==null){
            dispatch(logoutUser())
            return
        }
        const url = baseUrl + 'post'
        return fetch(url, {
                method: 'POST',
                headers: { 
                    'Authorization': auth_header
                },
                body: data
            })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    console.log(data)
                    toast.success(data.message)
                    dispatch(addPost([data.post]))
                    history.replace('/')
                }else{
                    toast.error(data.message)
                }
            })
            .catch(err => toast.error(err.message))
    }
export const editPost = (data, history) => 
    (dispatch) => {
        const auth_header = getAuthHeader()
        if(auth_header==null){
            dispatch(logoutUser())
            return
        }
        const url = baseUrl + 'post/' + data.get('_id')
        return fetch(url, {
                method: 'PUT',
                headers: { 
                    'Authorization': auth_header
                },
                body: data
            })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    console.log(data)
                    toast.success(data.message)
                    dispatch(removePost(data.post))
                    dispatch(addPost([data.post]))
                    history.replace('/')
                }else{
                    toast.error(data.message)
                }
            })
            .catch(err => toast.error(err.message))
    }
export const saveProfile = (data, history) => 
    (dispatch) => {
        const auth_header = getAuthHeader()
        if(auth_header==null){
            dispatch(logoutUser())
            return
        }
        const url = baseUrl + 'profile'
        return fetch(url, {
                method: 'POST',
                headers: {    
                    'Authorization': auth_header
                },
                body: data
            })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    console.log(data)
                    localStorage.setItem('profile', JSON.stringify(data.profile))
                    dispatch(addProfile([data.profile]))
                    toast.success(data.message)
                    history.replace('/profile')
                }else{
                    toast.error(data.message)
                }
            })
            .catch(err => toast.error(err.message))
    }
export const editProfile = (data, history) => 
    (dispatch) => {
        const auth_header = getAuthHeader()
        if(auth_header==null){
            dispatch(logoutUser())
            return
        }
        const url = baseUrl + 'profile/' + data.get('_id')
        return fetch(url, {
                method: 'PUT',
                headers: {    
                    'Authorization': auth_header
                },
                body: data
            })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    console.log(data)
                    localStorage.setItem('profile', JSON.stringify(data.profile))
                    dispatch(removeProfile(data.profile))
                    dispatch(addProfile([data.profile]))
                    toast.success(data.message)
                    history.replace('/profile')
                }else{
                    toast.error(data.message)
                }
            })
            .catch(err => toast.error(err.message))
    }
export const likePost = (postId) => 
    (dispatch) => {
        const auth_header = getAuthHeader()
        if(auth_header==null){
            dispatch(logoutUser())
            return
        }
        const url = baseUrl + 'post/' + postId + '/like'
        return fetch(url, {
                method: 'GET',
                headers: {    
                    'Authorization': auth_header,
                }
            })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    console.log(data)
                    dispatch(removePost(data.post))
                    dispatch(addPost([data.post]))
                    toast.success(data.message)
                }else{
                    toast.error(data.message)
                }
            })
            .catch(err => toast.error(err.message))
    }
export const saveComment = (comment,postId) => 
    (dispatch) => {
        const auth_header = getAuthHeader()
        if(auth_header==null){
            dispatch(logoutUser())
            return
        }
        const url = baseUrl + 'post/' + postId + '/comment'
        return fetch(url, {
                method: 'POST',
                headers: {    
                    'Authorization': auth_header,
                },
                body: comment
            })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    console.log(data)
                    dispatch(removePost(data.post))
                    dispatch(addPost([data.post]))
                    toast.success(data.message)
                }else{
                    toast.error(data.message)
                }
            })
            .catch(err => toast.error(err.message))
    }