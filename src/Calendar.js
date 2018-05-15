import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { refreshEvents } from './actionCreators'


class Calendar extends Component {
    componentDidMount() {
        this.props.dispatch(
            refreshEvents(this.props.calendars.map(e => e.id))
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.calendars !== this.props.calendars) {
            this.props.dispatch(
                refreshEvents(this.props.calendars.map(e => e.id))
            )
        }
    }

    formatTime(t) {
        t = moment(t)
        if(t.isSame(moment(), 'day')) {
            return t.format('h:mm a')
        } else {
            return t.format('dddd h:mm a')
        }
    }

    render() {
        const events = this.props.events
        if(!events.length) {
            return null
        }
        const firstEvent = (
            <div className='event first-event'>
                <div className='event-name'>{events[0].name}</div>
                <div className='event-time'>
                    {this.formatTime(events[0].time) + ' (' + moment(events[0].time).from(moment()) + ')'}
                </div>
            </div>
        )
        const nextEvents = events.slice(1, events.length).map(e => (
            <div className='event'>
                <div className='event-name'>{e.name}</div>
                <div className='event-time'>{this.formatTime(e.time)}</div>
            </div>
        ))
        return (
            <div className='calendar'>
                <h2>Events</h2>
                <div className='first-event-container'>{firstEvent}</div>
                <div className='next-event-list'>{nextEvents}</div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    events: state.events,
    calendars: state.calendars
})

export default connect(mapStateToProps)(Calendar)
