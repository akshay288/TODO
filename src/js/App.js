import React, { Component } from 'react'
import Todo from './Todo'
import Calendar from './Calendar'
import Options from './Options'
import { connect } from 'react-redux'
import { refreshState } from './actionCreators'
import 'font-awesome/css/font-awesome.min.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '../css/app.css'


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {optionsOpen: false}
  
        this.handleOptionsClose = this.handleOptionsClose.bind(this)
        this.handleOptionsOpen = this.handleOptionsOpen.bind(this)
    }
    componentWillMount() {
        this.props.dispatch(refreshState())
    }
    handleOptionsOpen() {
        this.setState({optionsOpen: true})
    }
    handleOptionsClose() {
        this.setState({optionsOpen: false})
    }
    render() {
        if(this.props.loaded) {
            return (
                <div className="app">
                    <Options openState={this.state['optionsOpen']} closeFunc={this.handleOptionsClose}/>
                    <div className={'main-content' + (this.state['optionsOpen'] ? ' hidden' : '')}>
                        <i className="options-button fa fa-cog fa-2x" onClick={this.handleOptionsOpen}/>
                        <Calendar/>
                        <Todo/>
                    </div>
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
