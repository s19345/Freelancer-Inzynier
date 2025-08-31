import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
    Avatar,
    Box, Button, Card, CardContent, CircularProgress,
    FormControl,
    MenuItem,
    Paper,
    Select,
    Stack, TextField,
    Typography,
} from "@mui/material";
import React, {useState} from "react";
import PaginationFrame from "../common/Pagination";
import {useNavigate} from "react-router";
import paths from "../../paths";


const FieldBox = ({children, title, ...props}) => {
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 1, width: "100%", mt: 1}} {...props}>
            <Typography variant="body1">{title}</Typography>
            {children}
        </Box>
    );
};

const RowBox = ({children, ...props}) => {
    return (
        <Box sx={{display: "flex", flexDirection: "row", gap: 3}} {...props}>
            {children}
        </Box>
    );
}

const CollaboratorCard = ({collaborator, handleInvite, newFriendsSearching}) => {
    const navigate = useNavigate()
    const handleClick = () => {
        if (!newFriendsSearching) {
            navigate(paths.friendDetails(collaborator.id))
        }
    }
    return (
        <CardContent
            sx={{width: "100%", p: 1, "&:last-child": {pb: 1}, cursor: newFriendsSearching ? "default" : "pointer"}}
            onClick={handleClick}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1} sx={{flexBasis: "25%"}}>
                    <Avatar alt={collaborator?.username}/>
                    <Typography>{collaborator?.username}</Typography>
                </Stack>
                <Typography variant={"body2"} sx={{flexBasis: "25%"}}>{collaborator.specialization}</Typography>
                <Typography variant={"body2"} sx={{flexBasis: "20%"}}>{collaborator.location}</Typography>
                <Typography variant={"body2"} sx={{flexBasis: "20%"}}>{collaborator.timezone}</Typography>
                <Stack sx={{flexBasis: "15%"}}>
                    {newFriendsSearching && (
                        <Button
                            disabled={collaborator.request_sent || collaborator.request_received}
                            onClick={() => handleInvite(collaborator.id)}
                        >
                            <Typography variant={"body2"}>
                                {collaborator.request_sent
                                    ? "Wysłano"
                                    : collaborator.request_received
                                        ? "Zaprosił Cię"
                                        : "Zaproś"}
                            </Typography>
                        </Button>
                    )}
                </Stack>
            </Stack>
        </CardContent>

    )
}

const Filtrers = ({changeFilter}) => {

    const [filters, setFilters] = useState({
        username: "",
        first_name: "",
        last_name: "",
        specialization: "",
        location: "",
        skills: "",
    });

    const handleChange = (field, value) => {
        setFilters((prev) => ({...prev, [field]: value}));
    };

    const handleSave = () => {
        changeFilter(filters);
    };

    const clearFilters = () => {
        setFilters({
            username: "",
            first_name: "",
            last_name: "",
            specialization: "",
            location: "",
            skills: "",
        });
        changeFilter({});
    }

    return (
        <Card sx={{p: 2}}>
            <Stack spacing={2}>
                <RowBox>
                    <FieldBox title="Username">
                        <TextField
                            value={filters.username}
                            onChange={(e) => handleChange("username", e.target.value)}
                            variant="outlined"
                            size="small"
                        />
                    </FieldBox>
                    <FieldBox title="Imię">
                        <TextField
                            value={filters.first_name}
                            onChange={(e) => handleChange("first_name", e.target.value)}
                            variant="outlined"
                            size="small"
                        />
                    </FieldBox>
                    <FieldBox title="Nazwisko">
                        <TextField
                            value={filters.last_name}
                            onChange={(e) => handleChange("last_name", e.target.value)}
                            variant="outlined"
                            size="small"
                        />
                    </FieldBox>
                </RowBox>
                <RowBox>
                    <FieldBox title="Specjalizacja">
                        <TextField
                            value={filters.specialization}
                            onChange={(e) => handleChange("specialization", e.target.value)}
                            variant="outlined"
                            size="small"
                        />
                    </FieldBox>
                    <FieldBox title="Lokalizacja">
                        <TextField
                            value={filters.location}
                            onChange={(e) => handleChange("location", e.target.value)}
                            variant="outlined"
                            size="small"
                        />
                    </FieldBox>
                    <FieldBox title="Umiejętności">
                        <TextField
                            value={filters.skills}
                            onChange={(e) => handleChange("skills", e.target.value)}
                            variant="outlined"
                            size="small"
                        />
                    </FieldBox>
                </RowBox>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    width: "100%",
                    mt: 1,
                    pr: 5,
                    pl: 5,
                    justifyContent: "space-between"
                }}>
                    <Button variant="contained" color="primary" onClick={clearFilters}>
                        Wyczyść filtry
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Szukaj
                    </Button>
                </Box>

            </Stack>
        </Card>
    );
}

