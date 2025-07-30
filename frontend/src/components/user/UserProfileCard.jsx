import Collections from "@mui/icons-material/Collections";
import Email from "@mui/icons-material/Email";
import Phone from "@mui/icons-material/Phone";
import Work from "@mui/icons-material/Work";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from '@mui/icons-material/Person';
import Article from '@mui/icons-material/Article';
import SchoolSharpIcon from '@mui/icons-material/SchoolSharp';
import {Avatar, Box, Divider, Stack, Typography, Popover} from "@mui/material";
import {Button} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {Link} from "react-router";
import React, {useState} from "react";
import paths from "../../paths";

const ExpandableText = ({label, icon, text}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpen = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);

    const displayText = text?.length > 60 ? `${text.slice(0, 60)}...` : text;

    return (
        <>
            <Stack direction="row" spacing={1} alignItems="flex-start" width="85%" onClick={handleOpen}
                   sx={{cursor: 'pointer', mt: 2}}>
                {icon}
                <Typography variant="body2" color="#4b4b4b" sx={{overflow: 'hidden'}}>
                    {displayText || `Dodaj ${label}`}
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

const UserProfileCard = ({user}) => {
    if (!user) return null;

    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
    const username = user.username || "U¿ytkownik";

    const contactInfo = [
        {icon: <PersonIcon/>, text: fullName || "Dodaj imiê i nazwisko"},
        {icon: <Email/>, text: user.email || "Dodaj email"},
        {icon: <Phone/>, text: user.phone_number || "Dodaj numer telefonu"},
        {icon: <AccessTimeIcon/>, text: user.timezone || "Dodaj strefê czasow±"},
        {icon: <Work/>, text: user.specialization || "Dodaj specjalizacjê"},
    ];

    return (
        <Box>

            <Box id={"user-profile-card"}
                 width={"auto"}
                // height={627}
                 bgcolor="#fcfdff"
                 borderRadius={5}
                 boxShadow={1}
                 position="relative"
                 display="flex"
                 flexDirection="column"
                 alignItems="center"
                 p={3}
            >

                {/* Profile Picture */}
                <Box
                    position="relative"
                    width={179}
                    height={184}
                    display="flex"
                    justifyContent="center"
                    mb={2}
                >
                    <Avatar
                        src={user.profile_picture || "/default-avatar.png"}
                        alt={fullName || username}
                        sx={{
                            width: 166,
                            height: 181,
                            position: "absolute",
                            top: 3,
                            left: 7,
                        }}
                    />
                    <Box
                        position="absolute"
                        width={179}
                        height={184}
                        borderRadius="89.5px/92px"
                        border={3}
                        borderColor="#ed2590"
                    />
                </Box>

                {/* Username & Location */}
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#4b4b4b"
                    textAlign="center"
                >
                    {username}
                </Typography>

                {user.location && (
                    <Typography variant="body2" color="#4b4b4b" textAlign="center">
                        {user.location}
                    </Typography>
                )}

                <Divider sx={{width: "85%", my: 2}}/>

                {/* Contact Information */}
                <Stack spacing={2} width="100%" alignItems="center" mb={2}>
                    {contactInfo.map((item, index) => (
                        <Stack
                            key={index}
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            width="85%"
                        >
                            {item.icon}
                            <Typography variant="body2" color="#4b4b4b">
                                {item.text}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>

                <Divider sx={{width: "85%", my: 2}}/>

                {/* Bio */}
                <ExpandableText
                    label="bio"
                    icon={<Article/>}
                    text={user.bio}
                />

                {/* Skills */}
                <ExpandableText
                    label="umiejêtno¶ci"
                    icon={<SchoolSharpIcon/>}
                    text={
                        user.skills?.length
                            ? user.skills.map((s) => s.name).join(", ")
                            : null
                    }
                />

                <Button
                    variant="filled"
                    size="medium"
                    startIcon={<EditIcon/>}
                    color="primary.dark"
                    component={Link}
                    to={paths.editProfile}
                    sx={{
                        mt: 5,
                        color: "#4b4b4b",
                        borderColor: "#cccccc",
                        textTransform: "none",
                        ":hover": {
                            borderColor: "#ed2590",
                            color: "#ed2590",
                            backgroundColor: "#fafafa",
                        },
                    }}
                >
                    Edytuj profil
                </Button>
            </Box>

        </Box>
    );
};

export default UserProfileCard;