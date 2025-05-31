import React, {useEffect, useState} from "react";
import {PROJECT_BACKEND_URL} from "../../settings";
import {useSelector} from "react-redux";
import DeleteProject from "./DeleteProject";
import {Link} from "react-router";

const UserProjectsList = () => {
    const token = useSelector((state) => state.auth.token);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${PROJECT_BACKEND_URL}projects`, {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Nie uda?o si? pobra? projekt?w");
                }

                const data = await response.json();
                setProjects(data);
            } catch (err) {
                console.error("B??d pobierania projekt?w:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [token]);

    const handleProjectDeleted = (deletedId) => {
        setProjects((prev) => prev.filter((p) => p.id !== deletedId));
    };

    if (loading) return <p>?adowanie projekt?w...</p>;
    if (error) return <p className="text-red-600">B??d: {error}</p>;
    if (projects.length === 0) return <p>Brak projekt?w do wy?wietlenia.</p>;

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Twoje projekty</h2>
            <ul className="space-y-4">
                {projects.map((project) => (
                    <li
                        key={project.id}
                        className="border rounded p-4 shadow-sm bg-white"
                    >
                        <Link to={`/project/${project.id}`} className="block hover:bg-gray-50 p-2 rounded">
                            <h3 className="text-lg font-bold">{project.name || "Bez nazwy"}</h3>
                            <p className="text-sm text-gray-600 mb-1">
                                Status: <span className="font-medium">{project.status}</span>
                            </p>
                            {project.description && (
                                <p className="text-gray-700 text-sm mb-1">{project.description}</p>
                            )}
                            {project.budget && (
                                <p className="text-gray-700 text-sm">
                                    Bud?et: <strong>{project.budget} z?</strong>
                                </p>
                            )}
                        </Link>

                        <div className="mt-2">
                            <DeleteProject
                                projectId={project.id}
                                onDeleted={() => handleProjectDeleted(project.id)}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserProjectsList;
