import React, {useEffect, useState} from "react";
import useGlobalInfoStore from '../../zustand_store/globalInfoStore';
import {Alert, Box, Collapse} from "@mui/material";

const AutoDismissAlert = ({duration = 3000}) => {
    const [open, setOpen] = useState(false);
    const message = useGlobalInfoStore((state) => state.message);
    const type = useGlobalInfoStore((state) => state.type);
    const clearMessage = useGlobalInfoStore((state) => state.clearMessage);
    const resetType = useGlobalInfoStore((state) => state.resetType);

    useEffect(() => {
        if (message) {
            setOpen(true);
            const closeTimer = setTimeout(() => {
                setOpen(false);
            }, duration);

            const cleanupTimer = setTimeout(() => {
                clearMessage();
                resetType();
            }, duration + 500);

            return () => {
                clearTimeout(closeTimer);
                clearTimeout(cleanupTimer);
            };
        }
    }, [message, duration, clearMessage, resetType]);

    if (!message) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                top: "5%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1500,
                width: "fit-content",
                maxWidth: "80%",
            }}
        >
            <Collapse in={open}>
                <Alert variant="filled" severity={type} sx={{minWidth: 300, boxShadow: 3}}>
                    {message}
                </Alert>
            </Collapse>
        </Box>
    );
};

export default AutoDismissAlert;