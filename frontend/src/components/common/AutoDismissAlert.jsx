import React, {useEffect, useState} from "react";
import {Alert, Box, Collapse} from "@mui/material";

const AutoDismissAlert = ({messageObj, severity = "info", duration = 4000}) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (messageObj?.id) {
            setOpen(true);
            const timer = setTimeout(() => setOpen(false), duration);
            return () => clearTimeout(timer);
        }
    }, [messageObj?.id, duration]);

    if (!messageObj) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1500,
                width: "fit-content",
                maxWidth: "80%",
            }}
        >
            <Collapse in={open}>
                <Alert variant="filled" severity={severity} sx={{minWidth: 300, boxShadow: 3}}>
                    {messageObj.content ? messageObj.content : messageObj.text}
                </Alert>
            </Collapse>
        </Box>
    );
};


export default AutoDismissAlert;