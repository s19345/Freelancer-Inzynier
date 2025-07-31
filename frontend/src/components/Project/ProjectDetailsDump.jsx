import TimerIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IdeaIcon from "@mui/icons-material/Lightbulb";
import {
    Avatar,
    Box,
    Card,
    Chip,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import React from "react";

const taskData = [
    {
        id: "#402235",
        title: "Make an Automatic Payment System that enable the design",
        author: "Yash Ghori",
        daysAgo: 10,
        status: "Completed",
        priority: "low",
        timer: "00 : 30 : 00",
    },
    {
        id: "#402235",
        title: "Make an Automatic Payment System that enable the design",
        author: "Yash Ghori",
        daysAgo: 10,
        status: "Completed",
        priority: "low",
        timer: "00 : 30 : 00",
    },
];

const ProjecDetailsDump = () => {
    //   todo to jest komponent task list, zmieniæ nazwe i wykorzystaæ gdzie indziej
    return (
        <Box

        >
            <Card
                sx={{
                    top: 0,
                    left: 0,
                    boxShadow: "0px 3.4px 35px rgba(0, 0, 0, 0.08)",
                    borderRadius: "15px",
                    p: 0,
                }}
            >
                <Box sx={{p: 2}}>
                    <Stack spacing={2}>
                        {taskData.map((task, index) => (
                            <Box key={index}
                                 sx={{boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.4)", borderRadius: "20px", p: 2}}
                            >
                                <Stack direction="row" alignItems="flex-start" spacing={1}>
                                    <IdeaIcon
                                        sx={{
                                            color: "#666",
                                            fontSize: 25,
                                            mt: 0.5,
                                        }}
                                    />

                                    <Stack flex={1} spacing={1}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontFamily: "Montserrat",
                                                fontWeight: "bold",
                                                fontSize: 14,
                                                lineHeight: "25px",
                                                color: "black",
                                            }}
                                        >
                                            {task.title}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontFamily: "Roboto",
                                                fontSize: 12,
                                                lineHeight: "20px",
                                                color: "black",
                                            }}
                                        >
                                            {task.id}&nbsp;&nbsp;Opened {task.created_at} days ago by{" "}
                                            <Box component="span" sx={{fontWeight: "bold"}}>
                                                {task.manager}
                                            </Box>
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Chip
                                            label={task.status}
                                            size="small"
                                            sx={{
                                                backgroundColor: "#ebf9f1",
                                                color: "#1f9254",
                                                fontFamily: "Montserrat",
                                                fontWeight: "medium",
                                                fontSize: 12,
                                                height: 24,
                                                borderRadius: "22px",
                                            }}
                                        />

                                        <Chip
                                            label={task.version}
                                            size="small"
                                            sx={{
                                                backgroundColor: "#ebf9f1",
                                                color: "#1f9254",
                                                fontFamily: "Montserrat",
                                                fontWeight: "medium",
                                                fontSize: 12,
                                                height: 24,
                                                borderRadius: "22px",
                                                width: 81,
                                            }}
                                        />

                                        <Box
                                            sx={{
                                                backgroundColor: "rgba(75, 166, 101, 0.11)",
                                                borderRadius: "15px",
                                                px: 2,
                                                py: 1,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                height: 38,
                                                width: 165,
                                            }}
                                        >
                                            <TimerIcon
                                                sx={{
                                                    color: "#4ba564",
                                                    fontSize: 20,
                                                }}
                                            />
                                            <Typography
                                                sx={{
                                                    fontFamily: "Inter",
                                                    fontWeight: "medium",
                                                    color: "#4ba564",
                                                    fontSize: 16,
                                                }}
                                            >
                                                {task.timer}
                                            </Typography>
                                        </Box>

                                        <Avatar
                                            sx={{
                                                width: 35,
                                                height: 40,
                                                borderRadius: 1,
                                            }}
                                        />

                                        <Stack direction="row">
                                            <IconButton size="small">
                                                <EditIcon/>
                                            </IconButton>
                                            <IconButton size="small">
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Card>
        </Box>
    );
};

export default ProjecDetailsDump;