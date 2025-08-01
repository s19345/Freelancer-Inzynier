import {
    Autocomplete,
    Box,
    Card,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import {statusColors} from "./ProjectDetailsDump";
import paths from "../../paths";
import {useNavigate} from "react-router";


function ProjectBox({project}) {
    const navigate = useNavigate();
    if (project) {
        project = {
            ...project,
            status: project.status.charAt(0).toUpperCase() + project.status.slice(1)
        };
    }
    ;

    const handleNavigate = (e) => {
        e.stopPropagation();
        navigate(paths.project(project.id))
    }
    return (
        <Card
            onClick={(e) => handleNavigate(e)}
            sx={{
                m: 3,

                display: "flex",
                flexDirection: "row",
                cursor: "pointer",
                p: 2,
                alignItems: "center",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
            }}
        >
            <Box
                borderRight="1px dashed #ccc"
                width="30%"
            >
                <Box sx={{ml: 2, mt: 2, mb: 2}}>
                    <Typography variant="h6">
                        {project.name}
                    </Typography>
                    <Box
                        id="client-box"
                        sx={{alignItems: "center", display: "flex", flexDirection: "column"}}
                    >
                        {project.client && (<>
                                <Typography variant="subtitle1">
                                    {project.client.contact_person}
                                </Typography>

                                <Typography variant="subtitle2">
                                    {project.client.company_name}
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>

            </Box>
            <Box
                borderRight="1px dashed #ccc"
                width={"30%"}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pl: 3,
                        pr: 3,
                        mb: 2
                    }}
                >
                    <Typography>
                        Status
                    </Typography>
                    <Chip
                        label={project.status}
                        size="small"
                        sx={{
                            backgroundColor: `${statusColors[`${project.status}_bcg`]}`,
                            color: `${statusColors[`${project.status}_color`]}`,
                            fontWeight: "medium",
                            fontSize: 12,
                            height: 24,
                            borderRadius: "22px",
                            ml: 1
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pl: 3,
                        pr: 3,
                        mb: 2
                    }}
                >
                    <Typography>
                        wersja
                    </Typography>
                    <Chip
                        label={project.version}
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
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pl: 3,
                        pr: 3,
                    }}
                >
                    <Typography>
                        Bud¿et
                    </Typography>
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

            </Box>
            <Box
                sx={{
                    ml: 3,
                    width: "40%"
                }}
            >
                <Typography
                    variant={"subtitle1"}
                    gutterBottom
                >
                    Opis
                </Typography>
                <Typography variant={"body2"}>
                    {project.description}
                </Typography>
            </Box>
        </Card>
    );
}

const ProjectListDump = ({
                             projects
                         }) => {
    const options = [
        {value: "", label: "Wszystkie"},
        {value: "active", label: "Active"},
        {value: "completed", label: "Completed"},
        {value: "paused", label: "Paused"},
    ];
    const [status, setStatus] = useState(options[0]);

    return (
        <Card
            sx={{borderRadius: 5}}
        >
            <Box
                id="project-list-header"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: "row",
                    justifyContent: "space-between",
                    p: 3,
                    borderBottom: '1px solid #d6d6d6',
                }}>
                <Typography variant="h4">
                    Ostatnie projekty
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'center', flexDirection: "row"}}>
                    <Typography variant="h6">
                        Status
                    </Typography>
                    <Autocomplete
                        options={options}
                        getOptionLabel={(option) => option.label}
                        value={status}
                        onChange={(e, newValue) => setStatus(newValue)} // tu mamy ca³y obiekt
                        renderInput={(params) => (
                            <TextField {...params} size="small"/>
                        )}
                        sx={{width: 180, ml: 2, borderRadius: 5}}
                    />
                </Box>
            </Box>
            <Box>
                {projects.map((project) => (
                    <ProjectBox key={project.id} project={project}/>
                ))}
            </Box>
        </Card>

    )
}

export default ProjectListDump;