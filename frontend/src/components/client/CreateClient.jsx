import React, { useState } from "react";
import {PROJECT_BACKEND_URL} from "../../settings";
import {useSelector} from "react-redux";

const CreateClientForm = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    contact_person: "",
    email: "",
    phone: "",
    notes: ""
  });

  const [status, setStatus] = useState(null);
  const token = useSelector((state) => state.auth.token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("token ", token)

    try {
      const response = await fetch(`${PROJECT_BACKEND_URL}clients/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        },
        body: JSON.stringify(formData)
      });
        console.log("response: ", response)
      if (!response.ok) {
        const errorData = await response.json();
        console.error("B³±d:", errorData);
        setStatus("B³±d tworzenia klienta");
        return;
      }

      const data = await response.json();
      console.log("Utworzono klienta:", data);
      setStatus("Klient utworzony pomy¶lnie!");
      // setFormData({
      //   company_name: "",
      //   industry: "",
      //   contact_person: "",
      //   email: "",
      //   phone: "",
      //   notes: ""
      // });

    } catch (error) {
      console.error("B³±d sieci:", error);
      setStatus("B³±d sieci");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Dodaj klienta</h2>

      <input
        type="text"
        name="company_name"
        placeholder="Nazwa firmy"
        value={formData.company_name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="industry"
        placeholder="Bran¿a"
        value={formData.industry}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="contact_person"
        placeholder="Osoba kontaktowa"
        value={formData.contact_person}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="phone"
        placeholder="Telefon"
        value={formData.phone}
        onChange={handleChange}
      />

      <textarea
        name="notes"
        placeholder="Notatki"
        value={formData.notes}
        onChange={handleChange}
        rows={4}
      />

      <button type="submit">Utwórz klienta</button>

      {status && <p>{status}</p>}
    </form>
  );
};

export default CreateClientForm;