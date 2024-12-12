import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, deleteProject, updateProject } from "../features/projectsSlice";
import CreateProject from "./CreateProject";
import { useNavigate } from "react-router-dom";

const ProjectsDashboard = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.projects);
  const { authTokens } = useSelector((state) => state.auth);
  const navigate = useNavigate()
  useEffect(() => {
    if (authTokens.refresh) {
      dispatch(fetchProjects());
    }
  }, [dispatch, authTokens]);

  const handleDelete = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(deleteProject(projectId));
    }
  };

  const handleUpdate = (project) => {
    const updatedTitle = prompt("Enter new project title:", project.title);
    const updatedDescription = prompt("Enter new project description:", project.description);

    if (updatedTitle && updatedDescription) {
      const updatedProject = { ...project, title: updatedTitle, description: updatedDescription };
      dispatch(updateProject(updatedProject));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Projects Dashboard</h1>
      <button
        onClick={() => navigate("/create_project")}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Create Project
      </button>
      {list.length === 0 ? (
        <p>No projects available. Create a new project to get started!</p>
      ) : (
        <ul className="space-y-4">
          {list.map((project) => (
            <li key={project.id} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-bold">{project.title}</h2>
              <p className="text-gray-700 mb-2">{project.description}</p>
              <div className="flex justify-between text-sm text-gray-600">
                <p>
                  <strong>Start Date:</strong> {new Date(project.start_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>End Date:</strong> {new Date(project.end_date).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-2">
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    project.status === "completed"
                      ? "text-green-600"
                      : project.status === "active"
                      ? "text-blue-600"
                      : "text-gray-600"
                  } font-semibold`}
                >
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleUpdate(project)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectsDashboard;
