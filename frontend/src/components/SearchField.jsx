import axios from "axios";
import {useEffect} from "react";

function SearchField() {

    const getProjectData = async () => {
        try {
            const response = axios.get("adres url backendu");
            if (response.status === '200') {
                const data = response.data;
            }
        } catch (error) {
            console.error("Error fetching project data:", error);
        }
    }

    const handleClick = () => {
        // Handle search button click
    }

    return (
        <div className="search-field">
            <form onSubmit={handleClick}>
                <input type="text" placeholder="Search..."/>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}

export default SearchField;