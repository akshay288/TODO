import {
    NEW_TODO,
    START_TODO,
    FINISH_TODO,
    DELETE_TODO,
    STOP_TODO,
    RESET_TODO,
    UPDATE_EVENTS,
    REMOVE_CALENDAR,
    ADD_CALENDAR
} from './actionTypes.js'


export const initialState = {
    todos: [],
    events: [],
    calendars: [
        {
            id: 'primary',
            name: 'primary'
        }
    ],
    loaded: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case NEW_TODO:
            let newID = 0;
            if(state.todos.length) {
                newID = Math.max(...state.todos.map(e => e.id)) + 1
            } 
            return {
                ...state,
                todos: [
                    ...state.todos,
                    {
                        id: newID,
                        name: action.name,
                        addedTS: Date.now(),
                        startedTS: -1,
                        started: false,
                        finished: false
                    }
                ]
            }
        case START_TODO:
            return {
                ...state,
                todos: state.todos.map(e => ({
                    ...e,
                    started: (e.id === action.todoID) ? true : false,
                    startedTS: (e.id === action.todoID) ? Date.now() : -1
                }))
            }
        case FINISH_TODO:
            return {
                ...state,
                todos: state.todos.map(e => ({
                    ...e, finished: (e.id === action.todoID) ? true : e.finished
                }))
            }
        case STOP_TODO:
            return {
                ...state,
                todos: state.todos.map(e => ({
                    ...e, started: (e.id === action.todoID) ? false : e.started
                }))
            }
        case RESET_TODO:
            return {
                ...state,
                todos: state.todos.map(e => ({
                    ...e,
                    started: (e.id === action.todoID) ? false : e.started,
                    finished: (e.id === action.todoID) ? false : e.finished
                }))
            }
        case DELETE_TODO:
            return {
                ...state,
                todos: state.todos.filter(e => e.id !== action.todoID)
            }
        case UPDATE_EVENTS:
            return {
                ...state,
                events: action.events
            }
        case REMOVE_CALENDAR:
            return {
                ...state,
                calendars: state.calendars.filter(e => e.id !== action.calendarID)
            }
        case ADD_CALENDAR:
            if (state.calendars.map(e => e.calendarID).includes(action.calendarID)) {
                return state
            }
            return {
                ...state,
                calendars: [
                    ...state.calendars,
                    {
                        id: action.calendarID,
                        name: action.calendarName
                    }
                ]
            }
        default:
            return state
    }
}