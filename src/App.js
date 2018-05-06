import React, { Component } from 'react'
import Todo from './Todo'
import Calendar from './Calendar'
import { connect } from 'react-redux'
import { refreshState } from './actionCreators'


class App extends Component {
    componentDidMount() {
        this.props.dispatch(refreshState())
    }
    render() {
        return (
            <div className="app">
                <Calendar/>
                <Todo/>
            </div>
        )
    }
}

export default connect()(App)
