import DeleteIcon from "@mui/icons-material/Delete";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";
import React from "react";
import PaginationFrame from "../layout/Pagination";

const projects = [
    {
        id: 1,
        name: "Project 1",
        icon: <LightbulbIcon/>,
    },
    {
        id: 2,
        name: "Project 2",
        icon: <LightbulbIcon/>,
    },
];

const InvitationBox = ({invitations, handleAccept, pagination, handleChange}) => {

    const handleDelete = (projectId) => {
        console.log(`Deleted project ${projectId}`);
    };

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 1053,
                height: 686,
                position: "relative",
                bgcolor: "white",
                borderRadius: "15px",
                boxShadow: "0px 3.4px 35px rgba(0, 0, 0, 0.08)",
                p: 2,
            }}
        >
            <Stack spacing={2} sx={{mt: 2, maxHeight: "80vh"}}>
                {invitations.map((invitation) => (
                    <Card
                        key={invitation.id}
                        sx={{
                            height: 88,
                            borderRadius: "15px",
                            boxShadow: "2",
                            position: "relative",
                            border: "1px solid rgba(0, 0, 0, 0.05)",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <CardContent sx={{width: "100%", p: 1, "&:last-child": {pb: 1}}}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{height: "100%"}}
                            >
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    sx={{ml: 1}}
                                >
                                    <Box
                                        component="img"
                                        src={invitation.sender.profile_picture}
                                        alt={`${invitation.sender.username} avatar`}
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            objectFit: "cover",
                                            borderRadius: "50%",
                                        }}
                                    />
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        fontFamily="Montserrat, sans-serif"
                                        fontSize="0.875rem"
                                    >
                                        {invitation.sender.username}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            borderRadius: "15px",
                                            textTransform: "none",
                                            fontFamily: "Inter, sans-serif",
                                            fontWeight: 500,
                                            fontSize: "1.125rem",
                                        }}
                                        onClick={() => handleAccept(invitation.id)}
                                    >
                                        Akceptuj
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(invitation.id)}
                                        sx={{minWidth: 45, height: 40, color: "error.main"}}
                                    >
                                        <DeleteIcon/>
                                    </Button>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
            <PaginationFrame pagination={pagination} handleChange={handleChange}/>
        </Box>
    );
};

export default InvitationBox;