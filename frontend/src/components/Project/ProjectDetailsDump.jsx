import TimerIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IdeaIcon from "@mui/icons-material/Lightbulb";
import {
    Avatar, AvatarGroup,
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

const ProjecDetailsDump = ({project}) => {
    return (
        <Box>
            {project && (
                <>
                    <Typography variant={"h6"}>{project.name}</Typography>
                    <AvatarGroup
                        max={6}
                        slotProps={{
                            additionalAvatar: {
                                sx: {
                                    width: 32,
                                    height: 32,
                                    fontSize: 14,
                                },
                            },
                            avatar: {
                                sx: {
                                    width: 32,
                                    height: 32,
                                    fontSize: 14,
                                },
                            },
                        }}
                    >
                        {project.collabolators.map((c) => (
                            <Avatar
                                key={c.id}
                                alt={c.username}
                                src={c.profile_picture || ""}
                                sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: !c.profile_picture ? "primary.main" : undefined,
                                    color: !c.profile_picture ? "white" : undefined,
                                }}>
                                {!c.profile_picture && c.username.charAt(0).toUpperCase()}
                            </Avatar>
                        ))}
                    </AvatarGroup>
                </>
            )}
        </Box>
    );
};

export default ProjecDetailsDump;