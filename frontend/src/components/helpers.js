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