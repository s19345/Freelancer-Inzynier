import React, { useEffect, useState } from "react";
import useAuthStore from "../../zustand_store/authStore";
import { PROJECT_BACKEND_URL } from "../../settings";
import { Link } from "react-router";

const UserProjectsList = () => {
  const token = useAuthStore(state => state.token);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${PROJECT_BACKEND_URL}projects/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Nie udało się pobrać projektów");
        }

        const data = await res.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  if (loading) return <p>Ładowanie projektów...</p>;
  if (error) return <p>Błąd: {error}</p>;
  if (projects.length === 0) return <p>Brak projektów do wyświetlenia.</p>;

  return (
    <div>
      <h2>Twoje projekty</h2>
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
          >
            <Link
              to={`/project/${project.id}`}
            >
              <h3>{project.name || "Bez nazwy"}</h3>
              <p>
                Status: <span>{project.status}</span>
              </p>
              {project.description && (
                <p>{project.description}</p>
              )}
              {project.budget && (
                <p>
                  Budżet: <strong>{project.budget} zł</strong>
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProjectsList;
