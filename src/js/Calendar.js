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
        return moment(t).format('h:mm a')
    }

    renderEvent(e, showTill = false) {
        return (
            <div className='event'>
                <div className='event-name'>{e.name}</div>
                <div className='event-time'>
                    <span className='relative-time'>
                        {(showTill ? ('(' + moment(e.time).from(moment()) + ')') : '')}
                    </span>
                    <span className='clock-time'>{this.formatTime(e.time)}</span>
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
        const todayEvents = restEvents.filter(e => moment(e.time).isSame(moment(), 'day'))
        const tommorowEvents = restEvents.filter(e => !moment(e.time).isSame(moment(), 'day'))

        let firstEvent = null
        let nextEvents = []
        if(todayEvents.length) {
            firstEvent = todayEvents[0]
            nextEvents = todayEvents.slice(1)
        }
        return (
            <div className='calendar'>
                <h2 className='calendar-header'>Events</h2>
                <div className='current-event-container'>{currentEvents.map(e => this.renderEvent(e))}</div>
                {todayEvents.length ? (<h4>Upcoming</h4>) : null}
                <div className='first-event-container'>{firstEvent ? this.renderEvent(firstEvent, true) : null}</div>
                <div className='next-event-list'>{nextEvents.map(e => this.renderEvent(e))}</div>
                {tommorowEvents.length ? (<h4>Tommorow</h4>) : null}
                <div className='tommorow-event-list'>{tommorowEvents.map(e => this.renderEvent(e))}</div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    events: state.events,
    calendars: state.calendars
})

export default connect(mapStateToProps)(Calendar)
