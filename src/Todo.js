import React from 'react'
import { connect } from 'react-redux'
import { newTODO, startTODO, finishTODO, deleteTODO, stopTODO, resetTODO } from './actionCreators'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField'


class Todo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {newTodoName: ''}
  
        this.handleChange = this.handleChange.bind(this)
        this.handleNewTodo = this.handleNewTodo.bind(this)
    }
  
    handleChange(event) {
        this.setState({newTodoName: event.target.value})
    }
  
    handleNewTodo(e) {
        if(this.state.newTodoName) {
            this.props.dispatch(newTODO(this.state['newTodoName']))
            this.setState({newTodoName: ''})
        }
    }
  
    render() {
        const todos = this.props.todos
        todos.sort((a, b) => (a.addedTS < b.addedTS))
        const dispatch = this.props.dispatch

        const currentTodo = todos.filter(e => e.started && !e.finished)
        const nextTodo = todos.filter(e => !e.started && !e.finished)
        const finishedTodo = todos.filter(e => e.finished)

        const currentTodoList = currentTodo.map(e => (
            <div className='todo-item working-on'>
                <div className='todo-name'>{e['name']}</div>
                <div className='todo-controls'>
                    <button className='todo-button todo-stop'
                        onClick={event => dispatch(stopTODO(e['id']))}>stop</button>
                    <button className='todo-button todo-finish'
                        onClick={event => dispatch(finishTODO(e['id']))}>finish</button>
                    <button className='todo-button todo-delete'
                        onClick={event => dispatch(deleteTODO(e['id']))}>delete</button>
                </div>
            </div>
        ));
        const nextTodoList = nextTodo.map(e => (
            <div className='todo-item'>
                <div className='todo-name'>{e['name']}</div>
                <div className='todo-controls'>
                    <button className='todo-button todo-start'
                        onClick={event => dispatch(startTODO(e['id']))}>start</button>
                    <button className='todo-button todo-finish'
                        onClick={event => dispatch(finishTODO(e['id']))}>finish</button>
                    <button className='todo-button todo-delete'
                        onClick={event => dispatch(deleteTODO(e['id']))}>delete</button>
                </div>
            </div>
        ));
        const finishedTodoList = finishedTodo.map(e => (
            <div className='todo-item'>
                <s className='todo-name'>{e['name']}</s>
                <div className='todo-controls'>
                    <button className='todo-button todo-reset'
                        onClick={event => dispatch(resetTODO(e['id']))}>reset</button>
                    <button className='todo-button todo-delete'
                        onClick={event => dispatch(deleteTODO(e['id']))}>delete</button>
                </div>
            </div>
        ));
        let currentElem = null
        if(currentTodoList.length) {
            currentElem = (
                <div className='working-on-container'>
                    <h3>Working On</h3>
                    <div className='todo-list'>{currentTodoList}</div>
                </div>
            )
        }
        const muiTheme = getMuiTheme({
            palette: {
                primary1Color: '#117a8b',
                primary2Color: '#117a8b',
                primary3Color: '#117a8b',
                accent1Color: '#117a8b',
                accent2Color: '#117a8b',
                accent3Color: '#117a8b',
            },
        });
        return (
            <div className='todos'>
                <h2 className='todo-header'>TODOS</h2>
                {currentElem}
                <div className='new-todo-container'>
                    <MuiThemeProvider muiTheme={muiTheme}>
                        <TextField
                            value={this.state.newTodoName}
                            floatingLabelText='New TODO'
                            type='text'
                            margin='normal'
                            style={{width: '100%'}}
                            onChange={this.handleChange}
                            onKeyPress={e => {if (e.key === 'Enter') {this.handleNewTodo(e)}}}/>
                    </MuiThemeProvider>
                </div>
                <div className='next-container'>
                    <div className='todo-list'>{nextTodoList}</div>
                </div>
                <div className='finished-container'>
                    <div className='todo-list'>{finishedTodoList}</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    todos: state.todos
})
  
export default connect(mapStateToProps)(Todo)