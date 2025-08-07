import {Box, Stack, Typography, Avatar, Autocomplete, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                spacing={2}
            >
                {/* Search box */}
                <Box
                    sx={{
                        flexGrow: 1,
                        maxWidth: 480,
                        height: 45,
                        bgcolor: "background.paper",
                        borderRadius: "22px",
                        boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.15)",
                        overflow: "hidden",
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{height: "100%", px: 2}}
                    >
                        <SearchIcon sx={{color: "text.secondary", fontSize: 20}}/>
                        <Autocomplete
                            freeSolo
                            options={[]}
                            fullWidth
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Search"
                                    variant="standard"
                                    InputProps={{
                                        ...params.InputProps,
                                        disableUnderline: true,
                                    }}
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            fontSize: "0.95rem",
                                            fontFamily: "inherit",
                                            color: "text.secondary",
                                        },
                                    }}
                                />
                            )}
                        />
                    </Stack>
                </Box>

                {/* User info */}
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
