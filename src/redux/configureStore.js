import { createStore, combineReducers, applyMiddleware } from 'redux'
import auth from './auth'
import post from './post'
import profile from './profile'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { createForms } from 'react-redux-form'
import { initialPost, initialProfile } from './forms'

export const ConfigureStore = () =>{
    const store = createStore(
        combineReducers({
            auth,
            post,
            profile,
            ...createForms({
                postForm: initialPost,
                profileForm: initialProfile
            })
        }),
        applyMiddleware(thunk, logger)
    )
    return store
}