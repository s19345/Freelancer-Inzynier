import EditIcon from '@mui/icons-material/Edit';
import React from "react";

const EditButton = ({handleEdit}) => {
    return <EditIcon
        fontSize="large"
        sx={{color: "secondary.light", mr: 1}}
        onClick={(e) => {
            e.stopPropagation();
            handleEdit();
        }}
    />
}
export default EditButton;