import React, { Component } from 'react'
import { connect } from 'react-redux'
import { refreshEvents } from './actionCreators'


class Calendar extends Component {
    componentDidMount() {
        this.props.dispatch(refreshEvents())
    }
    render() {
        const events = this.props.events
        if(!events.length) {
            return null
        }
        const firstEvent = (
            <div className='event first-event'>
                <div className='event-name'>{events[0].name}</div>
                <div className='event-time'>{events[0].time}</div>
            </div>
        )
        const nextEvents = events.slice(1, events.length).map(e => (
            <div className='event'>
                <div className='event-name'>{e.name}</div>
                <div className='event-time'>{e.time}</div>
            </div>
        ))
        return (
            <div className='calendar'>
                <div className='first-event-container'>{firstEvent}</div>
                <div className='next-event-list'>{nextEvents}</div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    events: state.events
})

export default connect(mapStateToProps)(Calendar)
