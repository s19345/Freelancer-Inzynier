import {Avatar, AvatarGroup, Box, Card, Grid, Tooltip, Typography} from "@mui/material";
import useAuthStore from "../../zustand_store/authStore";
import {fetchLastActiveProjects} from "../fetchers";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as TooltipRecharts,
    ResponsiveContainer,
} from "recharts";
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
                        height: "46px" // wysokość dostosowana do 2 linii tekstu
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
                <AvatarGroup max={4} spacing={"medium"}
                             sx={{
                                 '& .MuiAvatar-root': {
                                     width: 25,
                                     height: 25,
                                     fontSize: 14,
                                 },
                             }}>
                    {project.users?.map((collaborator) => (<Avatar
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

const TeamCard = ({project}) => {
    const navigate = useNavigate()

    const handleUserClick = (userId) => {
        navigate(paths.friendDetails(userId));
    }

    return (
        <Card sx={{m: 1, p: 1, display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Typography variant={"body2"}>{project.name}</Typography>
            <AvatarGroup max={9} spacing={"medium"}
                         sx={{
                             '& .MuiAvatar-root': {
                                 width: 25,
                                 height: 25,
                                 fontSize: 14,
                             },
                         }}>
                {project.users?.map((user) => (
                    <Tooltip
                        key={user.id}
                        title={
                            <Typography variant="caption" display="block">{user.username}</Typography>
                        }
                        arrow
                    >
                        <Avatar
                            onClick={() => handleUserClick(user.id)}
                            src={user.profile_picture}
                            alt={user.username}
                            sx={{width: 25, height: 25, cursor: "pointer"}}
                        />
                    </Tooltip>
                ))}
                {(!project.users || project.users.length === 0) &&
                    <Typography variant="caption">Brak członków</Typography>
                }
            </AvatarGroup>
        </Card>
    )
}

const TimeBarChart = ({data}) => {
    const dataMap = (data || []).reduce((acc, item) => {
        acc[item.date] = item.total_time; // sekundy
        return acc;
    }, {});

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const last30Days = Array.from({length: 30}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const formattedDate = formatDate(date);
        return {
            date: formattedDate,
            total_time: dataMap[formattedDate] || 0,
            day: String(date.getDate()).padStart(2, "0"),
            month: date.toLocaleDateString("pl-PL", {month: "short"}),
            monthKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        };
    });

    // Grupuj daty po miesiącach, aby wiedzieć gdzie wstawić nazwę miesiąca
    const monthTicks = [];
    for (let i = 0; i < last30Days.length; i++) {
        if (i === 0 || last30Days[i].monthKey !== last30Days[i - 1].monthKey) {
            monthTicks.push({
                value: last30Days[i].date,
                month: last30Days[i].month,
            });
        }
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={last30Days}
                margin={{top: 20, right: 30, left: 20, bottom: 30}}
            >
                {/* Górna oś z dniami */}
                <XAxis
                    dataKey="date"
                    tickFormatter={(dateStr, index) => {
                        const date = new Date(dateStr);
                        return date.getDate() % 2 === 0 ? String(date.getDate()).padStart(2, "0") : "";
                    }}
                    tickLine={false}
                    axisLine={true}
                    interval={0}
                    height={20}
                />

                {/* Dolna oś z miesiącami */}
                <XAxis
                    dataKey="date"
                    xAxisId="month"
                    axisLine={false}
                    tickLine={false}
                    ticks={monthTicks.map((t) => t.value)}
                    tickFormatter={(value) => {
                        const tick = monthTicks.find((t) => t.value === value);
                        return tick ? tick.month : "";
                    }}
                    height={20}
                    orientation="bottom"
                />

                <YAxis
                    domain={[0, (dataMax) => Math.ceil(dataMax / 3600) * 3600]}
                    tickFormatter={(value) => `${Math.floor(value / 3600)}h`}
                    tickCount={10}
                />


                <TooltipRecharts
                    formatter={(value) => [formatTime(value), "Czas"]}
                    labelFormatter={(label) => `Data: ${label}`}
                />
                <Bar dataKey="total_time" fill="#1976d2"/>
            </BarChart>
        </ResponsiveContainer>
    );
};

const Dashboard = () => {
    const user = useAuthStore((state) => state.user);
    const [projects, setProjects] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [dailyTimes, setDailyTimes] = useState([]);
    const token = useAuthStore((state) => state.token);


    useEffect(() => {
        if (!token) return

        const loadProjects = async () => {
            const data = await fetchLastActiveProjects(token);
            setProjects(data.projects);
            setDailyTimes(data.total_daily_times);
        };
        loadProjects();
    }, [token]);

    useEffect(() => {
        const tasks = (projects || []).flatMap(project => project.user_tasks_prefetched)
        setAllTasks(tasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date)).slice(0, 5));
    }, [projects]);


    useEffect(() => {
    }, [projects]);

    return (
        <Box id="dashboard">
            <Box id={"dashboard-header"}>
                {user && <>
                    <Typography variant="h3" gutterBottom sx={{fontWeight: '900', marginTop: 2}}>
                        Cześć {user.username}
                    </Typography>
                    <Typography variant="h4" gutterBottom sx={{fontWeight: '900', marginTop: 2}}>
                        Możesz tu zarządzać swoją pracą
                    </Typography>
                </>}
            </Box>

            <Box id="first-row"
                 sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',}}>
                <Box id="left-column" sx={{flex: 7, m: 2, p: 2, border: '2px solid #eaeaea', borderRadius: '9px'}}>
                    <Typography variant="h6">
                        Czas pracy w ciągu ostatnich 30 dni
                    </Typography>
                    <TimeBarChart data={dailyTimes}/>
                </Box>
                <Box id="first-right-column"
                     sx={{flex: 2, m: 2, p: 2, border: '2px solid #eaeaea', borderRadius: '9px'}}>
                    <Typography variant="h6">
                        Zespoły
                    </Typography>
                    {projects && projects.length > 0 ? (
                        projects.map((project) =>
                                project.users?.length > 0 && (
                                    <TeamCard key={project.id} project={project}/>
                                )
                        )
                    ) : (
                        <Typography variant="body1">
                            Nie masz jeszcze żadnych zespołów
                        </Typography>
                    )}
                </Box>
            </Box>
            <Box id="second-row" sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Box id="second-left-column"
                     sx={{flex: 3, m: 2, p: 2, border: '2px solid #eaeaea', borderRadius: '9px'}}>
                    <Typography variant="h6">
                        Najpilniejsze zadania
                    </Typography>
                    {allTasks && allTasks.length > 0 ? (
                        allTasks.map((task) => (
                            <TaskCard key={task.id} task={task}/>
                        ))
                    ) : (
                        <Typography variant="body1">
                            Nie masz jeszcze żadnych przypisanych do siebie zadań
                        </Typography>
                    )}
                </Box>
                <Box id="second-right-column"
                     sx={{flex: 7, m: 2, p: 2, border: '2px solid #eaeaea', borderRadius: '9px'}}>
                    <Typography variant="h6" sx={{ml: 2}}>
                        Ostatnie Projekty
                    </Typography>
                    <Grid container spacing={2}>
                        {projects && projects.length > 0 ? (
                            projects.slice(0, 8).map((project) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
                                    <ProjectCard project={project}/>
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="body1">
                                Nie masz jeszcze żadnych projektów
                            </Typography>
                        )}
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
}

export default Dashboard;