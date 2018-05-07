import { createStore, applyMiddleware } from 'redux'
import reducer from './reducers'
import { REFRESH_STATE } from './actionTypes'
import thunk from 'redux-thunk'


const wrappedReducer = (state, action) => {
    if(action.type === REFRESH_STATE) {
        return {
            ...action.state,
            loaded: true
        }
    }
    const nextState = reducer(state, action)
    if (!action.type.includes('INIT')) {
        window.chrome.storage.sync.set({'state': nextState})
    }
    return nextState
}

const middleware = [ thunk ]

export const store = createStore(
    wrappedReducer,
    applyMiddleware(...middleware)
)