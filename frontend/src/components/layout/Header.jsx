import {Box, Stack, Typography, Avatar} from "@mui/material";
import {Link} from "react-router";
import paths from "../../paths";
import useAuthStore from "../../zustand_store/authStore";

export default function Header() {
    const user = useAuthStore((state) => state.user);

    return (
        <Box
            sx={{
                width: "100%",
                px: 2,
                py: 1,
                position: "relative",
                boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
                bgcolor: "background.default",
            }}
        >
            <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                width="100%"
                spacing={2}
            >
                {user &&
                    <Stack direction="row" spacing={2} alignItems="center" sx={{minWidth: 200}}>
                        <Box
                            component={Link}
                            to={paths.userProfile}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                textDecoration: "none",
                                color: "inherit",
                                cursor: "pointer",
                                gap: 1,
                            }}

                        >
                            <Avatar src={user.profile_picture} alt={user.name} sx={{width: 45, height: 45}}/>
                            <Stack>
                                <Typography variant="body1" fontWeight="bold" color="text.primary">
                                    {user.username}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user.email}
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>}
            </Stack>
        </Box>
    );
}
