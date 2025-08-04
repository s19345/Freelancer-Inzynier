import { Card, Box, Typography, CircularProgress } from "@mui/material";
import React from "react";

const StaticsBox = () => {
    return (
        <Card
            sx={{
                width: 447,
                height: 356,
                borderRadius: "15px",
                boxShadow: "0px 3px 35px rgba(0, 0, 0, 0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 3,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: "bold",
                    color: "#4b4b4b",
                    fontSize: "21px",
                }}
            >
                Ogólny czas pracy
            </Typography>

            <Box
                sx={{
                    position: "relative",
                    alignSelf: "center",
                    mt: 2,
                }}
            >
                <CircularProgress size={190} thickness={4} value={78} variant="determinate"/>

                <Typography
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontWeight: "bold",
                        color: "#1f384c",
                        fontSize: "1.8rem",
                    }}
                >
                    5w: 2d
                </Typography>
            </Box>
        </Card>
    );
};

export default StaticsBox;