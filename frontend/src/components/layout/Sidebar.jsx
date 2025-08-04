import FinancesIcon from "@mui/icons-material/AttachMoney";
import StatisticsIcon from "@mui/icons-material/BarChart";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogOutIcon from "@mui/icons-material/ExitToApp";
import ProjectsIcon from "@mui/icons-material/FolderOpen";
import CollaboratorsIcon from "@mui/icons-material/Group";
import InvitationsIcon from "@mui/icons-material/Mail";
import ClientsIcon from "@mui/icons-material/People";

import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router"
import paths from "../../paths";
import useAuthStore from "../../zustand_store/authStore";


const Sidebar = () => {
    const [selectedItem, setSelectedItem] = useState("Clients");
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const navigate = useNavigate();

    const topMenuItems = [
        {text: "Dashboard", icon: <DashboardIcon/>, adress: paths.dashboard},
        {text: "Projekty", icon: <ProjectsIcon/>, adress: paths.projectList},
        {text: "Klienci", icon: <ClientsIcon/>, adress: paths.clients},
        {text: "Znajomi", icon: <CollaboratorsIcon/>, adress: paths.friends},
        {text: "Kalendarz", icon: <CalendarIcon/>, adress: paths.calendar},

        {text: "Statystyki", icon: <StatisticsIcon/>, adress: paths.statistics},
        {text: "Finanse", icon: <FinancesIcon/>, adress: paths.finances},
        {text: "Zaproszenia", icon: <InvitationsIcon/>, adress: paths.invitationList},
        {text: "Wyloguj", icon: <LogOutIcon/>, adress: paths.logout},
    ];

    useEffect(() => {
        if (!isLoggedIn) {
            navigate(paths.login);
        }
    }, [isLoggedIn, navigate]);

    const handleItemClick = (text) => {
        setSelectedItem(text);
    };

    return (
        <Box
            sx={{
                width: 280,
                height: "100vh",
                bgcolor: "primary.main",
                borderRadius: "0px 20px 20px 0px",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                minWidth: 280,
            }}
        >
            <Box
                sx={{
                    width: 47,
                    height: "calc(100% - 136px)",
                    bgcolor: "primary.dark",
                    position: "absolute",
                    top: 100,
                    left: 0,
                }}
            />
            <Box
                sx={{
                    width: "100%",
                    height: 100,
                    bgcolor: "primary.dark",
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    position: "absolute",
                    top: 110,
                    left: 47,
                    width: "calc(100% - 47px)",
                }}
            >

                <List sx={{width: "100%"}}>
                    {topMenuItems.map((item) => (
                        <ListItem
                            key={item.text}
                            onClick={() => handleItemClick(item.text)}
                            component={Link}
                            to={item.adress}
                            sx={{
                                width: 206,
                                height: 53,
                                mb: 3,
                                borderRadius: "0px 20px 20px 0px",
                                bgcolor:
                                    selectedItem === item.text ? "primary.dark" : "primary.main",
                                "&:hover": {
                                    bgcolor: "primary.dark",
                                    cursor: "pointer",
                                },
                            }}
                        >
                            <ListItemIcon sx={{color: "white", minWidth: 40}}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: "white",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {item.text}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>


            </Box>


        </Box>
    );
};

export default Sidebar;
