import React, {useState, useEffect} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {useParams} from "react-router";
import {PROJECT_BACKEND_URL} from "../../settings";
import DeleteProject from "./DeleteProject";

const EditProject = () => {
    const {projectId} = useParams();
    const token = useAuthStore((state) => state.token);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        version: "",
        status: "",
        budget: "",
        client: "",
        collaborators: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitStatus, setSubmitStatus] = useState(null);

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

                setFormData({
                    name: data.name || "",
                    description: data.description || "",
                    version: data.version || "",
                    status: data.status || "",
                    budget: data.budget || "",
                    client: data.client || "",
                    collaborators: data.collaborators || []
                });

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, token]);

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === "collaborators") {
            setFormData((prev) => ({
                ...prev,
                collaborators: value.split(",").map((c) => c.trim())
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);

        try {
            const response = await fetch(`${PROJECT_BACKEND_URL}projects/${projectId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Błąd aktualizacji projektu");
            }

            await response.json();
            setSubmitStatus("Projekt został zaktualizowany pomyślnie!");

        } catch (err) {
            setSubmitStatus(`Błąd: ${err.message}`);
        }
    };

    if (loading) return <p>Ładowanie danych projektu...</p>;
    if (error) return <p>Błąd: {error}</p>;

    return (
        <div>
            {loading && "working..."}

            {submitStatus === "Projekt został zaktualizowany pomyślnie!" ? (
                <div>
                    <h1>{submitStatus}</h1>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h2>Edytuj projekt</h2>

                    <label>
                        Nazwa projektu
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Opis
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                        />
                    </label>

                    <label>
                        Wersja
                        <input
                            type="text"
                            name="version"
                            value={formData.version}
                            onChange={handleChange}
                        />
                    </label>


                    <label>
                        Status
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Wybierz status --</option>
                            <option value="active">Aktywny</option>
                            <option value="completed">Ukończony</option>
                            <option value="paused">Wstrzymany</option>
                        </select>
                    </label>

                    <label>
                        Budżet
                        <input
                            type="number"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Klient (ID)
                        <input
                            type="text"
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Współpracownicy
                        <input
                            type="text"
                            name="collaborators"
                            value={formData.collaborators.join(", ")}
                            onChange={handleChange}
                        />
                    </label>

                    <button
                        type="submit"
                    >
                        Zapisz zmiany
                    </button>

                    {submitStatus && submitStatus.startsWith("Błąd") && (
                        <div>
                            <h1>{submitStatus}</h1>
                        </div>
                    )}
                </form>
            )}

            <DeleteProject projectId={projectId}/>

        </div>
    );
};

export default EditProject;
