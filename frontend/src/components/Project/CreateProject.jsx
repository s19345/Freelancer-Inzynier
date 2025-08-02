import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import useAuthStore from "../../zustand_store/authStore";
import useGlobalStore from '../../zustand_store/globalInfoStore';
import {PROJECT_BACKEND_URL, USERS_LIST_URL} from "../../settings";
import paths from "../../paths";
import ProjectForm from "./ProjectForm";

const CreateProject = () => {
    const token = useAuthStore(state => state.token);
    const navigate = useNavigate();
    const setMessage = useGlobalStore((state) => state.setMessage);
    const setType = useGlobalStore((state) => state.setType);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        version: "",
        title: "",
        status: "",
        budget: "",
        client: "",
        collabolators: [],
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [clientsFetchingError, setClientsFetchingError] = useState(null);
    const [clientsFetchingLoading, setClientsFetchingLoading] = useState(false);
    const [friends, setFriends] = useState([]);
    const [friendsFetchingError, setFriendsFetchingError] = useState(null);
    const [friendsFetchingLoading, setFriendsFetchingLoading] = useState(false);


    const params = new URLSearchParams({page_size: 10000});

    useEffect(() => {
        setClientsFetchingLoading(true);
        const fetchClients = async () => {
            try {
                const res = await fetch(`${PROJECT_BACKEND_URL}clients/?${params}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Nie udało się pobrać klientów");
                const data = await res.json();
                setClients(data.results);
            } catch (err) {
                console.log("Error fetching clients:", err);
                setClientsFetchingError(err.message);
            } finally {
                setClientsFetchingLoading(false);
            }
        };
        fetchClients();
    }, [token]);

    useEffect(() => {
        setFriendsFetchingLoading(true);
        const fetchFriends = async () => {
            try {
                const res = await fetch(`${USERS_LIST_URL}friends/?${params}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Nie udało się pobrać znajomych");
                const data = await res.json();
                setFriends(data.results);
            } catch (err) {
                setFriendsFetchingError(err.message);
            } finally {
                setFriendsFetchingLoading(false);
            }
        };
        fetchFriends();
    }, [token]);

    const createProject = async (data) => {
        setLoading(true);
        try {
            console.log("Creating project with data:", data);
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
                return;
            }

            const responseData = await response.json();
            console.log("Utworzono projekt:", responseData);
            setMessage("Projekt został utworzony pomyślnie");
            setType("success");
            navigate(paths.projectList);
        } catch (error) {
            console.error("Error creating project:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        createProject(formData);
    };

    return (

        <ProjectForm
            handleSubmit={handleSubmit}
            returnPath={paths.projectList}
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            clients={clients}
            friends={friends}
            clientsFetchingError={clientsFetchingError}
            clientsFetchingLoading={clientsFetchingLoading}
            friendsFetchingError={friendsFetchingError}
            friendsFetchingLoading={friendsFetchingLoading}
            submitMessage={"Utwórz Projekt"}
        />
    );
};

export default CreateProject;
