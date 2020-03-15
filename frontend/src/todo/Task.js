import React, { useContext } from "react"
import Context from '../context'

export default function Task({ task, changeStatus}) {
const { removeTask } = useContext(Context)
const { setTask } = useContext(Context)

    return (
            <div className="raw d-flex justify-content-center mb-3">
                <div className="col-lg-8">
                    <div className="card shadow-lg">
                        <div className="card-body">
                            <button onClick={() => removeTask(task.id)} type="button" className="close">&times;</button>
                            <div style={{ display: "flex" }}>

                                <div onClick={() => changeStatus(task.id)} className={`btn btn-${task.completed ? 'primary' : 'light'} mr-2 rounded-circle justify-content-center align-items-center d-flex`} style={{ width: "30px", height: "30px" }} >
                                    {task.completed ? '✓' : ''}
                                </div>
                                <a style={{ textDecoration: "none" }} onClick={() => {console.log(task)
                                    setTask(task)}}  data-toggle="modal" data-target="#exampleModalCenter" href="/" >
                                    {task.completed ? (
                                        <strike>
                                            <h3 className="card-title">{task.title}</h3>
                                        </strike>
                                    ) : (
                                            <h3 className="card-title">{task.title}</h3>
                                        )}
                                </a>
                            </div>
                            <p className="card-text">{task.text}</p>
                            <p>{task.created}</p>
                        </div>
                    </div>
                </div>
            </div>
    )
}
