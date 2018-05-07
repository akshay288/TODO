import React, { Component } from 'react'
import Todo from './Todo'
import Calendar from './Calendar'
import { connect } from 'react-redux'
import { refreshState } from './actionCreators'


class App extends Component {
    componentWillMount() {
        this.props.dispatch(refreshState())
    }
    render() {
        if(this.props.loaded) {
            return (
                <div className="app">
                    <Calendar/>
                    <Todo/>
                </div>
            )
        }
        return null
    }
}

const mapStateToProps = state => ({
    loaded: state.loaded
})

export default connect(mapStateToProps)(App)
