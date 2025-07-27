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

// In a real implementation, these would be imported from a CDN or served from a public folder
// For this example, we'll assume these URLs are valid
const imageUrls = {
    image: <PersonIcon/>,
    imagem: <PersonIcon/>,
    imagem2: <PersonIcon/>,
    imagem3: <PersonIcon/>,
    imagem4: <PersonIcon/>,
    imagem5: <PersonIcon/>,
    imagem6: <PersonIcon/>,
    imagem7: <PersonIcon/>,
};

// Client data for the grid
const clientData = [
    {id: 1, name: "Addodle", image: imageUrls.imagem, row: 1, col: 1},
    {id: 2, name: "Marketplace.", image: imageUrls.imagem2, row: 1, col: 2},
    {id: 3, name: "Von Dracula", image: imageUrls.imagem4, row: 1, col: 3},
    {id: 4, name: "Von Dracula", image: imageUrls.imagem6, row: 1, col: 4},
    {id: 5, name: "John Joestar", image: imageUrls.image, row: 2, col: 1},
    {id: 6, name: "Akali Jin", image: imageUrls.imagem3, row: 2, col: 2},
    {id: 7, name: "Kayn Vampyr", image: imageUrls.imagem5, row: 2, col: 3},
    {id: 8, name: "Kayn Vampyr", image: imageUrls.imagem7, row: 2, col: 4},
];

const ClientBox = () => {
    return (
        <Box sx={{width: 664, height: 703}}>

            <Paper
                elevation={3}
                sx={{
                    width: 664,
                    height: 703,
                    borderRadius: "20px",
                    bgcolor: "#fcfdff",
                    position: "relative",
                    p: 3,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        color: "#4b4b4b",
                        fontSize: "26px",
                        mt: 1,
                        ml: 3,
                    }}
                >
                    Clients
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        position: "absolute",
                        top: 47,
                        right: 30,
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 500,
                            color: "#2c2e32",
                            fontSize: "18.8px",
                            mr: 3,
                        }}
                    >
                        Group By
                    </Typography>

                    <FormControl sx={{width: 146}}>
                        <Select
                            value="industry"
                            size="small"
                            sx={{
                                borderRadius: "6px",
                                border: "1px solid #ecedee",
                                "& .MuiSelect-select": {
                                    py: 0.5,
                                    px: 1.5,
                                },
                            }}
                            IconComponent={KeyboardArrowDownIcon}
                        >
                            <MenuItem value="industry">industry</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box
                    sx={{
                        width: 616,
                        height: 51,
                        mt: 2,
                        ml: 3,
                        backgroundImage: "url(/bubble.svg)",
                        backgroundSize: "100% 100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        pl: 2,
                    }}
                >

                    <Typography
                        sx={{
                            color: "#4b4b4b",
                            fontSize: 16,
                            textAlign: "center",
                            letterSpacing: "0.20px",
                        }}
                    >
                        Lorem Ispum is the best sentence in the world of dummy text
                    </Typography>
                </Box>

                <Box sx={{mt: 5, ml: 3}}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{mb: 2}}
                    >
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                color: "#4b4b4b",
                                fontSize: 16,
                            }}
                        >
                            Worked with
                        </Typography>
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                color: "#ed2590",
                                fontSize: 14,
                                mr: 2,
                            }}
                        >
                            View all
                        </Typography>
                    </Stack>

                    <Grid container spacing={2}>
                        {clientData.map((client) => (
                            <Grid
                                item
                                key={client.id}
                                sx={{width: 130, textAlign: "center", mb: 2}}
                            >
                                <Box
                                    component="img"
                                    src={client.image}
                                    alt={client.name}
                                    sx={{
                                        width: 100,
                                        height: 103,
                                        objectFit: "cover",
                                        display: "block",
                                        mx: "auto",
                                    }}
                                />
                                <Typography
                                    sx={{
                                        color: "#4b4b4b",
                                        fontSize: 14,
                                        mt: 1,
                                        textAlign: "center",
                                    }}
                                >
                                    {client.name}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default ClientBox;