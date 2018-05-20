import React from 'react'
import { connect } from 'react-redux'
import {
    newTODO, startTODO, finishTODO, deleteTODO, stopTODO, resetTODO, moveTODO
} from './actionCreators'
import { sortTodoFunc } from './utils'
import {
    SortableContainer,
    SortableElement
} from 'react-sortable-hoc';
import '../css/todo.css'


const SortableItem = SortableElement(({value}) => {
    return <li className='todo-item-container'>{value}</li>
});

const SortableList = SortableContainer(({items, keys}) => {
    return (
        <ul className='todo-list'>
            {items.map((value, index) => (
                <SortableItem key={`item-${keys[index]}`} index={index} value={value} />
            ))}
        </ul>
    );
});

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
        const todos = [...this.props.todos].sort(sortTodoFunc)
        const dispatch = this.props.dispatch

        const currentTodo = todos.filter(e => e.started && !e.finished)
        const nextTodo = todos.filter(e => !e.started && !e.finished)
        const finishedTodo = todos.filter(e => e.finished)

        const currentTodoItems = currentTodo.map(e => (
            <div className='todo-item'>
                <div className='todo-name'>{e['name']}</div>
                <div className='todo-controls'>
                    <button className='todo-button todo-stop fa fa-pause'
                        onClick={event => dispatch(stopTODO(e['id']))}/>
                    <button className='todo-button todo-finish fa fa-check'
                        onClick={event => dispatch(finishTODO(e['id']))}/>
                    <button className='todo-button todo-delete fa fa-times'
                        onClick={event => dispatch(deleteTODO(e['id']))}/>
                </div>
            </div>
        ));
        const nextTodoItems = nextTodo.map(e => (
            <div className='todo-item'>
                <div className='todo-name'>{e['name']}</div>
                <div className='todo-controls'>
                    <button className='todo-button todo-start fa fa-play'
                        onClick={event => dispatch(startTODO(e['id']))}/>
                    <button className='todo-button todo-finish fa fa-check'
                        onClick={event => dispatch(finishTODO(e['id']))}/>
                    <button className='todo-button todo-delete fa fa-times'
                        onClick={event => dispatch(deleteTODO(e['id']))}/>
                </div>
            </div>
        ));
        const finishedTodoItems = finishedTodo.map(e => (
            <div className='todo-item'>
                <s className='todo-name'>{e['name']}</s>
                <div className='todo-controls'>
                    <button className='todo-button todo-reset fa fa-check-square'
                        onClick={event => dispatch(resetTODO(e['id']))}/>
                    <button className='todo-button todo-delete fa fa-times'
                        onClick={event => dispatch(deleteTODO(e['id']))}/>
                </div>
            </div>
        ));
        let currentElem = null
        if(currentTodoItems.length) {
            currentElem = (
                <div className='working-on-container'>
                    <ul className='todo-list'>
                        {currentTodoItems.map(e => <li className='todo-item-container working-on'>{e}</li>)}
                    </ul>
                </div>
            )
        }
        return (
            <div className='todos'>
                <h2 className='todo-header'>Todos</h2>
                {currentElem}
                <div className='next-container'>
                    <h4>Next</h4>
                    <SortableList
                      items={nextTodoItems}
                      keys={nextTodo.map(e => e['id'])}
                      onSortEnd={({oldIndex, newIndex}) => dispatch(moveTODO(oldIndex, newIndex))}/>
                </div>
                <div className='new-todo-container'>
                    <i className='new-todo-plus fa fa-plus'/>
                    <input
                      className='new-todo-input'
                      value={this.state.newTodoName}
                      placeholder='New TODO'
                      type='text'
                      onChange={this.handleChange}
                      onKeyPress={e => {if (e.key === 'Enter') {this.handleNewTodo(e)}}}/>
                </div>
                <div className='finished-container'>
                    <h4>Completed</h4>
                    <ul className='todo-list'>
                        {finishedTodoItems.map(e => <li className='todo-item-container'>{e}</li>)}
                    </ul>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    todos: state.todos
})
  
export default connect(mapStateToProps)(Todo)