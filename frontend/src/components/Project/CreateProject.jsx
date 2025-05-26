import React, {useState} from "react";
import {PROJECT_BACKEND_URL} from "../../settings";
import {useSelector} from "react-redux";

const ProjectForm = () => {
    const [formData, setFormData] = useState({
        "name": "",
        "description": "",
        "version": "",
        "title": "",
        "status": "",
        "budget": "",
        "client": null,
        "collabolators": []
    });
    const token = useSelector((state) => state.auth.token);

    const createProject = async (data) => {
        console.log("URL: ", `${PROJECT_BACKEND_URL}projects/"`)
        console.log("Token: ", token)
        console.log("Data: ", data)
        try {
            const response = await fetch(`${PROJECT_BACKEND_URL}projects/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("B³±d:", errorData);
                return;
            }

            const responseData = await response.json();
            console.log("Project created successfully:", responseData);
        } catch (error) {
            console.error("Error creating project:", error);
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createProject(formData);


    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Nazwa projektu</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
            </div>

            <div>
                <label htmlFor="description">Opis</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                />
            </div>

            <div>
                <label htmlFor="version">Wersja</label>
                <input
                    type="text"
                    id="version"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                ></input>
            </div>

            <div>
                <label htmlFor="title">Tytu³</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                ></input>
            </div>

            <div>
                <label htmlFor="status">Status</label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Wybierz status --</option>
                    <option value="active">Aktywny</option>
                    <option value="completed">Ukoñczony</option>
                    <option value="paused">Wstrzymany</option>
                </select>
            </div>

            <div>
                <label htmlFor="budget">Bud¿et</label>
                <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                ></input>
            </div>


            <div>
                <label htmlFor="client">Klient</label>
                <input
                    type="text"
                    id="client"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                ></input>
            </div>

            <div>
                <label htmlFor="collaborators">Wspó³pracownicy</label>
                <input
                    type="text"
                    id="collaborators"
                    name="collaborators"
                    value={formData.collabolators}
                    onChange={handleChange}
                ></input>
            </div>

            <button type="submit">
                Zapisz projekt
            </button>
        </form>
    );
};

export default ProjectForm;