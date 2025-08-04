import DeleteIcon from "@mui/icons-material/Delete";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";
import React, {useState} from "react";
import PaginationFrame from "../common/Pagination";


const InvitationBox = ({invitations, handleAccept, pagination, handleChange, handleDelete, setIsSelectedReceived}) => {
    const [activeTab, setActiveTab] = useState("received");

    return (

        <Box>
            <Box
                id={"invitation-box"}
                sx={{
                    width: "100%",
                    // height: "60vh",
                    position: "relative",
                    bgcolor: "white",
                    borderRadius: "15px",
                    boxShadow: "0px 3.4px 35px rgba(0, 0, 0, 0.08)",
                }}
            >
                <Box id="init1" sx={{borderBottom: 1, borderColor: 'divider', mb: 2, width: "100%"}}>
                    <Stack direction="row" spacing={0}>
                        {["received", "sent"].map((tab) => (
                            <Button
                                key={tab}
                                variant={activeTab === tab ? "contained" : "outlined"}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setIsSelectedReceived(tab === "received");
                                }}
                                sx={{
                                    borderRadius: 0,
                                    textTransform: "none",
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 500,
                                    fontSize: "1rem",
                                    border: "none",
                                    borderBottom: activeTab === tab ? "3px solid" : "none",
                                    borderColor: "primary.main",
                                    color: activeTab === tab ? "primary.main" : "text.secondary",
                                    bgcolor: activeTab === tab ? "rgba(25, 118, 210, 0.1)" : "transparent",
                                    px: 3,
                                    py: 0.5,
                                    width: "50%",
                                }}
                            >
                                {tab === "received" ? "Otrzymane" : "Wys³ane"}
                            </Button>
                        ))}
                    </Stack>
                </Box>

                <Stack id={"stack1"} spacing={2} sx={{mt: 2, maxHeight: "70vh", p: 2}}>
                    {invitations.map((invitation) => {
                            const user = invitation.sender || invitation.receiver;
                            return (
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
                                    <CardContent
                                        sx={{width: "100%", p: 1, "&:last-child": {pb: 1}}}>
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

                                                <Avatar alt={user.username}/>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight="bold"
                                                    fontFamily="Montserrat, sans-serif"
                                                    fontSize="0.875rem"
                                                >
                                                    {user.username}
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={2}
                                                   alignItems="center">
                                                {activeTab === "received" &&
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
                                                }
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
                            )
                        }
                    )
                    }
                </Stack>

            </Box>
            {
                pagination.pages > 1 && (
                    <PaginationFrame pagination={pagination} handleChange={handleChange}/>
                )
            }
        </Box>

    );
};

export default InvitationBox;