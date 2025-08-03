import {Avatar, AvatarGroup, Box, Card, Grid, Tooltip, Typography} from "@mui/material";
import useAuthStore from "../../zustand_store/authStore";
import {fetchLastActiveProjects} from "../fetchers";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import paths from "../../paths";

const ProjectCard = ({project}) => {
    const navigate = useNavigate()
    const handleClick = () => {
        navigate(paths.project(project.id));
    };

    return (
        <Card
            onClick={() => {
                handleClick();
            }}
            sx={{
                width: 130,
                textAlign: "center",
                background: "#F5F7FE",
                p: 2,
                m: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
            }}
        >
            <Tooltip title={project.name} arrow>
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%",
                        minWidth: 100,
                        height: "46px" // wysoko¶æ dostosowana do 2 linii tekstu
                    }}
                >
                    {project.name}
                </Typography>
            </Tooltip>


            <Avatar
                src={project.manager?.profile_picture}
                alt={project.manager?.username}
                sx={{width: 25, height: 25, my: 1}}
            />

            <Typography variant="body2" sx={{fontWeight: 500, mb: 1}}>
                {project.manager?.username}
            </Typography>

            <Box sx={{height: 30,}}>
                <AvatarGroup max={4} spacing={15}>
                    {project.collabolators?.map((collaborator) => (<Avatar
                        key={collaborator.id}
                        src={collaborator.profile_picture}
                        alt={collaborator.username}
                        sx={{width: 25, height: 25}}
                    />))}
                </AvatarGroup>
            </Box>
        </Card>);
};

const TaskCard = ({task}) => {

    const priorityColors = {
        low: "rgba(115,221,140,0.2)",
        medium: "#fff9e6",
        high: "#fdeaea",
    }

    const navigate = useNavigate()
    const handleClick = () => {
        navigate(paths.taskDetails(task.project.id, task.id));
    };

    return (
        <Card
            onClick={() => {
                handleClick(task.id)
            }}
            sx={{
                textAlign: "center",
                // background: `${priorityColors[task.priority]}`,
                background: priorityColors[task.priority],
                // background: 'warning.background',
                p: 1,
                m: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
            }}
        >
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", flex: 1}}>
                <Tooltip title={task.title} arrow>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 600,
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "100%",
                            minWidth: 100,
                        }}
                    >
                        {task.title}
                    </Typography>

                </Tooltip>
                <Tooltip title={task.description} arrow>
                    <Typography
                        variant="body2"
                        sx={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "100%",
                            minWidth: 100,

                        }}
                    >
                        {task.description}
                    </Typography>
                </Tooltip>
            </Box>

            <Typography variant="body2" sx={{fontWeight: 500, mb: 1}}>
                {task.assignee?.username}
            </Typography>
        </Card>
    )

}

const Dashboard = () => {
    const user = useAuthStore((state) => state.user);
    const [projects, setProjects] = useState([]);
    const [allTasks, setAllTasks] = useState([]);

    useEffect(() => {
        const loadProjects = async () => {
            const data = await fetchLastActiveProjects();
            setProjects(data.results);
        };

        loadProjects();
    }, []);

    useEffect(() => {
        const tasks = projects.flatMap(project => project.user_tasks_prefetched)
        setAllTasks(tasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date)).slice(0, 5));
    }, [projects]);


    return (<Box id="dashboard">
        <Box id={"dashboard-header"}>
            <Typography variant="h3" gutterBottom sx={{fontWeight: '900', marginTop: 2}}>
                Cze¶æ {user.username},
            </Typography>
            <Typography variant="h4" gutterBottom sx={{fontWeight: '900', marginTop: 2}}>
                Mo¿esz tu zarz±dzaæ swoj± prac±
            </Typography>
        </Box>

        <Box id="first-row"
             sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: "30vh"}}>
            <Box id="left-column" sx={{flex: 7, m: 2, border: '2px solid #eaeaea', borderRadius: '9px'}}>
                <Typography variant="h2">
                    Piêkny wykres
                </Typography>
            </Box>
            <Box id="first-right-column" sx={{flex: 2, m: 2, border: '2px solid #eaeaea', borderRadius: '9px'}}>
                <Typography varioant="h2">
                    teams
                </Typography>
            </Box>
        </Box>
        <Box id="second-row" sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Box id="second-left-column"
                 sx={{flex: 3, m: 2, p: 2, border: '2px solid #eaeaea', borderRadius: '9px'}}>
                <Typography variant="h6">
                    Najpilniejsze zadania
                </Typography>
                {allTasks && allTasks.map(task => (
                    <TaskCard key={task.id} task={task}/>
                ))}
            </Box>
            <Box id="second-right-column"
                 sx={{flex: 7, m: 2, p: 2, border: '2px solid #eaeaea', borderRadius: '9px'}}>
                <Typography variant="h6" sx={{ml: 2}}>
                    Ostatnie Projekty
                </Typography>
                <Grid container spacing={2}>
                    {projects &&
                        projects.slice(0, 8).map((project) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
                                <ProjectCard project={project}/>
                            </Grid>
                        ))}
                </Grid>
            </Box>
        </Box>
    </Box>)
}

export default Dashboard;