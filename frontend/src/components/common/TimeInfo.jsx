import {Box, Typography} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function TimeInfo({label, time}) {
    return (
        <Box
            sx={{
                borderRadius: 2,
                p: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 200,
            }}
        >
            {label && (
                <Typography variant="subtitle1" sx={{mb: 1}}>
                    {label}
                </Typography>
            )}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "success.background",
                    borderRadius: 3,
                    px: 2,
                    py: 0.5,
                }}
            >
                <AccessTimeIcon color="success"/>
                <Typography color="success.main" fontWeight={600}>
                    {time}
                </Typography>
            </Box>
        </Box>
    );
}