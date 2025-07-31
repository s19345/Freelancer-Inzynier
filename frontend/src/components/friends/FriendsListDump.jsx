import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
    Box,
    FormControl,
    Grid,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import React from "react";
import PersonIcon from '@mui/icons-material/Person';
import PaginationFrame from "../layout/Pagination";
import {Link} from "react-router";
import paths from "../../paths";


const imageUrls = {
    image: <PersonIcon/>,
    imagem: <PersonIcon/>,
    imagem2: <PersonIcon/>,
    imagem3: <PersonIcon/>,
    imagem4: <PersonIcon/>,
    imagem5: <PersonIcon/>,
    imagem6: <PersonIcon/>,
    imagem7: <PersonIcon/>,
    bubble: "/bubble.svg",
};

const CollaboratorBox = ({collaborator}) => (
    <Stack alignItems="center" spacing={1}>
        <Box
            component={Link}
            to={paths.friendDetails(collaborator.id)}
        >
            <Box
                component="img"
                src={collaborator.profile_picture}
                alt={`${collaborator.username} avatar`}
                sx={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: "50%",
                }}
            />
        </Box>
        <Typography
            variant="body2"
            color="#4b4b4b"
            align="center"
            sx={{fontFamily: "Roboto, sans-serif", fontSize: "14px"}}
        >
            {collaborator.username}
        </Typography>
    </Stack>
);

const Box1 = ({collaborators, pagination, handleChange}) => {

    return (
        <Box sx={{width: 664, height: 703}}>
            <Paper
                elevation={0}
                sx={{
                    width: 664,
                    height: 703,
                    bgcolor: "#fcfdff",
                    borderRadius: "20px",
                    position: "relative",
                    p: 0,
                }}
            >
                {/* Header */
                }
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: "Roboto, sans-serif",
                            fontWeight: 700,
                            color: "#4b4b4b",
                            fontSize: "26px",
                        }}
                    >
                        Znajomi
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography
                            sx={{
                                fontFamily: "DM Sans, sans-serif",
                                fontWeight: 500,
                                color: "#2c2e32",
                                fontSize: "18.8px",
                            }}
                        >
                            Sortuj po
                        </Typography>

                        <FormControl sx={{minWidth: 146}}>
                            <Select
                                value="specialization"
                                displayEmpty
                                sx={{
                                    height: 33,
                                    fontSize: "15px",
                                    fontFamily: "DM Sans, sans-serif",
                                    border: "1px solid #ecedee",
                                    borderRadius: "6px",
                                    "& .MuiSelect-select": {
                                        padding: "4px 14px",
                                    },
                                }}
                                IconComponent={KeyboardArrowDownIcon}
                            >
                                <MenuItem value="specialization">Specjalizacja</MenuItem>
                                <MenuItem value="department">Wydzia³</MenuItem>
                                <MenuItem value="location">Lokalizacja</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </Stack>

                {/* Message Bubble */}
                <Box
                    sx={{
                        width: 616,
                        height: 51,
                        backgroundImage: `url(${imageUrls.bubble})`,
                        backgroundSize: "100% 100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 4,
                    }}
                >
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{
                            fontFamily: "Roboto, sans-serif",
                            color: "#4b4b4b",
                            fontSize: "16px",
                            letterSpacing: "0.2px",
                        }}
                    >
                        Lorem Ispum is the best sentence in the world of dummy text

                    </Typography>
                </Box>

                {/* Collaborators Section Header */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >

                </Stack>

                {/* Collaborators Grid */
                }
                <Grid container spacing={2}>
                    {collaborators.map((collaborator) => (
                        <Grid item xs={3} key={collaborator.id}>
                            <CollaboratorBox collaborator={collaborator}/>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
            {pagination.pages > 1 && (
                <PaginationFrame pagination={pagination} handleChange={handleChange}/>
            )}
        </Box>
    );
};

export default Box1;