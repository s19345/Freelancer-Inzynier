import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams, Link} from "react-router";
import {PROJECT_BACKEND_URL} from "../../settings";

const ProjectDetails = () => {
    const {projectId} = useParams(); // z URL /projects/:projectId
    const token = useSelector((state) => state.auth.token);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`${PROJECT_BACKEND_URL}projects/${projectId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Nie uda�o si� pobra� danych projektu");
                }

                const data = await response.json();
                setProject(data);
            } catch (err) {
                console.error("B��d:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, token]);

    if (loading) return <p>�adowanie danych projektu...</p>;
    if (error) return <p className="text-red-600">B��d: {error}</p>;
    if (!project) return <p>Projekt nie zosta� znaleziony</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-2">{project.name || "Bez nazwy"}</h2>
            <p className="text-gray-700 mb-1"><strong>Status:</strong> {project.status}</p>
            <p className="text-gray-700 mb-1"><strong>Wersja:</strong> {project.version}</p>
            <p className="text-gray-700 mb-1"><strong>Tytu�:</strong> {project.title}</p>
            <p className="text-gray-700 mb-1"><strong>Bud�et:</strong> {project.budget} z�</p>
            <p className="text-gray-700 mb-3"><strong>Opis:</strong> {project.description}</p>
            {project.client && (
                <p className="text-gray-700"><strong>Klient ID:</strong> {project.client}</p>
            )}
            <Link
                to={`/project/${projectId}/edit`}
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Edytuj projekt
            </Link>
        </div>
    );
};

export default ProjectDetails;
