import  { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    status: 'to-do',
    priority: 'medium',
    project: '',
  });
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await api.get('/users/'); // Replace with your users endpoint
        const projectsResponse = await api.get('/projects/');
        setUsers(usersResponse.data);
        setProjects(projectsResponse.data);
      } catch (error) {
        setMessage('Failed to fetch users or projects.');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/tasks/', formData);

      setMessage(`Task created successfully! ID: ${response.data.task_id}`);
      toast.success("Task created successfully! ")
      navigate('tasks/')
    } catch (error) {
      setMessage(error.response?.data?.error || 'Something went wrong!');
      toast.error('Something went wrong!')
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold mb-4">Create Task</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Assigned To</label>
          <select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Project</label>
          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Create Task
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default CreateTask;
