import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import React from "react";

const DeleteButton = ({handleDelete}) => {
    return <DeleteOutlineIcon
        fontSize="large"
        color="error"
        cursor="pointer"
        onClick={(e) => {
            e.stopPropagation();
            handleDelete();
        }}
    />
}
export default DeleteButton;