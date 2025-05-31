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

    const [errors, setErrors] = useState({});
    const token = useSelector((state) => state.auth.token);

    const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nazwa projektu jest wymagana";
    if (!formData.status) newErrors.status = "Status projektu jest wymagany";
    if (formData.budget && Number(formData.budget) < 0)
      newErrors.budget = "Bud¿et nie mo¿e byæ ujemny";
    return newErrors;
  };

    const createProject = async (data) => {
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
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      createProject(formData);
    }
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
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
                >
                    <option value="">-- Wybierz status --</option>
                    <option value="active">Aktywny</option>
                    <option value="completed">Ukoñczony</option>
                    <option value="paused">Wstrzymany</option>
                </select>
                {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
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
                {errors.budget && <p className="text-red-500 text-sm">{errors.budget}</p>}
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
