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

export const fetchUserSkills = async () => {

    try {
        const response = await fetch(`${USERS_LIST_URL}skills/`, {
            headers: {
                Authorization: `Token ${token}`,
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            showMessage("B��d podczas pobierania umiej�tno�ci.", "error");
            throw new Error("B��d podczas pobierania umiej�tno�ci.");
        }

        const data = await response.json();
        return data || [{id: 0, name: "Brak umiej�tno�ci"}];
    } catch (error) {
        showMessage("Nie uda�o si� pobra� umiej�tno�ci.", "error");
        return [];
    }


};

export const fetchTimezones = async () => {
    try {
        const response = await fetch(`${USERS_LIST_URL}timezones/`, {
            headers: {
                Authorization: `Token ${token}`,
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            showMessage("B��d podczas pobierania stref czasowych.", "error");
            throw new Error("B��d podczas pobierania stref czasowych.");
        }

        const data = await response.json();
        return data || [];
    } catch (error) {
        showMessage("Nie uda�o si� pobra� stref czasowych.", "error");
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
            showMessage("B��d podczas zapisywania notatki.", "error");
            throw new Error("B��d podczas zapisywania notatki.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        showMessage("Nie uda�o si� zapisa� notatki.", "error");
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
            console.log("B��d podczas pobierania ostatnio aktywnych projekt�w.");
            console.log("token w fetchers: ", token);
            throw new Error("B��d podczas pobierania ostatnio aktywnych projekt�w.");
        }

        const data = await response.json();
        console.log("data w fetchers: ", data);
        console.log("token w fetchers: ", token);
        return data || [];
    } catch (error) {
        showMessage("Nie uda�o si� pobra� ostatnio aktywnych projekt�w.", "error");
        return [];
    }
};

export const startTaskTimelog = async (taskId) => {
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
            let errorMessage = "B��d podczas uruchamiania timeloga zadania.";

            if (errorData?.non_field_errors && errorData.non_field_errors.length > 0) {
                errorMessage = errorData.non_field_errors[0];
            }
            showMessage(errorMessage, "error");
        }

        const data = await response.json();
        console.log("rozpocz�te zadanie : ", data)
        if (data?.success) {
            showMessage(data.success, "success");
        }
        return data;
    } catch
        (error) {
        return null;
    }
};

export const stopTaskTimelog = async (taskId) => {
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
            let errorMessage = "B��d podczas zatrzymywania timeloga zadania.";
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
        showMessage("Wyst�pi� b��d po��czenia z serwerem.", "error");
        return null;
    }
};

export const endTaskTimelog = async (taskId) => {
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
            let errorMessage = "B��d podczas ko�czenia zadania.";
            if (data?.non_field_errors && data.non_field_errors.length > 0) {
                errorMessage = data.non_field_errors[0];
            }
            showMessage(errorMessage, "error");
            return null;
        }

        console.log("zako�czone zadanie : ", data);
        if (data?.success) {
            showMessage(data.success, "success");
        }

        return data;
    } catch (error) {
        showMessage("Wyst�pi� b��d po��czenia z serwerem.", "error");
        return null;
    }
};