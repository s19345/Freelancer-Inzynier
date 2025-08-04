import React, {useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";

import {
    Box,
    CircularProgress,
    Typography,
} from "@mui/material";

import TaskListDump from "./TaskListDump";
import paths from "../../paths";
import PaginationFrame from "../common/Pagination";

const TaskList = ({addTaskButton, returnButton}) => {
        const {projectId} = useParams();
        let {taskId} = useParams();
        const token = useAuthStore(state => state.token);
        const [tasks, setTasks] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const navigate = useNavigate()
        const [pagination, setPagination] = useState({next: null, prev: null, pages: 0, currentPage: 1});

        const fetchTasks = useCallback(async (page) => {
            let url
            if (!taskId) {
                url = `${PROJECT_BACKEND_URL}tasks/?page=${page || 1}&project=${projectId}`;
            } else {
                url = `${PROJECT_BACKEND_URL}tasks/?page=${page || 1}&project=${projectId}&parent_task=${taskId}`;
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
                setPagination({
                    next: data.next,
                    prev: data.previous,
                    pages: data.total_pages,
                    currentPage: data.current_page
                });
                setTasks(results);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }, [projectId, taskId, token]);

        const handlePageChange = (page) => {
            setPagination((prev) => ({
                ...prev,
                currentPage: page,
            }));
            fetchTasks(page);
        }

        useEffect(() => {
            fetchTasks();
        }, [fetchTasks]);


        const handleNavigate = (e, taskId) => {
            e.stopPropagation();
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
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2
                }}>
                    {returnButton && returnButton}
                    {pagination.pages > 1 && (
                        <PaginationFrame pagination={pagination} handleChange={handlePageChange}></PaginationFrame>
                    )}
                    {addTaskButton && addTaskButton}
                </Box>
            </Box>

        );
    }
;

export default TaskList;