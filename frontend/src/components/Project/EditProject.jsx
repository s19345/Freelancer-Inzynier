import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router";
import {PROJECT_BACKEND_URL} from "../../settings";

const EditProject = () => {
    const {projectId} = useParams();
    const token = useSelector((state) => state.auth.token);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        version: "",
        title: "",
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
                    title: data.title || "",
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
    if (error) return <p className="text-red-600">Błąd: {error}</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
            {loading && "working..."}

            {submitStatus === "Projekt został zaktualizowany pomyślnie!" ? (
                <div className="info-message">
                    <h1 className="text-green-600 text-xl font-bold">{submitStatus}</h1>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-4">Edytuj projekt</h2>

                    <label className="block mb-2">
                        Nazwa projektu
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                        />
                    </label>

                    <label className="block mb-2">
                        Opis
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border rounded p-2"
                        />
                    </label>

                    <label className="block mb-2">
                        Wersja
                        <input
                            type="text"
                            name="version"
                            value={formData.version}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </label>

                    <label className="block mb-2">
                        Tytuł
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </label>

                    <label className="block mb-2">
                        Status
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                        >
                            <option value="">-- Wybierz status --</option>
                            <option value="active">Aktywny</option>
                            <option value="completed">Ukończony</option>
                            <option value="paused">Wstrzymany</option>
                        </select>
                    </label>

                    <label className="block mb-2">
                        Budżet
                        <input
                            type="number"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </label>

                    <label className="block mb-2">
                        Klient (ID)
                        <input
                            type="text"
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </label>

                    <label className="block mb-4">
                        Współpracownicy
                        <input
                            type="text"
                            name="collaborators"
                            value={formData.collaborators.join(", ")}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </label>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Zapisz zmiany
                    </button>

                    {submitStatus && submitStatus.startsWith("Błąd") && (
                        <div className="info-message">
                            <h1 className="text-red-600 text-xl font-bold">{submitStatus}</h1>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
};

export default EditProject;
