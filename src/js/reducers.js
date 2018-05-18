import {
    NEW_TODO,
    START_TODO,
    FINISH_TODO,
    DELETE_TODO,
    STOP_TODO,
    RESET_TODO,
    MOVE_TODO,
    UPDATE_EVENTS,
    REMOVE_CALENDAR,
    ADD_CALENDAR
} from './actionTypes'
import { arrayMove } from 'react-sortable-hoc'
import { sortTodoFunc } from './utils'


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
        case MOVE_TODO:
            const nextTodos = [...state.todos]
                .filter(e => !e.started && !e.finished)
                .sort(sortTodoFunc)
            const fromID = nextTodos[action.indexFrom].id
            const toID = nextTodos[action.indexTo].id

            let allTodos = [...state.todos].sort(sortTodoFunc)
            const fromIndex = allTodos.findIndex(e => (e.id === fromID))
            const toIndex = allTodos.findIndex(e => (e.id === toID))
            allTodos = arrayMove(allTodos, fromIndex, toIndex)

            allTodos = allTodos.map((e, i) => ({...e, id: i}))

            return {
                ...state,
                todos: allTodos
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