import {Link as RouterLink} from "react-router";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import {Button} from "@mui/material";
import theme from "../../theme";

const AddButton = ({label, to}) => {
    return (
        <Button
            variant="contained"
            component={RouterLink}
            to={to}
            style={{
                backgroundColor: theme.palette.primary.dark,
                color: 'black',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '16px',
            }}
        >
            <AddCircleOutlineRoundedIcon sx={{mr: 1}}/>
            {label}
        </Button>
    );
}

export default AddButton;