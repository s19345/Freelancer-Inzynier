import React, {useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";
import {Link} from "react-router";
import {
    Typography,
    List,
    ListItem,
    Paper,
    Box,
    CircularProgress,
    Alert,
    Stack, Button,
} from "@mui/material";
import paths from "../../paths";
import ProjectDetailsDump from "./ProjectDetailsDump";
import ProjectListDump from "./ProjectListDump";
import PaginationFrame from "../common/Pagination";
import AddButton from "../common/AddButton";

const UserProjectsList = () => {
    const token = useAuthStore(state => state.token);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({next: null, prev: null, pages: 0, currentPage: 1});

    const fetchProjects = async (page) => {
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
            console.log("Fetched projects:", data);
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
    };

    useEffect(() => {

            fetchProjects();
        },
        [token]);

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
                <AddButton label={"Dodaj nowy projekt"} to={paths.createProject}/>
            </Box>
            {/*<Typography variant="h5" gutterBottom>*/}
            {/*    Twoje projekty*/}
            {/*</Typography>*/}

            {/*<List>*/}
            {/*    {projects.map((project) => (*/}
            {/*        <ListItem key={project.id} disableGutters sx={{mb: 2}}>*/}
            {/*            <Paper elevation={2} sx={{p: 2, width: '100%'}}>*/}
            {/*                <Stack spacing={1}>*/}
            {/*                    <Typography*/}
            {/*                        variant="h6"*/}
            {/*                        component={Link}*/}
            {/*                        to={paths.project(project.id)}*/}
            {/*                        sx={{*/}
            {/*                            textDecoration: 'none',*/}
            {/*                            color: 'primary.main',*/}
            {/*                            '&:hover': {textDecoration: 'underline'},*/}
            {/*                        }}*/}
            {/*                    >*/}
            {/*                        {project.name || "Bez nazwy"}*/}
            {/*                    </Typography>*/}

            {/*                    <Typography variant="body2">Status: {project.status}</Typography>*/}
            {/*                    {project.description && (*/}
            {/*                        <Typography variant="body2">{project.description}</Typography>*/}
            {/*                    )}*/}
            {/*                    {project.budget && (*/}
            {/*                        <Typography variant="body2">Budżet: {project.budget} zł</Typography>*/}
            {/*                    )}*/}
            {/*                </Stack>*/}
            {/*            </Paper>*/}
            {/*        </ListItem>*/}
            {/*    ))}*/}
            {/*</List>*/}
            {/*<Box mt={2}>*/}
            {/*    <Button*/}
            {/*        component={Link}*/}
            {/*        to={paths.createProject}*/}
            {/*        variant="contained"*/}
            {/*        color="primary"*/}
            {/*    >*/}
            {/*        Utwórz nowy projekt*/}
            {/*    </Button>*/}
            {/*</Box>*/}
        </Box>
    );
};

export default UserProjectsList;
