import React, {useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";

import {
    Box,
    CircularProgress,
    Typography,
} from "@mui/material";

import TaskListDump from "./TaskListDump";
import paths from "../../paths";

const TaskList = () => {
    const {projectId} = useParams();
    let {taskId} = useParams();
    const token = useAuthStore(state => state.token);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()


    useEffect(() => {
        const fetchTasks = async () => {
            let url = null
            if (!taskId) {
                url = `${PROJECT_BACKEND_URL}tasks/?project=${projectId}`;
            } else {
                url = `${PROJECT_BACKEND_URL}tasks/?project=${projectId}&parent_task=${taskId}`;
            }
            try {
                const res = await fetch(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });
                if (!res.ok) {

                    throw new Error("Nie uda³o siê pobraæ zadañ");
                }
                const data = await res.json();
                const results = data.results
                setTasks(results);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [token, projectId]);

    const handleNavigate = (e, taskId) => {
        e.stopPropagation();
        console.log("Navigating to task details for taskId:", taskId);
        navigate(paths.taskDetails(projectId, taskId))
    }

    const handleDeleteSuccess = (deletedId) => {
        setTasks(prev => prev.filter(task => task.id !== deletedId));
    };

    if (loading) return <CircularProgress/>;
    if (error) return <Typography color="error">B³±d: {error}</Typography>;

    return (
        <Box sx={{p: 3}}>
            <TaskListDump tasks={tasks} handleDeleteSuccess={handleDeleteSuccess} handleNavigate={handleNavigate}/>

        </Box>

    );
};

export default TaskList;