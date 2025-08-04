import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
    Avatar,
    Box, Button,
    FormControl,
    Grid,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import React from "react";
import PaginationFrame from "../common/Pagination";
import {useNavigate} from "react-router";
import paths from "../../paths";


const CollaboratorBox = ({collaborator, newFriendsSearching, handleInvite}) => {
    const navigate = useNavigate();
    const handleClick = () => {
        if (!newFriendsSearching) {
            navigate(paths.friendDetails(collaborator.id));
        }
    }

    return (<Stack alignItems="center" spacing={1}>
            <Box
                onClick={() => handleClick()}
            >
                <Avatar alt={collaborator.username} sx={{width: 60, height: 60}}></Avatar>
            </Box>
            <Typography
                variant="body2"
                color="#4b4b4b"
                align="center"
                sx={{fontFamily: "Roboto, sans-serif", fontSize: "14px"}}
            >
                {collaborator.username}
            </Typography>
            {newFriendsSearching && (
                <Button
                    onClick={() => handleInvite(collaborator.id)}
                >
                    Zapro¶
                </Button>
            )}
        </Stack>
    )
};

const Box1 = ({
                  collaborators,
                  pagination,
                  handleChange,
                  newFriendsSearching,
                  pageSize,
                  toggleNewFriendsSearching,
                  changePageSize,
                  handleInvite
              }) => {

    return (
        <Box>
            <Paper
                elevation={0}
                sx={{
                    // width: 664,  <- sta³a szeroko¶æ
                    bgcolor: "#fcfdff",
                    borderRadius: "20px",
                    p: 0,
                }}
            >
                {/* Header */
                }
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

                    <Stack direction="row" alignItems="center" spacing={2}>
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
                        {/*<Typography*/}
                        {/*    sx={{*/}
                        {/*        fontFamily: "DM Sans, sans-serif",*/}
                        {/*        fontWeight: 500,*/}
                        {/*        color: "#2c2e32",*/}
                        {/*        fontSize: "18.8px",*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    Sortuj po*/}
                        {/*</Typography>*/}
                        {/*<FormControl sx={{minWidth: 146}}>*/}
                        {/*    <Select*/}
                        {/*        value="specialization"*/}
                        {/*        displayEmpty*/}
                        {/*        sx={{*/}
                        {/*            height: 33,*/}
                        {/*            fontSize: "15px",*/}
                        {/*            fontFamily: "DM Sans, sans-serif",*/}
                        {/*            border: "1px solid #ecedee",*/}
                        {/*            borderRadius: "6px",*/}
                        {/*            "& .MuiSelect-select": {*/}
                        {/*                padding: "4px 14px",*/}
                        {/*            },*/}
                        {/*        }}*/}
                        {/*        IconComponent={KeyboardArrowDownIcon}*/}
                        {/*    >*/}
                        {/*        <MenuItem value="specialization">Specjalizacja</MenuItem>*/}
                        {/*        <MenuItem value="department">Wydzia³</MenuItem>*/}
                        {/*        <MenuItem value="location">Lokalizacja</MenuItem>*/}
                        {/*    </Select>*/}
                        {/*</FormControl>*/}
                    </Stack>
                </Stack>


                <Grid container spacing={2} justifyContent={"center"} sx={{mt: 10}}>
                    {collaborators.map((collaborator) => (
                        <Grid item xs={3} key={collaborator.id}>
                            <CollaboratorBox collaborator={collaborator} newFriendsSearching={newFriendsSearching}
                                             handleInvite={handleInvite}/>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
            {pagination.pages > 1 && (
                <PaginationFrame pagination={pagination} handleChange={handleChange}/>
            )}
        </Box>
    );
};

export default Box1;