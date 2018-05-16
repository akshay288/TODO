import queryString from 'qs'
import {
    NEW_TODO,
    START_TODO,
    FINISH_TODO,
    DELETE_TODO,
    STOP_TODO,
    RESET_TODO,
    UPDATE_EVENTS,
    REFRESH_STATE,
    REMOVE_CALENDAR,
    ADD_CALENDAR
} from './actionTypes'
import moment from 'moment'
import { initialState } from './reducers'


export function newTODO(name) {
    return {
        type: NEW_TODO,
        name: name
    }
}

export function startTODO(todoID) {
    return {
        type: START_TODO,
        todoID: todoID
    }
}

export function finishTODO(todoID) {
    return {
        type: FINISH_TODO,
        todoID: todoID 
    }
}

export function deleteTODO(todoID) {
    return {
        type: DELETE_TODO,
        todoID: todoID 
    }
}

export function stopTODO(todoID) {
    return {
        type: STOP_TODO,
        todoID: todoID 
    }
}

export function resetTODO(todoID) {
    return {
        type: RESET_TODO,
        todoID: todoID 
    }
}

export function removeCalendar(calendarID) {
    return {
        type: REMOVE_CALENDAR,
        calendarID
    }
}

export function addCalendar(calendarID, calendarName) {
    return {
        type: ADD_CALENDAR,
        calendarID,
        calendarName
    }
}

export function refreshState() {
    return dispatch => {
        window.chrome.storage.sync.get('state', state => {
            if(state.hasOwnProperty('state')) {
                dispatch({
                    type: REFRESH_STATE,
                    state: state['state']
                })
            } else {
                dispatch({
                    type: REFRESH_STATE,
                    state: initialState
                })
            }
        })
    }
}

export function refreshEvents(calendarIDS) { 
    const getCalendarEvents = calendarID => {
        return new Promise((resolve, reject) => {
            window.chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
                const headers = new Headers({
                    'Authorization' : 'Bearer ' + token,
                    'Content-Type': 'application/json',
                })
                const queryParams = { headers };
                const urlParams = {
                    'calendarId': calendarID,
                    'timeMin': (new Date()).toISOString(),
                    'timeMax': (new Date(Date.now() + 24*60*60*1000)).toISOString(),
                    'showDeleted': false,
                    'singleEvents': true,
                    'maxResults': 10,
                    'orderBy': 'startTime'
                }
                const url = (
                    'https://www.googleapis.com/calendar/v3/calendars/'
                    + calendarID + '/events?' + queryString.stringify(urlParams)
                )
            
                return fetch(url, queryParams)
                    .then(response => response.json())
                    .then(response => response.items.map(
                        e => ({
                            time: e.start.dateTime || e.start.date,
                            name: e.summary
                        })
                    ))
                    .then(e => resolve(e))
                    .catch(e => reject(e))
            })
        })
    }

    return dispatch => {
        Promise
            .all(calendarIDS.map(getCalendarEvents))
            .then(function(data) {
                // Flatten the list passed
                let events = data.reduce((acc, val) => acc.concat(val), [])
                events = events.sort((a, b) => (moment(a.time).isBefore(moment(b.time)) ? -1 : 1))
                events = events.slice(0, 10)
                dispatch({
                    type: UPDATE_EVENTS,
                    events: events
                })
            }).catch(r => {console.error(r)})
    }
}