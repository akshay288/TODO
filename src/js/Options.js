import React, { Component } from 'react'
import { connect } from 'react-redux'
import queryString from 'qs'
import { removeCalendar, addCalendar } from './actionCreators'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Checkbox from 'material-ui/Checkbox'
import '../css/options.css'


class Calendar extends Component {

    state = {remoteCalendars: []}

    componentDidMount() {
        const cls = this
        window.chrome.identity.getAuthToken({ 'interactive': true }, token => {
            const headers = new Headers({
                'Authorization' : 'Bearer ' + token,
                'Content-Type': 'application/json',
            })
            const queryParams = { headers }
            const urlParams = { 'maxResults': 250 }
            const url = (
                'https://www.googleapis.com/calendar/v3/users/me/calendarList?'
                + queryString.stringify(urlParams)
            )
            fetch(url, queryParams)
                .then(response => response.json())
                .then(response => response.items.map(
                    e => ({
                        id: e.primary ? 'primary' : e.id,
                        name: e.primary ? 'primary' : e.summary
                    })
                ))
                .then(function(data) {
                    cls.setState({'remoteCalendars': data})
                }).catch(r => {console.error(r)})
        })
    }

    calendarCheck = (calendarID, calendarName) => event => {
        if(event.target.checked) {
            this.props.dispatch(addCalendar(calendarID, calendarName))
        } else {
            this.props.dispatch(removeCalendar(calendarID))
        }
    }

    render() {
        let calendarOptions = (
            <p className='desc-text'>Loading Calendars...</p>
        )
        if (this.state['remoteCalendars'].length) {
            calendarOptions = this.state['remoteCalendars'].map(e => (
                <div className='calendar-option'>
                    <MuiThemeProvider>
                        <Checkbox checked={this.props.calendars.map(c => c.id).includes(e.id)}
                        onCheck={this.calendarCheck(e.id, e.name)}
                        label={e.name}
                        />
                    </MuiThemeProvider>
                </div>
            ))
        }
        return (
            <div className={'Options' + (this.props.openState ? '': ' hidden')}>
                <i className="options-button fa fa-chevron-up fa-2x" onClick={this.props.closeFunc}/>
                <div className='menu-items'>
                    <h1>Options</h1>
                    <h3>Active Calendars</h3>
                    <div className='calendar-chooser'>{calendarOptions}</div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    calendars: state.calendars
})

export default connect(mapStateToProps)(Calendar)
