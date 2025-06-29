import React, {useState} from "react";
import {PROJECT_BACKEND_URL} from "../../settings";
import useAuthStore from "../../zustand_store/authStore";

const CreateClientForm = () => {
    const [formData, setFormData] = useState({
        company_name: "",
        industry: "",
        contact_person: "",
        email: "",
        phone: "",
        notes: ""
    });

    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null);
    const token = useAuthStore(state => state.token);
    console.log("Token:", token);

    const validate = () => {
        const newErrors = {};
        if (!formData.company_name.trim()) {
            newErrors.company_name = "Nazwa firmy jest wymagana";
        }
        if (!formData.industry.trim()) {
            newErrors.industry = "Branża jest wymagana";
        }
        if (!formData.contact_person.trim()) {
            newErrors.contact_person = "Osoba kontaktowa jest wymagana";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email jest wymagany";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Podaj poprawny adres email";
        }
        if (formData.phone && !/^[0-9+()\-\s]{6,}$/.test(formData.phone)) {
            newErrors.phone = "Podaj poprawny numer telefonu";
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        try {
            const response = await fetch(`${PROJECT_BACKEND_URL}clients/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Błąd:", errorData);
                setStatus("Wystąpił błąd podczas tworzenia klienta");
                return;
            }

            const data = await response.json();
            console.log("Utworzono klienta:", data);
            setStatus("Klient został utworzony pomyślnie");
            setFormData({
                company_name: "",
                industry: "",
                contact_person: "",
                email: "",
                phone: "",
                notes: ""
            });
            setErrors({});
        } catch (error) {
            console.error("Błąd sieci:", error);
            setStatus("Błąd połączenia z serwerem");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{maxWidth: "400px", margin: "auto"}}>
            <h2>Dodaj klienta</h2>

            <div>
                <input
                    type="text"
                    name="company_name"
                    placeholder="Nazwa firmy"
                    value={formData.company_name}
                    onChange={handleChange}
                />
                {errors.company_name && <p>{errors.company_name}</p>}
            </div>

            <div>
                <input
                    type="text"
                    name="industry"
                    placeholder="Branża"
                    value={formData.industry}
                    onChange={handleChange}
                />
                {errors.industry && <p>{errors.industry}</p>}
            </div>

            <div>
                <input
                    type="text"
                    name="contact_person"
                    placeholder="Osoba kontaktowa"
                    value={formData.contact_person}
                    onChange={handleChange}
                />
                {errors.contact_person && <p>{errors.contact_person}</p>}
            </div>

            <div>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <p>{errors.email}</p>}
            </div>

            <div>
                <input
                    type="text"
                    name="phone"
                    placeholder="Telefon"
                    value={formData.phone}
                    onChange={handleChange}
                />
                {errors.phone && <p>{errors.phone}</p>}
            </div>

            <div>
        <textarea
            name="notes"
            placeholder="Notatki"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
        />
            </div>

            <button type="submit">
                Utwórz klienta
            </button>

            {status && <p>{status}</p>}
        </form>
    );
};

export default CreateClientForm;
