import React, {useState} from "react";
import {PROJECT_BACKEND_URL} from "../../settings";
import useAuthStore from "../../zustand_store/authStore";
import useGlobalStore from '../../zustand_store/globalInfoStore';
import paths from "../../paths";
import {useNavigate} from "react-router";
import ClientForm from "./ClientForm";

const CreateClient = () => {

    const token = useAuthStore(state => state.token);
    const navigate = useNavigate();
    const setMessage = useGlobalStore((state) => state.setMessage);
    const setType = useGlobalStore((state) => state.setType);

    const [formData, setFormData] = useState({
        company_name: "",
        industry: "",
        contact_person: "",
        email: "",
        phone: "",
        notes: ""
    });

    const handleSubmit = async (formData) => {
        try {
            const response = await fetch(`${PROJECT_BACKEND_URL}clients/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Klient został utworzony pomyślnie");
                setType("success");
                navigate(paths.clients)
            } else {
                const errorMessage = typeof data === "object"
                    ? Object.values(data).flat().join(" ")
                    : "Wystąpił błąd podczas tworzenia klienta";
                setMessage(errorMessage);
                setType("error");
            }
        } catch (error) {
            console.error("Błąd sieci:", error);
            setMessage("Błąd połączenia z serwerem");
            setType("error");
        }

    };

    return (
        <ClientForm
            handleSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            submitMessage={"Utwórz klienta"}
        />
    );
};

export default CreateClient;
