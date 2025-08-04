import {
    Avatar, AvatarGroup,
    Box,
    Chip,
    Typography,
    Tooltip, Card
} from "@mui/material";
import React from "react";
import DeleteProject from "./DeleteProject";
import TimeInfo from "../common/TimeInfo";
import ExpandableText from "../common/ExpandableText";
import EditButton from "../common/EditButton";

const CustomAvatar = ({user}) => {
    return <Avatar
        key={user.id}
        alt={user.username}
        src={user.profile_picture || ""}
        sx={{
            width: 32,
            height: 32,
            bgcolor: !user.profile_picture ? "primary.main" : undefined,
            color: !user.profile_picture ? "white" : undefined,
        }}
    >
        {!user.profile_picture && user.username?.charAt(0).toUpperCase()}
    </Avatar>
}

export const statusColors = {
    "Active_color": "#1f9254",
    "Active_bcg": "success.background",
    "Paused_color": "warning.dark",
    "Paused_bcg": "warning.background",
    "Completed_color": "#bc0d01",
    "Completed_bcg": "#fdeaea",
}

const ProjecDetailsDump = ({project, handleEdit}) => {

    if (project) {
        project = {
            ...project,
            status: project.status.charAt(0).toUpperCase() + project.status.slice(1)
        };
    }
    ;


    function daysSince(startDate) {
        const now = new Date();
        const start = new Date(startDate);

        if (isNaN(start)) return "";

        const diffMs = now - start;
        if (diffMs < 0) return "0D";

        const msInDay = 1000 * 60 * 60 * 24;
        const msInWeek = msInDay * 7;
        const msInMonth = msInDay * 30;

        const months = Math.floor(diffMs / msInMonth);
        const weeks = Math.floor((diffMs % msInMonth) / msInWeek);
        const days = Math.floor((diffMs % msInWeek) / msInDay);

        let parts = [];
        if (months > 0) parts.push(`${months}M`);
        if (weeks > 0) parts.push(`${weeks}T`);
        if (days > 0 || parts.length === 0) parts.push(`${days}D`);

        return parts.join(" : ");
    }


    return (
        <Card sx={{p: 2}}>
            {project && (
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mr: 5
                }}>
                    <Box id="project-info"
                         sx={{display: "flex", flexDirection: "column", alignItems: "flex-start",}}>
                        <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <Typography
                                variant={"h6"}
                                sx={{mr: 2}}
                            >
                                {project.name}
                            </Typography>
                            <CustomAvatar user={project.manager}/>
                            {project.client && (
                                <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                    <Typography sx={{ml: 2, mr: 2}}>dla</Typography>
                                    <Tooltip
                                        title={
                                            <>
                                                <Typography
                                                    variant="body2">{project.client.contact_person}</Typography>
                                                <Typography
                                                    variant="body2">{project.client.company_name}</Typography>
                                            </>
                                        }
                                    >

                                        <Avatar sx={{width: 32, height: 32}}>
                                            JK
                                        </Avatar>
                                    </Tooltip>
                                </Box>

                            )}
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "row", mt: 2}}>
                            <Chip
                                label={project.status}
                                size="medium"
                                sx={{
                                    backgroundColor: `${statusColors[`${project.status}_bcg`]}`,
                                    color: `${statusColors[`${project.status}_color`]}`,
                                    fontWeight: "medium",
                                    fontSize: 14,
                                    height: 24,
                                    borderRadius: "22px",
                                }}
                            />
                            {/*<Chip*/}
                            {/*    label={project.version}*/}
                            {/*    size="medium"*/}
                            {/*    sx={{*/}
                            {/*        ml: 1,*/}
                            {/*        fontWeight: "medium",*/}
                            {/*        fontSize: 14,*/}
                            {/*        height: 24,*/}
                            {/*        borderRadius: "22px",*/}
                            {/*    }}*/}
                            {/*/>*/}
                            <Chip
                                label={project.budget + " z³"}
                                size="medium"
                                sx={{
                                    ml: 1,
                                    fontWeight: "medium",
                                    fontSize: 14,
                                    height: 24,
                                    borderRadius: "22px",
                                }}
                            />
                        </Box>
                        <AvatarGroup
                            max={6}
                            sx={{mt: 2}}
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
                            {project.collabolators
                                .filter((user) => user.id !== project.manager.id)
                                .map((user) => (
                                    <CustomAvatar user={user}/>
                                ))}
                        </AvatarGroup>
                        <ExpandableText text={project.description}/>
                    </Box>


                    <Box>
                        <TimeInfo time={daysSince(project.created_at)} label={"Spêdzony czas"}/>
                    </Box>


                    <Box>
                        <EditButton handleEdit={handleEdit}/>
                        <DeleteProject projectId={project.id}/>
                    </Box>
                </Box>
            )}
        </Card>
    );
};

export default ProjecDetailsDump;