import React, {useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {useParams, Link} from "react-router";
import {PROJECT_BACKEND_URL} from "../../settings";

const ProjectDetails = () => {
    const {projectId} = useParams();
    const token = useAuthStore((state) => state.token);
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
                    throw new Error("Nie udało się pobrać danych projektu");
                }

                const data = await response.json();
                setProject(data);
            } catch (err) {
                console.error("Błąd:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, token]);

    if (loading) return <p>Ładowanie danych projektu...</p>;
    if (error) return <p>Błąd: {error}</p>;
    if (!project) return <p>Projekt nie został znaleziony</p>;

    return (
        <div>
            <h2>{project.name || "Bez nazwy"}</h2>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Wersja:</strong> {project.version}</p>
            <p><strong>Budżet:</strong> {project.budget} zł</p>
            <p><strong>Opis:</strong> {project.description}</p>
            {project.client && (
                <p><strong>Klient ID:</strong> {project.client}</p>
            )}
            <Link
                to={`/project/${projectId}/edit`}
            >
                Edytuj projekt
            </Link>
        </div>
    );
};

export default ProjectDetails;
