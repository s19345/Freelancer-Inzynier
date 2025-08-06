import {Card, Box, Typography, CircularProgress} from "@mui/material";
import React from "react";

const StaticsBox = ({workTime}) => {
    const workHours = Math.floor(workTime / 3600);

    function getWorkPercentage(timeInSeconds) {
        const fullTimeInSeconds = 40 * 3600; // 40 godzin = 144000 sekund
        const percentage = (timeInSeconds / fullTimeInSeconds) * 100;
        return Number(percentage.toFixed(2));
    }

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
                Tygodniowy czas pracy
            </Typography>

            <Box
                sx={{
                    position: "relative",
                    alignSelf: "center",
                    mt: 2,
                }}
            >
                <CircularProgress size={190} thickness={4} value={getWorkPercentage(workTime)} variant="determinate"/>

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
                    {workHours} h
                </Typography>
            </Box>
        </Card>
    );
};

export default StaticsBox;