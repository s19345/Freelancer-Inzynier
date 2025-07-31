import React, {useState} from "react";
import {Popover, Stack, Typography} from "@mui/material";

const ExpandableText = ({label, icon, text}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpen = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);

    const displayText = text?.length > 20 ? `${text.slice(0, 20)}...` : text;

    return (
        <>
            <Stack direction="row" spacing={1} alignItems="flex-start" width="85%" onClick={handleOpen}
                   sx={{cursor: 'pointer', mt: 2}}>
                {icon}
                <Typography variant="body2" color="#4b4b4b" sx={{overflow: 'hidden'}}>
                    {displayText}
                </Typography>
            </Stack>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'left'}}
                PaperProps={{sx: {maxWidth: 300, p: 2}}}
            >
                <Typography variant="body2">{text || `Brak ${label}`}</Typography>
            </Popover>
        </>
    );
};

export default ExpandableText;