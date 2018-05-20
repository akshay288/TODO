import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { refreshEvents } from './actionCreators'
import '../css/calendar.css'


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

    renderEvent(e, showTill = false) {
        return (
            <div className='event'>
                <div className='event-name'>{e.name}</div>
                <div className='event-time'>
                    {(showTill ? ('(' + moment(e.time).from(moment()) + ') ') : '') + this.formatTime(e.time)}
                </div>
            </div>
        )
    }

    render() {
        const events = this.props.events
        if(!events.length) {
            return null
        }
        const currentEvents = events.filter(e => moment(e.time).isBefore(moment()))
        const restEvents = events.filter(e => !moment(e.time).isBefore(moment()))

        let firstEvent = null
        let nextEvents = []
        if(restEvents.length) {
            firstEvent = restEvents[0]
            nextEvents = restEvents.slice(1)
        }
        return (
            <div className='calendar'>
                <h2 className='calendar-header'>Events</h2>
                <div className='current-event-container'>{currentEvents.map(e => this.renderEvent(e))}</div>
                {restEvents.length ? (<h4>Upcoming</h4>) : null}
                <div className='first-event-container'>{firstEvent ? this.renderEvent(firstEvent, true) : null}</div>
                <div className='next-event-list'>{nextEvents.map(e => this.renderEvent(e))}</div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    events: state.events,
    calendars: state.calendars
})

export default connect(mapStateToProps)(Calendar)
