import React, {useCallback, useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";
import {
    Box,
    CircularProgress,
    Alert,
} from "@mui/material";
import ProjectListDump from "./ProjectListDump";
import PaginationFrame from "../common/Pagination";
import AddButton from "../common/AddButton";
import paths from "../../paths";

const UserProjectsList = () => {
    const token = useAuthStore(state => state.token);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({next: null, prev: null, pages: 0, currentPage: 1});

    const fetchProjects = useCallback(async (page) => {
        try {
            const res = await fetch(`${PROJECT_BACKEND_URL}projects/?page=${page || 1}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Nie udało się pobrać projektów");
            }
            const data = await res.json();
            setPagination({
                next: data.next,
                prev: data.previous,
                pages: data.total_pages,
                currentPage: data.current_page
            });
            setProjects(data.results);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token])

    useEffect(() => {

        fetchProjects();
    }, [fetchProjects]);

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: page,
        }));
        fetchProjects(page);
    }

    if (loading) return <CircularProgress sx={{m: 4}}/>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box mt={4}>
            <ProjectListDump projects={projects}/>
            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", mb: 2}}>
                <PaginationFrame pagination={pagination} handleChange={handlePageChange}/>
                <AddButton label={"Stwórz nowy projekt"} to={paths.createProject}/>
            </Box>

        </Box>
    );
};

export default UserProjectsList;
