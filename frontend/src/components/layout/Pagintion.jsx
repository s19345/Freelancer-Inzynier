import {Box, Pagination, PaginationItem, Typography} from "@mui/material";
import React from "react";

const PaginationFrame = () => {
    return (
        <Box id="pagination-box" sx={{
            width: "100%",
            maxWidth: 1053,
            padding: "40px",
            display: "flex",
            justifyContent: "center",
        }}>
            <Pagination
                count={3}
                page={1}
                renderItem={(item) => {
                    // Custom renderer for pagination items
                    if (item.type === "previous") {
                        return (
                            <PaginationItem
                                {...item}
                                component={Typography}
                                variant="body2"
                                sx={{
                                    color: "#9e9e9e",
                                    fontFamily: "Montserrat, sans-serif",
                                    fontWeight: 500,
                                    fontSize: "0.75rem",
                                    "&.Mui-disabled": {
                                        opacity: 1,
                                    },
                                }}
                            >
                                Previous
                            </PaginationItem>
                        );
                    }
                    if (item.type === "next") {
                        return (
                            <PaginationItem
                                {...item}
                                component={Typography}
                                variant="body2"
                                sx={{
                                    color: "#9e9e9e",
                                    fontFamily: "Montserrat, sans-serif",
                                    fontWeight: 500,
                                    fontSize: "0.75rem",
                                    "&.Mui-disabled": {
                                        opacity: 1,
                                    },
                                }}
                            >
                                Next
                            </PaginationItem>
                        );
                    }
                    return (
                        <PaginationItem
                            {...item}
                            sx={{
                                borderRadius: "8px",
                                padding: "8px 9px",
                                minWidth: "auto",
                                height: "auto",
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 500,
                                fontSize: "0.75rem",
                                "&.Mui-selected": {
                                    backgroundColor: "primary.main",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "primary.dark",
                                    },
                                },
                                "&:not(.Mui-selected)": {
                                    backgroundColor: "#e0e0e0",
                                    color: "black",
                                },
                            }}
                        />
                    );
                }}
            />
        </Box>
    );
};

export default PaginationFrame;