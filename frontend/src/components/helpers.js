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
        console.log("token z helpers: ", token)
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
        console.log("skile pobrane w helpers:", data);
        return data || [{id: 0, name: "Brak umiej�tno�ci"}];
    } catch (error) {
        showMessage("Nie uda�o si� pobra� umiej�tno�ci.", "error");
        return [];
    }
};