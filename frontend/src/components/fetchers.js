import useGlobalStore from "../zustand_store/globalInfoStore";
import useAuthStore from "../zustand_store/authStore";
import {PROJECT_BACKEND_URL, USERS_LIST_URL} from "../settings";

const token = useAuthStore.getState().token;

const showMessage = (message, type) => {
    const setMessage = useGlobalStore.getState().setMessage;
    const setType = useGlobalStore.getState().setType;

    setMessage(message);
    setType(type);
};

export const fetchUserSkills = async (token) => {

    try {
        const response = await fetch(`${USERS_LIST_URL}skills/`, {
            headers: {
                Authorization: `Token ${token}`,
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            showMessage("Błąd podczas pobierania umiejętności.", "error");
            throw new Error("Błąd podczas pobierania umiejętności.");
        }

        const data = await response.json();
        return data || [{id: 0, name: "Brak umiejętności"}];
    } catch (error) {
        showMessage("Nie udało się pobrać umiejętności.", "error");
        return [];
    }
};

export const fetchTimezones = async (token) => {
    try {
        const response = await fetch(`${USERS_LIST_URL}timezones/`, {
            headers: {
                Authorization: `Token ${token}`,
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            showMessage("Błąd podczas pobierania stref czasowych.", "error");
            throw new Error("Błąd podczas pobierania stref czasowych.");
        }

        const data = await response.json();
        return data || [];
    } catch (error) {
        showMessage("Nie udało się pobrać stref czasowych.", "error");
        return [];
    }
};

export const updateOrCreateNotes = async (friendId, notes, rate) => {
    try {
        const payload = {};
        if (notes && notes.trim() !== "") payload.notes = notes;
        if (rate && rate.trim() !== "") payload.rate = rate;

        const response = await fetch(
            `${USERS_LIST_URL}friend-notes/${friendId}/`,
            {
                method: "POST",
                headers: {
                    Authorization: `Token ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );

        if (!response.ok) {
            showMessage("Błąd podczas zapisywania notatki.", "error");
            throw new Error("Błąd podczas zapisywania notatki.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        showMessage("Nie udało się zapisać notatki.", "error");
        return null;
    }
};

export const fetchLastActiveProjects = async (token) => {
    try {
        const response = await fetch(`${PROJECT_BACKEND_URL}last-active-projects/`, {
            headers: {
                Authorization: `Token ${token}`,
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Błąd podczas pobierania ostatnio aktywnych projektów.");
        }

        const data = await response.json();
        return data || [];
    } catch (error) {
        showMessage("Nie udało się pobrać ostatnio aktywnych projektów.", "error");
        return [];
    }
};

export const startTaskTimelog = async (taskId, token) => {
    try {
        const response = await fetch(`${PROJECT_BACKEND_URL}start-task-timelog/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({task_id: taskId}),
        });

        if (!response.ok) {
            const errorData = await response.json();
            let errorMessage = "Błąd podczas uruchamiania timeloga zadania.";

            if (errorData?.non_field_errors && errorData.non_field_errors.length > 0) {
                errorMessage = errorData.non_field_errors[0];
            }
            showMessage(errorMessage, "error");
        }

        const data = await response.json();
        if (data?.success) {
            showMessage(data.success, "success");
        }
        return data;
    } catch
        (error) {
        return null;
    }
};

export const stopTaskTimelog = async (taskId, token) => {
    try {
        const response = await fetch(`${PROJECT_BACKEND_URL}stop-task-timelog/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({task_id: taskId}),
        });

        const data = await response.json();

        if (!response.ok) {
            let errorMessage = "Błąd podczas zatrzymywania timeloga zadania.";
            if (data?.non_field_errors && data.non_field_errors.length > 0) {
                errorMessage = data.non_field_errors[0];
            }
            showMessage(errorMessage, "error");
            return null;
        }

        if (data?.success) {
            showMessage(data.success, "success");
        }

        return data;
    } catch (error) {
        showMessage("Wystąpił błąd połączenia z serwerem.", "error");
        return null;
    }
};

export const endTaskTimelog = async (taskId, token) => {
    try {
        const response = await fetch(`${PROJECT_BACKEND_URL}end-task-timelog/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({task_id: taskId}),
        });

        const data = await response.json();

        if (!response.ok) {
            let errorMessage = "Błąd podczas kończenia zadania.";
            if (data?.non_field_errors && data.non_field_errors.length > 0) {
                errorMessage = data.non_field_errors[0];
            }
            showMessage(errorMessage, "error");
            return null;
        }

        if (data?.success) {
            showMessage(data.success, "success");
        }

        return data;
    } catch (error) {
        showMessage("Wystąpił błąd połączenia z serwerem.", "error");
        return null;
    }
};

export const fetchTasks = async (token, page, projectId, taskId) => {
    let url
    if (!taskId) {
        url = `${PROJECT_BACKEND_URL}tasks/?page=${page || 1}&project=${projectId}`;
    } else {
        url = `${PROJECT_BACKEND_URL}tasks/?page=${page || 1}&project=${projectId}&parent_task=${taskId}`;
    }
    try {
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
        });
        if (!res.ok) {

            throw new Error("Nie udało się pobrać zadań");
        }
        const data = await res.json();
        return data


    } catch (err) {
        console.error("Błąd:", err);
        return []
    }
};