import React, { useState, useEffect } from "react";
import Task from './todo/Task'
import Context from './context'

export default function App() {
    const [tasks, setTasks] = useState([])

    const [loader, setLoader] = useState(true)

    const [title, setTitle] = useState('')

    const [text, setText] = useState('')

    const [task, setTask] = useState({
        title: '',
        text: '',
    })

    useEffect(() => {
        fetch('http://localhost:8000/api/task-list/')
            .then(response => response.json())
            .then(tasks => setTasks(tasks))
            .then(() => setLoader(false))
    }, [])

    useEffect(() => {
        console.log('task is change', task);
    }, [task]);

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function changeStatus(id) {
        const csrftoken = getCookie('csrftoken')
        const task = tasks.find(task => task.id === id)

        fetch(`http://localhost:8000/api/task-update/${id}/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                title:task.title,
                text:task.text,
                completed: !task.completed,
                created: task.created,
                id: task.id,
                user: task.user
            })
        })
            .then(response => {
                if (response.ok) {
                    setTasks(
                        tasks.map(task => {
                            if (task.id === id)
                                task.completed = !task.completed
                            return task
                        }))
                }
            })
    }

    function removeTask(id) {
        const csrftoken = getCookie('csrftoken')

        fetch(`http://localhost:8000/api/task-delete/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
        })
            .then(response => {
                if (response.ok) {
                    setTasks(tasks.filter(task => task.id !== id))
                }
            })

    }

    function submitHandler(event) {
        event.preventDefault()
        if (title.trim()) {
            const csrftoken = getCookie('csrftoken')

            fetch('http://localhost:8000/api/task-create/', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({
                    title,
                    text,
                    user: 1,
                })
            })
                .then(response => response.json())
                .then((json) => setTasks([...tasks, json]))

            setTitle('')
            setText('')
        }
    }

    function updateTask(){
        const csrftoken = getCookie('csrftoken')
        fetch(`http://localhost:8000/api/task-update/${task.id}/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(task)
        })
            .then(response => {
                if (response.ok) {
                    setTasks(
                        tasks.map(newTask => {
                            if (newTask.id === task.id){
                                newTask = task
                            }      
                            return newTask
                        }))
                }
            })
    }

    return (
        <Context.Provider value={{ removeTask, updateTask, setTask }}>
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-xs-12 p-5">
                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                <input onChange={event => setTitle(event.target.value)} value={title} type="text" placeholder="Title" id="id_title" required="required" className="form-control" />
                            </div>
                            <div className="form-group">
                                <textarea onChange={event => setText(event.target.value)} value={text} className="form-control" id="id_text" placeholder="Text" cols="40" rows="10"></textarea>
                            </div>
                            <div className="d-flex justify-content-center">
                                <button id="submit" className="btn btn-primary" type="submit">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
                {tasks.length ? (
                    tasks.map(task => <Task task={task} key={task.id} changeStatus={changeStatus} />)
                ) : (
                        loader ? (
                            <div className="spinner">
                                <div className="bounce1"></div>
                                <div className="bounce2"></div>
                                <div className="bounce3"></div>
                            </div>
                        ) : (
                                <center><h2>No tasks</h2></center>
                            )
                    )}
            </div>

            <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Edit</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form >
                                <div className="form-group">
                                    <input onChange={event => setTask({
                                        title:event.target.value,
                                        text:task.text,
                                        completed: task.completed,
                                        created: task.created,
                                        id: task.id,
                                        user: task.user
                                    })} value={task.title} type="text" placeholder="Title" id="id_title" required="required" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <textarea onChange={event => setTask({
                                        title:task.title,
                                        text:event.target.value,
                                        completed: task.completed,
                                        created: task.created,
                                        id: task.id,
                                        user: task.user
                                    })} value={task.text} className="form-control" id="id_text" placeholder="Text" cols="40" rows="10"></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button onClick={() => updateTask()} type="submit" data-dismiss="modal" className="btn btn-primary">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </Context.Provider>
    );
}