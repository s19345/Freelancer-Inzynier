import {Avatar, Box, Card, Chip, Stack, Tooltip, Typography} from "@mui/material";
import IdeaIcon from "@mui/icons-material/Lightbulb";
import TimerIcon from "@mui/icons-material/AccessTime";
import React from "react";
import DeleteTask from "./DeleteTask";
import {daysSince, daysUntil} from "../helpers";

export const statusColors = {
    "to_do_color": "#1f9254",
    "to_do_bcg": "success.background",
    "in_progress_color": "warning.dark",
    "in_progress_bcg": "warning.background",
    "completed_color": "#bc0d01",
    "completed_bcg": "#fdeaea",
}
export const priorityColors = {
    low_color: "#1f9254",
    low_bcg: "success.background",
    medium_color: "warning.dark",
    medium_bcg: "warning.background",
    high_color: "#bc0d01",
    high_bcg: "#fdeaea",
}

const TaskListDump = ({tasks, handleNavigate, handleDeleteSuccess}) => {


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
                        {tasks.map((task, index) => {
                                const contextText = task.parent_task ? 'podzadanie' : 'zadanie';
                                return (
                                    <Card key={index}
                                          id="task-box"
                                          sx={{
                                              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.35)",
                                              borderRadius: "20px",
                                              p: 2,
                                              display: "flex",
                                              flexDirection: "row",
                                              alignItems: "center",
                                              border: "1px solid #e0e0e0",
                                              kursor: "pointer",
                                          }}
                                          onClick={(e) => handleNavigate(task.id)}
                                    >
                                        <IdeaIcon
                                            sx={{
                                                color: "#666",
                                                fontSize: 25,
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
                                                        Utworzone {daysSince(task.created_at)} dni temu
                                                    </Typography>

                                                    <Chip
                                                        label={task.status_display}
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
                                                        label={task.priority_display}
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
                                            </Box>
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
                                            {task?.user &&
                                                <Tooltip
                                                    key={task.user.id}
                                                    title={
                                                        <Typography variant="caption" display="block">
                                                            {task.user.username}
                                                        </Typography>
                                                    }
                                                    arrow
                                                >
                                                    <Avatar
                                                        alt={task.user.username}
                                                    />
                                                </Tooltip>
                                            }
                                            <DeleteTask handleDeleteSuccess={handleDeleteSuccess} taskId={task.id}
                                                        contextText={contextText}/>
                                        </Stack>
                                    </Card>
                                )
                            }
                        )
                        }
                    </Stack>
                </Box>
            </Card>
        </Box>
    );
}

export default TaskListDump;