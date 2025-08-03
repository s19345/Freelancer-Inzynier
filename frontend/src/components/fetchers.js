import useGlobalStore from "../zustand_store/globalInfoStore";
import useAuthStore from "../zustand_store/authStore";
import {USERS_LIST_URL} from "../settings";

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
            showMessage("B³±d podczas pobierania umiejêtno¶ci.", "error");
            throw new Error("B³±d podczas pobierania umiejêtno¶ci.");
        }

        const data = await response.json();
        return data || [{id: 0, name: "Brak umiejêtno¶ci"}];
    } catch (error) {
        showMessage("Nie uda³o siê pobraæ umiejêtno¶ci.", "error");
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
            showMessage("B³±d podczas pobierania stref czasowych.", "error");
            throw new Error("B³±d podczas pobierania stref czasowych.");
        }

        const data = await response.json();
        return data || [];
    } catch (error) {
        showMessage("Nie uda³o siê pobraæ stref czasowych.", "error");
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
            showMessage("B³±d podczas zapisywania notatki.", "error");
            throw new Error("B³±d podczas zapisywania notatki.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        showMessage("Nie uda³o siê zapisaæ notatki.", "error");
        return null;
    }
};

export const fetchLastActiveProjects = async () => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/project/last-active-projects/`, {
            headers: {
                Authorization: `Token ${token}`,
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            showMessage("B³±d podczas pobierania ostatnio aktywnych projektów.", "error");
            throw new Error("B³±d podczas pobierania ostatnio aktywnych projektów.");
        }

        const data = await response.json();
        return data || [];
    } catch (error) {
        showMessage("Nie uda³o siê pobraæ ostatnio aktywnych projektów.", "error");
        return [];
    }
};