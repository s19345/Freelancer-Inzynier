import {Avatar, Box, Button, Card, Chip, Stack, Typography} from "@mui/material";
import IdeaIcon from "@mui/icons-material/Lightbulb";
import TimerIcon from "@mui/icons-material/AccessTime";
import DeleteTask from "./DeleteTask";
import React from "react";
import {daysSince, daysUntil} from "../helpers";
import {priorityColors, statusColors} from "./TaskListDump";
import ExpandableText from "../common/ExpandableText";
import EditButton from "../common/EditButton";

const TaskDetailsDump = ({task, handleDeleteSuccess, handleEditClick, handleTaskStartOrPause, handleEndTask}) => {


    return (
        <Box key={task.id}
             id="task-box"
             sx={{
                 p: 2,
                 display: "flex",
                 flexDirection: "row",
                 alignItems: "center",
             }}
        >
            <IdeaIcon
                sx={{
                    color: "#666",
                    fontSize: 30,
                    mt: 0.5,
                    mr: 1,
                }}
            />
            <Stack
                id={"stack1"}
                direction="row"
                spacing={1}
                sx={{display: "flex", width: "100%", alignItems: "center"}}
            >

                <Box sx={{
                    flexDirection: "column",
                    display: "flex",
                    flex: 1,
                    width: "fit-content",
                }}>
                    <Stack
                        flex={1}
                        spacing={1}
                        sx={{width: "fit-content",}}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: "bold",
                                fontSize: 14,
                                lineHeight: "25px",
                                color: "black",
                                width: "fit-content",
                            }}
                        >
                            {task.title}
                        </Typography>
                    </Stack>


                    <Stack
                        id={"stack2"}
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{width: "fit-content"}}
                    >
                        <Typography
                            id={"task-title"}
                            variant="body2"
                            sx={{
                                fontSize: 12,
                                lineHeight: "20px",
                                color: "black",
                            }}
                        >
                            Opened {daysSince(task.created_at)} days ago
                        </Typography>

                        <Chip
                            label={task.status}
                            size="small"
                            sx={{
                                backgroundColor: `${statusColors[`${task.status}_bcg`]}`,
                                color: `${statusColors[`${task.status}_color`]}`,
                                fontWeight: "medium",
                                fontSize: 12,
                                height: 24,
                                borderRadius: "22px",
                            }}
                        />
                        <Chip
                            label={task.priority}
                            size="small"
                            sx={{
                                backgroundColor: `${priorityColors[`${task.priority}_bcg`]}`,
                                color: `${priorityColors[`${task.priority}_color`]}`,
                                fontWeight: "medium",
                                fontSize: 12,
                                height: 24,
                                borderRadius: "22px",
                            }}
                        />
                    </Stack>
                    <ExpandableText text={task.description} label={"opis"}/>
                </Box>
                <Button
                    onClick={() => handleTaskStartOrPause(task.id)}
                >
                    {task.status == "to_do" && <Typography variant={"subtitle2"}>Rozpocznij zadanie</Typography>}
                    {task.status == "in_progress" && <Typography variant={"subtitle2"}>Wstrzymaj zadanie</Typography>}
                </Button>
                {task.status == "in_progress" && (
                    <Button
                        onClick={() => handleEndTask(task.id)}
                    >
                        <Typography variant={"subtitle1"}>Zakoñcz zadanie</Typography>
                    </Button>
                )}
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
                        {daysUntil(task.due_date)} d
                    </Typography>
                </Box>
                {task.user && (
                    <Avatar
                        alt={task.user.username}
                        src={task.user.profile_picture}
                    />
                )}
                <EditButton handleEdit={handleEditClick}/>
                <DeleteTask handleDeleteSuccess={handleDeleteSuccess} taskId={task.id}/>
            </Stack>
        </Box>
    )
}

export default TaskDetailsDump;