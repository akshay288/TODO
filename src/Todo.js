import React from 'react'
import { connect } from 'react-redux'
import { newTODO, startTODO, finishTODO, deleteTODO, stopTODO, resetTODO } from './actionCreators'


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
            <div className='todo-item'>
                <div className='todo-name'>{e['name']}</div>
                <button className='todo-button todo-stop'
                    onClick={event => dispatch(stopTODO(e['id']))}>stop</button>
                <button className='todo-button todo-finish'
                    onClick={event => dispatch(finishTODO(e['id']))}>finish</button>
                <button className='todo-button todo-delete'
                    onClick={event => dispatch(deleteTODO(e['id']))}>delete</button>
            </div>
        ));
        const nextTodoList = nextTodo.map(e => (
            <div className='todo-item'>
                <div className='todo-name'>{e['name']}</div>
                <button className='todo-button todo-start'
                    onClick={event => dispatch(startTODO(e['id']))}>start</button>
                <button className='todo-button todo-finish'
                    onClick={event => dispatch(finishTODO(e['id']))}>finish</button>
                <button className='todo-button todo-delete'
                    onClick={event => dispatch(deleteTODO(e['id']))}>delete</button>
            </div>
        ));
        const finishedTodoList = finishedTodo.map(e => (
            <div className='todo-item'>
                <s className='todo-name'>{e['name']}</s>
                <button className='todo-button todo-reset'
                    onClick={event => dispatch(resetTODO(e['id']))}>reset</button>
                <button className='todo-button todo-delete'
                    onClick={event => dispatch(deleteTODO(e['id']))}>delete</button>
            </div>
        ));
        return (
            <div className='todos'>
                <div className='working-on-container'>
                    <p className='desc-text'>Working on:</p>
                    <div className='todo-list'>{currentTodoList}</div>
                </div>
                <div className='new-todo-container'>
                    <input type='text'
                        value={this.state.newTodoName}
                        onChange={this.handleChange}
                        onKeyUp={e => {if (e.key === 'Enter') {this.handleNewTodo(e)}}}/>
                    <button onClick={this.handleNewTodo}>+</button>
                </div>
                <div className='next-container'>
                    <div className='todo-list'>{nextTodoList}</div>
                </div>
                <div className='finished-container'>
                    <p className='desc-text'>Done:</p>
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