const FriendsDump = ({
                         collaborators,
                         pagination,
                         handleChange,
                         newFriendsSearching,
                         pageSize,
                         toggleNewFriendsSearching,
                         changePageSize,
                         handleInvite,
                         changeFilter,
                         isLoading
                     }) => {

    const [showFilters, setShowFilters] = useState(false);

    return (
        <Box>
            <Paper
                elevation={0}
                sx={{
                    bgcolor: "#fcfdff",
                    borderRadius: "20px",
                    p: 0,
                }}
            >
                {/* Header */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: "Roboto, sans-serif",
                            fontWeight: 700,
                            color: "#4b4b4b",
                            fontSize: "26px",
                        }}
                    >
                        Znajomi
                    </Typography>

                    <Button onClick={() => toggleNewFriendsSearching()}>
                        <Typography>
                            {newFriendsSearching ? "Twoi znajomi" : "Szukaj znajomych"}
                        </Typography>
                    </Button>

                    <Box sx={{width: 24}}>
                        {isLoading && <CircularProgress size={34}/>}
                    </Box>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Button
                            onClick={() => {
                                setShowFilters(prev => !prev)
                            }}
                        >
                            <Typography variant={"body1"}>
                                {showFilters ? "Ukryj filtry" : "Pokaż filtry"}
                            </Typography>
                        </Button>

                        <Typography
                            sx={{
                                fontFamily: "DM Sans, sans-serif",
                                fontWeight: 500,
                                color: "#2c2e32",
                                fontSize: "18.8px",
                            }}
                        >
                            Rozmiar strony
                        </Typography>

                        <FormControl sx={{minWidth: 90}}>
                            <Select
                                value={pageSize}
                                onChange={(e) => changePageSize(Number(e.target.value))}
                                sx={{
                                    height: 33,
                                    fontSize: "15px",
                                    fontFamily: "DM Sans, sans-serif",
                                    border: "1px solid #ecedee",
                                    borderRadius: "6px",
                                    "& .MuiSelect-select": {
                                        padding: "4px 14px",
                                    },
                                }}
                                IconComponent={KeyboardArrowDownIcon}
                            >
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={40}>40</MenuItem>
                                <MenuItem value={60}>60</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </Stack>

                {showFilters &&
                    <Filtrers changeFilter={changeFilter}/>
                }

                <Stack spacing={2} sx={{mt: 2, p: 2, overflowY: "auto"}}>
                    <Card
                        sx={{
                            borderRadius: "15px",
                            boxShadow: 1,
                            border: "1px solid rgba(0, 0, 0, 0.05)",
                            bgcolor: "grey.100",
                            p: 1,
                        }}
                    >
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2" sx={{flexBasis: "25%"}}>
                                Użytkownik
                            </Typography>
                            <Typography variant="subtitle2" sx={{flexBasis: "25%"}}>
                                Specjalizacja
                            </Typography>
                            <Typography variant="subtitle2" sx={{flexBasis: "20%"}}>
                                Lokalizacja
                            </Typography>
                            <Typography variant="subtitle2" sx={{flexBasis: "20%"}}>
                                Strefa czasowa
                            </Typography>
                            <Typography variant="subtitle2" sx={{flexBasis: "15%", pl: 5}}>
                                Akcja
                            </Typography>
                        </Stack>
                    </Card>
                    {collaborators && collaborators.length > 0 ? (
                        collaborators.map((collaborator) => (
                            <Card
                                key={collaborator.id}
                                sx={{
                                    borderRadius: "15px",
                                    boxShadow: 2,
                                    position: "relative",
                                    border: "1px solid rgba(0, 0, 0, 0.05)",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <CollaboratorCard collaborator={collaborator} handleInvite={handleInvite}
                                                  newFriendsSearching={newFriendsSearching}/>

                            </Card>
                        ))
                    ) : (
                        <Typography variant="body1">
                            {newFriendsSearching ? "Wyszukuję użytkowników..." : "Brak wyników"}
                        </Typography>
                    )}
                </Stack>

            </Paper>
            {pagination.pages > 1 && (
                <PaginationFrame pagination={pagination} handleChange={handleChange}/>
            )}
        </Box>
    );
};

export default FriendsDump;
