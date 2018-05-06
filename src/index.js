import React from 'react';
import ReactDOM from 'react-dom'
import App from './App'
import { store } from './configureStore'
import { Provider } from 'react-redux'
import { refreshState } from './actionCreators'


const inView = dispatch => {
    window.addEventListener('visibilitychange', e => {
        dispatch(refreshState());
    });
}
store.dispatch(inView)

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);