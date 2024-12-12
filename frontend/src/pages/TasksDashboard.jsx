import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask,deleteTask } from '../features/tasksSlice'; 
import { toast } from 'react-toastify';

const TasksDashboard = () => {
  const dispatch = useDispatch();
  const { tasks_list: tasks, loading, error } = useSelector((state) => state.tasks);
  const [editingTask, setEditingTask] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [updatedPriority, setUpdatedPriority] = useState('');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setUpdatedStatus(task.status);
    setUpdatedPriority(task.priority);
  };
  const handleDelete = (task)=>{
    
      dispatch(deleteTask(task))
        .unwrap()
        .catch(() => {
          toast.error('Failed to update task');
        });
    
  }
  const handleUpdate = () => {
    const updatedTask = {
      id: editingTask.id,
      status: updatedStatus,
      priority: updatedPriority,
    };
    dispatch(updateTask(updatedTask))
      .unwrap()
      .then(() => {
        toast.success('Task updated successfully');
        setEditingTask(null);
      })
      .catch(() => {
        toast.error('Failed to update task');
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Tasks</h1>
      {tasks.length >0?
        (<ul className="space-y-4">
            {tasks.map((task) => (
            <li
                key={task.id}
                className="border rounded p-4 bg-white shadow-md"
            >
                <h2 className="text-lg font-semibold">{task.title}</h2>
                <p><strong>Description:</strong> {task.description}</p>
                <p><strong>Assigned To:</strong> {task.assigned_to}</p>
                <p><strong>Project:</strong> {task.project}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Priority:</strong> {task.priority}</p>

                {editingTask?.id === task.id ? (
                <div className="mt-4 space-y-2">
                    <div>
                    <label className="block text-sm font-medium">
                        Status:
                        <select
                        value={updatedStatus}
                        onChange={(e) => setUpdatedStatus(e.target.value)}
                        className="block w-full mt-1 border-gray-300 rounded-md"
                        >
                        <option value="to-do">To-Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                        </select>
                    </label>
                    </div>
                    <div>
                    <label className="block text-sm font-medium">
                        Priority:
                        <select
                        value={updatedPriority}
                        onChange={(e) => setUpdatedPriority(e.target.value)}
                        className="block w-full mt-1 border-gray-300 rounded-md"
                        >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        </select>
                    </label>
                    </div>
                    <button
                    onClick={handleUpdate}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                    Save
                    </button>
                    <button
                    onClick={() => setEditingTask(null)}
                    className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                    Cancel
                    </button>
                </div>
                ) : (
                <button
                    onClick={() => handleEdit(task)}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Edit
                </button>

                )}
                
              <button
              onClick={() => handleDelete(task)}
              className="mt-4 px-4 ml-2 py-2 bg-red-500 text-white rounded hover:bg-green-600"
              >
              Delete
              </button>
            </li>
            ))}
        </ul>):
        (<p className="border rounded p-4 bg-white shadow-md">No assigned tasks</p>)
        }
    </div>
  );
};

export default TasksDashboard;
