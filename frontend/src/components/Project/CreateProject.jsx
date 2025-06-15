import React, { useState } from "react";
import { PROJECT_BACKEND_URL } from "../../settings";
import { useSelector } from "react-redux";

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    version: "",
    title: "",
    status: "",
    budget: "",
    client: "",
    collaborators: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false); // dodany loading

  const token = useSelector((state) => state.auth.token);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nazwa projektu jest wymagana";
    if (!formData.status) newErrors.status = "Status projektu jest wymagany";
    if (formData.budget && Number(formData.budget) < 0)
      newErrors.budget = "Budżet nie może być ujemny";
    return newErrors;
  };

  const createProject = async (data) => {
    setLoading(true);
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
        console.error("Błąd:", errorData);
        setLoading(false);
        return;
      }

      const responseData = await response.json();
      console.log("Project created successfully:", responseData);
      setSuccessMessage("Projekt został utworzony pomyślnie");
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    <div className="project-container">
      {!successMessage && (
        <>
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
                disabled={loading}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="description">Opis</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="title">Tytuł</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="">-- Wybierz status --</option>
                <option value="active">Aktywny</option>
                <option value="completed">Ukończony</option>
                <option value="paused">Wstrzymany</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status}</p>
              )}
            </div>

            <div>
              <label htmlFor="budget">Budżet</label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.budget && (
                <p className="text-red-500 text-sm">{errors.budget}</p>
              )}
            </div>

            <div>
              <label htmlFor="client">Klient</label>
              <input
                type="text"
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="collaborators">Współpracownicy</label>
              <input
                type="text"
                id="collaborators"
                name="collaborators"
                value={formData.collaborators}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading}>
              Zapisz projekt
            </button>
          </form>

          {Object.keys(errors).length > 0 && (
            <div className="error-message">
              {Object.values(errors).map((err, idx) => (
                <p key={idx}>{err}</p>
              ))}
            </div>
          )}
        </>
      )}

      {loading && "working..."}

      {successMessage && (
        <div className="info-message">
          <h1>{successMessage}</h1>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
